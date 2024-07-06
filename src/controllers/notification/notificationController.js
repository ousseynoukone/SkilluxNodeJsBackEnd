const { Op } = require("sequelize");
const db = require("../../../db/models/index");
const { Notification, User, Comment, Post, sequelize } = db;
const notificationMessage = require("./helper");

exports.getUserNotifications = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const limit = parseInt(req.params.limit, 10) || 10;
    const rawCursor = req.params.cursor;
    const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;
    const userId = req.user.id;
    const userLang = req.user.lang || 'en';

    // Fetch raw notifications
    let rawNotifications = await Notification.findAll({
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
      transaction: t
    });

    // Fetch associated resources (posts or comments)
    const notificationsWithResources = await Promise.all(rawNotifications.map(async notification => {
      const notifJSON = notification.toJSON();
      if (notification.type === "comment") {
        const comment = await Comment.findByPk(notification.ressourceId, { 
          transaction: t,
          include: [{ model: Post, attributes: ['id', 'title'] }]
        });
        notifJSON.ressource = comment ? comment.toJSON() : null;
      } else if (notification.type === "post" || notification.type === "vote") {
        const post = await Post.findByPk(notification.ressourceId, { 
          transaction: t, 
          attributes: ['id', 'title', 'headerImage']
        });
        notifJSON.ressource = post ? post.toJSON() : null;
      }
      return notifJSON;
    }));


    // Group notifications
    let groupedNotifications = groupNotifications(notificationsWithResources, userLang);

    // Apply limit after grouping
    groupedNotifications = groupedNotifications.slice(0, limit + 1);

    // Determine if there are more records to fetch
    const hasMore = groupedNotifications.length > limit;
    groupedNotifications = hasMore ? groupedNotifications.slice(0, -1) : groupedNotifications;

    // Get IDs of unread notifications
    const unreadNotificationIds = groupedNotifications
      .filter(notif => !notif.isRead)
      .map(notification => notification.id);

    // Mark notifications as read
    if (unreadNotificationIds.length > 0) {
      await Notification.update(
        { isRead: true },
        {
          where: {
            id: unreadNotificationIds
          },
          transaction: t
        }
      );
    }

    // Determine the next cursor
    const nextCursor = groupedNotifications.length > 0
      ? groupedNotifications[groupedNotifications.length - 1].createdAt
      : null;

    await t.commit();

    return res.status(200).json({ userNotifications: groupedNotifications, nextCursor, hasMore });
  } catch (error) {
    await t.rollback();
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: error.toString() });
  }
};

function groupNotifications(notifications, userLang) {
  let grouped = {};
  for (let notif of notifications) {
    // Create a date key based on the date (rounded to the day)
 // Create an hour key based on the date and hour
    const date = new Date(notif.createdAt);
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getDay().toString().padStart(2, '0')}`;
        
    // Determine the grouping key based on notification type
    let typeKey;
    switch (notif.type) {
      case 'vote':
        typeKey = `${notif.type}_${notif.ressourceId}`;
        break;
      case 'comment':
        typeKey = `${notif.type}_${notif.ressource.postId}`;
        break;
      case 'post':
        typeKey = `${notif.type}_${notif.ressourceId}`;
        break;
      case 'follow':
        typeKey = 'follow';
        break;
      default:
        typeKey = `${notif.type}_${notif.ressourceId}`;
    }

    // Combine date and type keys
    const key = `${dateKey}_${typeKey}`;

    if (!grouped[key]) {
      grouped[key] = {
        type: notif.type,
        count: 1,
        ressource: notif.type == 'comment' ? {id: notif.ressource.postId} : notif.ressource,
        createdAt: notif.createdAt,
        users: [notif.fromUser],
        resources: [notif.ressourceId]
      };
    } else {
      grouped[key].count++;
      grouped[key].users.push(notif.fromUser);
      if (!grouped[key].resources.includes(notif.ressourceId)) {
        grouped[key].resources.push(notif.ressourceId);
      }
      // Update createdAt to the most recent notification in the group
      if (new Date(notif.createdAt) > new Date(grouped[key].createdAt)) {
        grouped[key].createdAt = notif.createdAt;
      }
    }
  }

  return Object.values(grouped).map(group => ({
    ressource: group.ressource,
    type: group.type,
    notifCreatedAt: group.createdAt,
    count: group.count,
    users: group.users.slice(0, 3),
    message: formatNotificationMessage(group, userLang)
  }));
}

function formatNotificationMessage(group, userLang) {
  const fullName = group.users.slice(0, 3).map(u => u.fullName);
  const othersCount = Math.max(0, group.count - 3);
  const translatedMessage = notificationMessage[userLang];

  let message = '';
  if (fullName.length === 1) {
    message = `${fullName[0]}`;
  } else if (fullName.length === 2) {
    message = `${fullName[0]} ${translatedMessage.and} ${fullName[1]}`;
  } else if (fullName.length === 3) {
    message = `${fullName[0]}, ${fullName[1]} ${translatedMessage.and} ${fullName[2]}`;
  }

  if (othersCount > 0) {
    message += ` ${translatedMessage.and} ${othersCount} ${translatedMessage.others}`;
  }

  switch (group.type) {
    case 'vote':
      message += group.count > 1 && userLang == 'fr' ? ` ${translatedMessage.likes}` : ` ${translatedMessage.like}`;
      break;
    case 'comment':
      message += group.count > 1 && userLang == 'fr' ? ` ${translatedMessage.comments}` : ` ${translatedMessage.comment}`;
      break;
    case 'follow':
      message += group.count > 1 && userLang == 'fr' ? ` ${translatedMessage.follows}` : ` ${translatedMessage.follow}`;
      break;
    case 'post':
      message += ` ${translatedMessage.post}`;
      break;
  }

  return message;
}