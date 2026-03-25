import express from 'express';
import protect from '../middleware/auth.js';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import Event from '../models/Event.js';

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.userType === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};

// @route   GET /api/admin/restaurants/pending
// @desc    Get all pending restaurant verifications
// @access  Private/Admin
router.get('/restaurants/pending', protect, adminOnly, async (req, res) => {
  try {
    const pendingRestaurants = await User.find({
      userType: 'restaurant',
      'restaurant.isVerified': false
    }).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingRestaurants.length,
      data: { restaurants: pendingRestaurants }
    });
  } catch (error) {
    console.error('Error fetching pending restaurants:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PUT /api/admin/restaurants/:id/verify
// @desc    Verify a restaurant/chef
// @access  Private/Admin
router.put('/restaurants/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.userType !== 'restaurant') {
      return res.status(400).json({ success: false, message: 'User is not a restaurant/chef' });
    }

    user.restaurant.isVerified = true;
    await user.save();

    res.json({
      success: true,
      data: { user: user.toJSON() },
      message: 'Restaurant successfully verified'
    });
  } catch (error) {
    console.error('Error verifying restaurant:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/admin/restaurants/verified
// @desc    Get all verified chefs/restaurants
// @access  Private/Admin
router.get('/restaurants/verified', protect, adminOnly, async (req, res) => {
  try {
    const verifiedRestaurants = await User.find({
      userType: 'restaurant',
      'restaurant.isVerified': true
    }).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: verifiedRestaurants.length,
      data: { restaurants: verifiedRestaurants }
    });
  } catch (error) {
    console.error('Error fetching verified restaurants:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete any user (regular or chef)
// @access  Private/Admin
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Optional: Delete associated recipes/events if needed
    if (user.userType === 'restaurant') {
      await Recipe.deleteMany({ author: user._id });
      await Event.deleteMany({ organizer: user._id });
    } else {
      await Recipe.deleteMany({ author: user._id });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all regular users
// @access  Private/Admin
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ userType: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: { users }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private/Admin
// @route   GET /api/admin/promotion-requests
// @desc    Get all pending user promotion requests
// @access  Private/Admin
router.get('/promotion-requests', protect, adminOnly, async (req, res) => {
  try {
    const pendingPromotions = await User.find({
      promotionStatus: 'pending'
    }).select('-password').sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: pendingPromotions.length,
      data: { users: pendingPromotions }
    });
  } catch (error) {
    console.error('Error fetching promotion requests:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PUT /api/admin/promote/:id
// @desc    Approve user promotion to unlock 'Create Recipe'
// @access  Private/Admin
router.put('/promote/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.canCreateRecipe = true;
    user.promotionStatus = 'approved';
    await user.save();

    res.json({
      success: true,
      data: { user: user.toJSON() },
      message: 'User successfully promoted to create recipes'
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ userType: 'user' });
    const totalChefs = await User.countDocuments({ userType: 'restaurant' });
    const totalRecipes = await Recipe.countDocuments();
    const totalEvents = await Event.countDocuments();

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalChefs,
          totalRecipes,
          totalEvents
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;
