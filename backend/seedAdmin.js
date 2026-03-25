import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    const adminExists = await User.findOne({ email: 'admin@gmail.com' });

    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const admin = await User.create({
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'admin@123',
      userType: 'admin',
      profile: {
        fullName: 'System Administrator',
        bio: 'Platform maintainer and moderator'
      }
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
