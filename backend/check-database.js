import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import User from './models/User.js';

async function checkDatabase() {
  try {
    await connectDB();
    
    console.log('🔍 Checking database contents...\n');
    
    // Count total users
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}`);
    
    if (totalUsers > 0) {
      // Get all users (without passwords)
      const users = await User.find({}).select('-password').lean();
      
      console.log('\n👥 Registered Users:');
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.userType.toUpperCase()} USER:`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Full Name: ${user.profile.fullName}`);
        console.log(`   Phone: ${user.profile.phone || 'Not provided'}`);
        console.log(`   Bio: ${user.profile.bio || 'Not provided'}`);
        console.log(`   Gender: ${user.profile.gender || 'Not provided'}`);
        console.log(`   User Type: ${user.userType}`);
        
        if (user.userType === 'restaurant' && user.restaurant) {
          console.log(`   🍳 Restaurant Details:`);
          console.log(`      Name: ${user.restaurant.name || 'Not provided'}`);
          console.log(`      Type: ${user.restaurant.type || 'Not provided'}`);
          console.log(`      Address: ${user.restaurant.address || 'Not provided'}`);
          console.log(`      Website: ${user.restaurant.website || 'Not provided'}`);
          console.log(`      Cuisine: ${user.restaurant.cuisine?.join(', ') || 'Not provided'}`);
        }
        
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Updated: ${user.updatedAt}`);
      });
    } else {
      console.log('❌ No users found in the database');
    }
    
    console.log('\n✅ Database check completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase();
