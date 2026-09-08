const Room = require('../models/Room');

// POST /api/rooms - Create a new chat room
const createRoom = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Room name is required' });
    }

    const trimmedName = name.trim();

    // Check if room already exists
    const existingRoom = await Room.findOne({ name: trimmedName });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const room = await Room.create({ name: trimmedName });
    return res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error.message);
    return res.status(500).json({ message: 'Server error creating room' });
  }
};

// GET /api/rooms - Get all chat rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: 1 });
    return res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error.message);
    return res.status(500).json({ message: 'Server error fetching rooms' });
  }
};

module.exports = {
  createRoom,
  getRooms
};
