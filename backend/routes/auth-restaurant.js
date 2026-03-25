import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '../models/User.js';

const router = express.Router();

const validateRestaurantRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    profile: Joi.object({
      fullName: Joi.string().min(2).max(100).required(),
      phone: Joi.string().optional(),
      bio: Joi.string().allow('').max(500).optional(),
      gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say').optional(),
      avatar: Joi.string().allow('').optional()
    }).required(),
    restaurant: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      type: Joi.string().valid('Fine Dining', 'Casual Dining', 'Fast Food', 'Cafe', 'Bakery', 'Food Truck', 'Catering', 'Cloud Kitchen', 'Bar & Grill', 'Other').required(),
      phone: Joi.string().required(),
      address: Joi.string().min(5).max(200).required(),
      // Website is truly optional; allow empty string too
      website: Joi.string().uri().allow('').optional(),
      cuisine: Joi.array().items(Joi.string()).min(1).max(10).required()
    }).required()
  });
  return schema.validate(data);
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Restaurant / chef registration
router.post('/register/restaurant', async (req, res) => {
  try {
    const { error } = validateRestaurantRegister(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    const { username, email, password, profile, restaurant } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    // Create new restaurant user
    const user = new User({
      username,
      email,
      password,
      userType: 'restaurant',
      profile: {
        fullName: profile.fullName,
        phone: profile.phone,
        bio: profile.bio,
        gender: profile.gender,
        avatar: profile.avatar || ''
      },
      restaurant: {
        name: restaurant.name,
        type: restaurant.type,
        phone: restaurant.phone,
        address: restaurant.address,
        website: restaurant.website,
        cuisine: restaurant.cuisine,
        isVerified: false,
        rating: 0,
        reviewCount: 0
      }
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      message: 'Restaurant registered successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        profile: user.profile,
        restaurant: user.restaurant,
        token
      }
    });
  } catch (error) {
    console.error('Restaurant registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed'
    });
  }
});

export default router;
