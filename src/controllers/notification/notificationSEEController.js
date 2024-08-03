const db = require("../../../db/models/index");
const { Notification, User, Post, Comment } = db;
const { Op } = require("sequelize");
const { groupNotifications } = require("./notificationController");

// Store connected clients
const clients = new Map();

// Notification queue
const notificationQueue = new Map();

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Function to process the notification queue
const processNotificationQueue = async (userId) => {
  if (notificationQueue.has(userId)) {
    const client = clients.get(Number(userId));
    if (client) {
      const count = await ungroupedNotificationCounter(userId);
      client.write(`data: ${JSON.stringify(count)}\n\n`);
    }
    notificationQueue.delete(userId);
  }
};

// Debounced version of processNotificationQueue
const debouncedProcessQueue = debounce(processNotificationQueue, 500);

// Function to send a notification to a specific user
exports.sendNotificationToUser = async (userId) => {
  notificationQueue.set(userId, true);
  debouncedProcessQueue(userId);
};

// Function to send notifications to multiple users
exports.sendPostNotificationToUser = async (arrayOfToUserId) => {
  for (const userId of arrayOfToUserId) {
    notificationQueue.set(userId, true);
    debouncedProcessQueue(userId);
  }
};

// Function to count new notifications
async function ungroupedNotificationCounter(userId) {
  let count = await Notification.count({
    where: {
      [Op.and]: [
        { toUserId: userId },
        { isRead: false }
      ],
    },
  });
  return count;
}

exports.sendNotification = async (req, res) => {
  var userId = req.user.id;
  
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Send an initial message
  res.write('data: Connected to notification stream\n\n');

  // Add this client to the map of connected clients
  clients.set(userId, res);

  // Send the initial notification count to the user
  const initialCount = await ungroupedNotificationCounter(userId);
  res.write(`data: ${JSON.stringify(initialCount)}\n\n`);

  // Remove client when they disconnect
  req.on('close', () => {
    clients.delete(userId);
  });
};