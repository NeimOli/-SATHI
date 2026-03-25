import express from 'express';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import Event from '../models/Event.js';
import Activity from '../models/Activity.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user statistics
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get user details
    const user = await User.findById(userId)
      .populate('social.followers')
      .populate('social.following');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get user's recipes and calculate total likes and average rating
    const userRecipes = await Recipe.find({ author: userId });
    const totalLikes = userRecipes.reduce((sum, recipe) => sum + (recipe.likes || 0), 0);
    const averageRating = userRecipes.length > 0 
      ? userRecipes.reduce((sum, recipe) => sum + (recipe.rating || 0), 0) / userRecipes.length 
      : 0;

    // Get user's recipes count
    const recipesCount = userRecipes.length;

    // Get user's events (both attended and hosted)
    const eventsAttended = await Event.countDocuments({ 
      'attendees.userId': userId 
    });
    
    const eventsHosted = await Event.countDocuments({ 
      organizer: userId 
    });

    // Get favorites count (assuming favorites are stored in user profile)
    const favoritesCount = user.profile?.favoriteCuisine?.length || 0;

    // Get following/followers count
    const followersCount = user.social?.followers?.length || 0;
    const followingCount = user.social?.following?.length || 0;

    // Calculate consistency streak (consecutive days with any activity, including today)
    const now = new Date();
    const since = new Date();
    since.setDate(since.getDate() - 30); // look back 30 days

    const activities = await Activity.find({
      user: userId,
      createdAt: { $gte: since }
    })
      .sort({ createdAt: -1 })
      .lean();

    // Build a set of unique date strings (YYYY-MM-DD) with activity
    const activeDays = new Set(
      activities.map((a) => new Date(a.createdAt).toISOString().slice(0, 10))
    );

    let streak = 0;
    let cursor = new Date(now);

    while (true) {
      const dayKey = cursor.toISOString().slice(0, 10);

      if (activeDays.has(dayKey)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          userType: user.userType,
          restaurant: user.restaurant
        },
        stats: {
          recipesShared: recipesCount,
          eventsAttended: eventsAttended,
          eventsHosted: eventsHosted,
          followers: followersCount,
          following: followingCount,
          favorites: favoritesCount,
          totalLikes: totalLikes,
          averageRating: averageRating,
          consistencyStreak: streak
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user statistics'
    });
  }
});

// Get chef/restaurant statistics
router.get('/chef/:chefId', auth, async (req, res) => {
  try {
    const chefId = req.params.chefId;
    
    // Get chef user
    const chef = await User.findById(chefId);

    if (!chef || chef.userType !== 'restaurant') {
      return res.status(404).json({
        status: 'error',
        message: 'Chef not found'
      });
    }

    // Get chef's recipes and calculate stats
    const chefRecipes = await Recipe.find({ author: chefId });
    const totalLikes = chefRecipes.reduce((sum, recipe) => sum + (recipe.likes || 0), 0);
    const averageRating = chefRecipes.length > 0 
      ? chefRecipes.reduce((sum, recipe) => sum + (recipe.rating || 0), 0) / chefRecipes.length 
      : 0;

    // Get chef's recipes count
    const recipesCount = chefRecipes.length;

    // Get chef's events hosted
    const eventsHosted = await Event.countDocuments({ 
      organizer: chefId 
    });

    // Get followers count
    const followersCount = chef.social?.followers?.length || 0;

    // Calculate restaurant rating
    const rating = chef.restaurant?.rating || 0;
    const reviewCount = chef.restaurant?.reviewCount || 0;

    // Mock monthly stats (in real app, this would be calculated from orders/events)
    const monthlyStats = {
      orders: Math.floor(Math.random() * 200) + 50, // Mock data
      revenue: Math.floor(Math.random() * 50000) + 10000, // Mock data
      newFollowers: Math.floor(Math.random() * 50) + 5, // Mock data
      recipeViews: Math.floor(Math.random() * 2000) + 500 // Mock data
    };

    res.json({
      status: 'success',
      data: {
        chef: {
          id: chef._id,
          username: chef.username,
          email: chef.email,
          profile: chef.profile,
          restaurant: chef.restaurant
        },
        stats: {
          recipesShared: recipesCount,
          eventsHosted: eventsHosted,
          followers: followersCount,
          rating: rating,
          reviewCount: reviewCount,
          totalLikes: totalLikes,
          averageRating: averageRating,
          monthly: monthlyStats
        }
      }
    });
  } catch (error) {
    console.error('Error fetching chef stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch chef statistics'
    });
  }
});

