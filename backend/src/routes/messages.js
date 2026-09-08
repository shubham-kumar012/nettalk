const express = require('express');
const router = express.Router({ mergeParams: true });
const { getMessages, createMessage } = require('../controllers/messageController');

// Message routes
router.get('/', getMessages);
router.post('/', createMessage);

module.exports = router;
