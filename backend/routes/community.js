import express from 'express';
import auth from '../middleware/auth.js';
import CommunityGroup from '../models/CommunityGroup.js';
import GroupMessage from '../models/GroupMessage.js';

const router = express.Router();

// GET all community groups
router.get('/groups', async (req, res) => {
  try {
    const groups = await CommunityGroup.find()
      .populate('creator', 'username profile.fullName')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        groups
      }
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch community groups'
    });
  }
});

// POST to create a new group
router.post('/groups', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and description are required'
      });
    }

    const group = new CommunityGroup({
      name,
      description,
      creator: req.user.userId,
      members: [req.user.userId] // creator automatically joins
    });

    await group.save();
    await group.populate('creator', 'username profile.fullName');

    res.status(201).json({
      status: 'success',
      message: 'Group created successfully',
      data: { group }
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create group'
    });
  }
});

// POST to join a group
router.post('/groups/:groupId/join', auth, async (req, res) => {
  try {
    const group = await CommunityGroup.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({
        status: 'error',
        message: 'Group not found'
      });
    }

    if (group.members.includes(req.user.userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Already a member of this group'
      });
    }

    group.members.push(req.user.userId);
    await group.save();

    res.json({
      status: 'success',
      message: 'Joined group successfully',
      data: { group }
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to join group'
    });
  }
});

// GET messages for a group
router.get('/groups/:groupId/messages', auth, async (req, res) => {
  try {
    const group = await CommunityGroup.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({
        status: 'error',
        message: 'Group not found'
      });
    }

    // Check if user is a member
    if (!group.members.includes(req.user.userId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You must join the group to view messages'
      });
    }

    const messages = await GroupMessage.find({ group: req.params.groupId })
      .populate('author', 'username profile.fullName')
      .populate('recipeId', 'title images')
      .sort({ createdAt: 1 }); // Oldest first for chat UI

    res.json({
      status: 'success',
      data: {
        messages
      }
    });
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch group messages'
    });
  }
});

// POST a message to a group
router.post('/groups/:groupId/messages', auth, async (req, res) => {
  try {
    const { content, recipeId } = req.body;
    
    if (!content) {
      return res.status(400).json({
        status: 'error',
        message: 'Message content is required'
      });
    }

    const group = await CommunityGroup.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({
        status: 'error',
        message: 'Group not found'
      });
    }

    // Check if user is a member
    if (!group.members.includes(req.user.userId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You must join the group to send a message'
      });
    }

    const message = new GroupMessage({
      group: req.params.groupId,
      author: req.user.userId,
      content,
      recipeId: recipeId || null
    });

    await message.save();
    
    // Populate to return the full author data instantly to the UI
    await message.populate('author', 'username profile.fullName');
    if (recipeId) {
      await message.populate('recipeId', 'title images');
    }

    res.status(201).json({
      status: 'success',
      data: { message }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message'
    });
  }
});

// For backward compatibility while front-end is updated
router.get('/posts', async (req, res) => {
  res.json({ status: 'success', data: { posts: [], pagination: { current: 1, pages: 1, total: 0 } } });
});

export default router;
