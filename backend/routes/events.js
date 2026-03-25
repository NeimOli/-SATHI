import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

const events = [];

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, location } = req.query;
    
    let filteredEvents = events;
    
    if (type) {
      filteredEvents = filteredEvents.filter(event => event.type === type);
    }
    
    if (location) {
      filteredEvents = filteredEvents.filter(event => 
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: {
        events: paginatedEvents,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredEvents.length / limit),
          total: filteredEvents.length
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch events'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = events.find(e => e.id === req.params.id);
    
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    res.json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch event'
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const event = {
      id: Date.now().toString(),
      ...req.body,
      host: req.user.userId,
      attendees: [req.user.userId],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    events.push(event);

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create event'
    });
  }
});

router.post('/:id/attend', auth, async (req, res) => {
  try {
    const event = events.find(e => e.id === req.params.id);
    
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    if (event.attendees.includes(req.user.userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'You are already attending this event'
      });
    }

    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({
        status: 'error',
        message: 'Event is full'
      });
    }

    event.attendees.push(req.user.userId);
    event.updatedAt = new Date();

    res.json({
      status: 'success',
      message: 'Successfully joined the event',
      data: { event }
    });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to join event'
    });
  }
});

export default router;