// Get restaurant statistics
router.get('/restaurant/:restaurantId', auth, async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    
    // Get restaurant user
    const restaurant = await User.findById(restaurantId);

    if (!restaurant || restaurant.userType !== 'restaurant') {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    // Get restaurant's recipes count
    const recipesCount = await Recipe.countDocuments({ author: restaurantId });

    // Get restaurant's events hosted
    const eventsHosted = await Event.countDocuments({ 
      organizer: restaurantId 
    });

    // Get followers count
    const followersCount = restaurant.social?.followers?.length || 0;

    // Calculate average rating (could be stored in restaurant profile)
    const rating = restaurant.restaurant?.rating || 0;
    const reviewCount = restaurant.restaurant?.reviewCount || 0;

    // Mock monthly stats (in real app, this would be calculated from orders/events)
    const monthlyStats = {
      orders: Math.floor(Math.random() * 200) + 50, // Mock data
      revenue: Math.floor(Math.random() * 50000) + 10000, // Mock data
      newFollowers: Math.floor(Math.random() * 50) + 5, // Mock data
      recipeViews: Math.floor(Math.random() * 2000) + 500 // Mock data
    };

    res.json({
      status: 'success',
      data: {
        restaurant: {
          id: restaurant._id,
          username: restaurant.username,
          email: restaurant.email,
          profile: restaurant.profile,
          restaurant: restaurant.restaurant
        },
        stats: {
          recipesShared: recipesCount,
          eventsHosted: eventsHosted,
          followers: followersCount,
          rating: rating,
          reviewCount: reviewCount,
          monthly: monthlyStats
        }
      }
    });
  } catch (error) {
    console.error('Error fetching restaurant stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch restaurant statistics'
    });
  }
});

// Update user statistics (for tracking)
router.post('/track/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { action, data } = req.body; // action: 'recipe_view', 'event_attend', etc.

    // Update user stats based on action
    let updateField = {};
    
    switch (action) {
      case 'recipe_view':
        updateField = { $inc: { 'stats.recipesCount': 1 } };
        break;
      case 'event_attend':
        updateField = { $inc: { 'stats.eventsAttended': 1 } };
        break;
      case 'event_host':
        updateField = { $inc: { 'stats.eventsHosted': 1 } };
        break;
      case 'follow':
        updateField = { $inc: { 'stats.followers': 1 } };
        break;
      default:
        break;
    }

    if (Object.keys(updateField).length > 0) {
      await User.findByIdAndUpdate(userId, updateField);
    }

    // Record activity entry
    await Activity.create({
      user: userId,
      type: action,
      metadata: data || {},
    });

    res.json({
      status: 'success',
      message: 'Statistics and activity updated'
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update statistics'
    });
  }
});

// Public community overview stats
router.get('/community/overview', async (req, res) => {
  try {
    const [homeCooks, sharedRecipes, mealsAgg, reviewsAgg] = await Promise.all([
      User.countDocuments({ userType: 'user' }),
      Recipe.countDocuments({ isPublic: true }),
      Recipe.aggregate([
        {
          $group: {
            _id: null,
            totalServings: { $sum: '$servings' }
          }
        }
      ]),
      Recipe.aggregate([
        {
          $group: {
            _id: null,
            totalReviews: { $sum: '$ratings.count' }
          }
        }
      ])
    ]);

    const happyMeals = mealsAgg[0]?.totalServings || 0;
    const recipeReviews = reviewsAgg[0]?.totalReviews || 0;

    res.json({
      status: 'success',
      data: {
        homeCooks,
        sharedRecipes,
        happyMeals,
        recipeReviews
      }
    });
  } catch (error) {
    console.error('Error fetching community overview stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch community overview statistics'
    });
  }
});

export default router;
