const { Op } = require("sequelize");
const Notification = require("../../models/Notification");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

// Get all notifications for the connected user
exports.getUserNotifications = async (req, res) => {
    try {
    // Parse and validate limit
    const limit = parseInt(req.params.limit, 10) || 10;

    // Parse and validate cursor
    const rawCursor = req.params.cursor;
    const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;

      const userId = req.user.id;
  
      const notifications = await Notification.findAll({
        where: {
            [Op.and]: [
              { toUserId: userId },
              cursor ? { createdAt: { [Op.lt]: cursor } } : {},
            ],
          },

        include: [
          {
            model: User,
            as: 'fromUser',
            attributes: ['fullName', 'username', 'email', 'profilePicture']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: limit,

      });
  
      // Utilisez Promise.all pour attendre que toutes les promesses soient résolues
      const populatedNotifications = await Promise.all(notifications.map(async notification => {
        const notificationData = notification.toJSON(); // Convertissez en objet JavaScript pur
  
        if (notificationData.type === "comment") {
          const comment = await Comment.findByPk(notificationData.ressourceId);
          notificationData.ressource = comment ? comment.toJSON() : null;
        } else if (notificationData.type === "post" || notificationData.type === "vote") {
          const post = await Post.findByPk(notificationData.ressourceId);
          notificationData.ressource = post ? post.toJSON() : null;
        }
  
        return notificationData;
      }));

          // Determine the next cursor
    const nextCursor =
    populatedNotifications.length > 0
      ? populatedNotifications[populatedNotifications.length - 1].createdAt
      : null;
  
      return res.status(200).json({populatedNotifications,nextCursor});
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ error: error.toString() });
    }
  };
  
  // Mark a notification as read
  exports.markNotificationAsRead = async (req, res) => {
    try {
      const notificationId = req.params.id;
      const userId = req.user.id;
  
      const notification = await Notification.findOne({
        where: { id: notificationId, toUserId: userId },
      });
  
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
  
      notification.isRead = true;
      await notification.save();
  
      return res.status(200).json({ success: 'Notification marked as read' });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return res.status(500).json({ error: error.toString() });
    }
  };





