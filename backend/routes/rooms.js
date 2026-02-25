const express = require('express');
const { body, validationResult } = require('express-validator');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const { generateRoomId } = require('../utils/helpers');

const router = express.Router();

// @route   POST /api/rooms
// @desc    Create a new room
// @access  Private
router.post('/', [
  auth,
  body('name').notEmpty().withMessage('Room name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const roomId = generateRoomId();

    const room = new Room({
      roomId,
      name,
      host: req.user._id,
      participants: [{
        user: req.user._id,
        role: 'host'
      }]
    });

    await room.save();
    await room.populate('host', 'username email avatar');

    res.status(201).json({
      room: {
        id: room._id,
        roomId: room.roomId,
        name: room.name,
        host: room.host,
        participantCount: room.participants.length,
        createdAt: room.createdAt
      }
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/rooms/:roomId
// @desc    Get room details
// @access  Private
router.get('/:roomId', auth, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate('host', 'username email avatar')
      .populate('participants.user', 'username email avatar');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      room: {
        id: room._id,
        roomId: room.roomId,
        name: room.name,
        host: room.host,
        participants: room.participants,
        canvasData: room.canvasData,
        chatMessages: room.chatMessages.slice(-50), // Last 50 messages
        isActive: room.isActive,
        createdAt: room.createdAt
      }
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/rooms/:roomId/join
// @desc    Join a room
// @access  Private
router.post('/:roomId/join', auth, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isActive) {
      return res.status(400).json({ message: 'Room is not active' });
    }

    // Check if user is already in the room
    const existingParticipant = room.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!existingParticipant) {
      if (room.participants.length >= room.maxParticipants) {
        return res.status(400).json({ message: 'Room is full' });
      }

      room.participants.push({
        user: req.user._id,
        role: 'participant'
      });

      await room.save();
    }

    await room.populate('host', 'username email avatar');
    await room.populate('participants.user', 'username email avatar');

    res.json({
      room: {
        id: room._id,
        roomId: room.roomId,
        name: room.name,
        host: room.host,
        participants: room.participants,
        canvasData: room.canvasData,
        chatMessages: room.chatMessages.slice(-50),
        isActive: room.isActive,
        createdAt: room.createdAt
      }
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/rooms
// @desc    Get user's rooms
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { host: req.user._id },
        { 'participants.user': req.user._id }
      ]
    })
    .populate('host', 'username email avatar')
    .sort({ updatedAt: -1 })
    .limit(20);

    res.json({
      rooms: rooms.map(room => ({
        id: room._id,
        roomId: room.roomId,
        name: room.name,
        host: room.host,
        participantCount: room.participants.length,
        isActive: room.isActive,
        updatedAt: room.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;