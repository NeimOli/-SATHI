import express from 'express';
import Activity from '../models/Activity.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get recent activity for logged-in user
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const activities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      status: 'success',
      data: {
        activities,
      },
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recent activity',
    });
  }
});

export default router;

