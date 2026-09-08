const express = require('express');
const router = express.Router();
const { createRoom, getRooms } = require('../controllers/roomController');
const { getMessages, createMessage } = require('../controllers/messageController');

// Room routes
router.post('/', createRoom);
router.get('/', getRooms);

// Nested message routes under /api/rooms/:roomId/messages
router.get('/:roomId/messages', getMessages);
router.post('/:roomId/messages', createMessage);

module.exports = router;
