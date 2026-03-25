import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// Placeholder route: return empty orders list for a restaurant
router.get('/restaurant/:restaurantId', auth, async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: {
        orders: []
      }
    });
  } catch (error) {
    console.error('Get restaurant orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch restaurant orders'
    });
  }
});

export default router;

