const mongoose = require('mongoose');
const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');

// GET /api/rooms/:roomId/messages - Get chat history for a room
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID format' });
    }

    // Check whether the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Find messages in room, populate sender username, sorted chronologically
    const messages = await Message.find({ room: roomId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    return res.status(500).json({ message: 'Server error fetching messages' });
  }
};

// POST /api/rooms/:roomId/messages - Create a new message in a room
const createMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { senderId, content } = req.body;

    // Validate room ID format
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID format' });
    }

    // Validate sender ID format
    if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: 'Valid senderId is required' });
    }

    // Validate message content
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    // Validate that room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Validate that sender exists
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Create and save message
    const message = await Message.create({
      room: roomId,
      sender: senderId,
      content: content.trim()
    });

    // Populate sender info for the response
    await message.populate('sender', 'username');

    return res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error.message);
    return res.status(500).json({ message: 'Server error creating message' });
  }
};

module.exports = {
  getMessages,
  createMessage
};
