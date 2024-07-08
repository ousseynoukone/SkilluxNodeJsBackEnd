const express = require('express');
const router = express.Router();

const { getUserNotifications } = require('../controllers/notification/notificationController');
const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const { sendNotification } = require('../controllers/notification/notificationSEEController');

// NOTIFICATION ENDPOINT
router.get('/basic/notifications/:limit/:cursor', authenticateToken, getUserNotifications);

// SSE endpoint for notifications
router.get('/basic/sse-notifications/', authenticateToken, sendNotification);

module.exports = router;
