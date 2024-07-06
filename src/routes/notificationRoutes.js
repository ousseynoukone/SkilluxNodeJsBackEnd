const express = require('express');
const router = express.Router();

const { getUserNotifications } = require('../controllers/notification/notificationController');
const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");

// NOTIFICATION ENDPOINTS
router.get('/basic/notifications/:limit/:cursor', authenticateToken, getUserNotifications);
// router.patch('/basic/notifications/:id/read', authenticateToken, markNotificationAsRead);

module.exports = router;
