import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('social.followers', 'username profile.fullName profile.avatar')
      .populate('social.following', 'username profile.fullName profile.avatar');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile'
    });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = [
      'profile.fullName',
      'profile.phone',
      'profile.bio',
      'profile.gender',
      'profile.avatar',
      'profile.favoriteCuisine'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('social.followers', 'username profile.fullName profile.avatar')
      .populate('social.following', 'username profile.fullName profile.avatar');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user'
    });
  }
});

router.post('/follow/:id', auth, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.userId;

    if (targetUserId === currentUserId) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot follow yourself'
      });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (currentUser.social.following.includes(targetUserId)) {
      return res.status(400).json({
        status: 'error',
        message: 'You are already following this user'
      });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $push: { 'social.following': targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $push: { 'social.followers': currentUserId }
    });

    res.json({
      status: 'success',
      message: 'User followed successfully'
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to follow user'
    });
  }
});

router.post('/unfollow/:id', auth, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.userId;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser.social.following.includes(targetUserId)) {
      return res.status(400).json({
        status: 'error',
        message: 'You are not following this user'
      });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { 'social.following': targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { 'social.followers': currentUserId }
    });

    res.json({
      status: 'success',
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to unfollow user'
    });
  }
});

router.post('/request-promotion', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Check if user has attended at least 3 events
    if (user.stats.eventsAttended < 3) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'You need at least 3 event attendances to request this feature.' 
      });
    }

    user.promotionStatus = 'pending';
    user.promotionMessage = `Completed ${user.stats.eventsAttended} event attendances this week!`;
    await user.save();

    res.json({
      status: 'success',
      message: 'Promotion request sent successfully! Admin will review it shortly.',
      data: { user }
    });
  } catch (error) {
    console.error('Request promotion error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to send request' });
  }
});

export default router;
