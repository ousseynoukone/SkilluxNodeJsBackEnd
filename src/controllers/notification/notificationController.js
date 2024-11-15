const { Op } = require("sequelize");
const db = require("../../../db/models/index");
const { Notification, User, Comment, Post, sequelize } = db;
const {notificationMessage , getResource} = require("./helper");
const { sendNotificationToUser,sendPostNotificationToUser} = require("./notificationSEEController");


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
      limit: limit + 1, // Add 1 to check if there are more
      transaction: t
    });

    const hasMore = rawNotifications.length > limit;
    rawNotifications = hasMore ? rawNotifications.slice(0, limit) : rawNotifications;

    // Fetch associated resources (posts or comments)
    const notificationsWithResources = await Promise.all(rawNotifications.map(async notification => {
      const notifJSON = notification.toJSON();
      if (notification.type === "comment" || notification.type === "like") {
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
    let groupedNotifications = await groupNotifications(notificationsWithResources, userLang);



    // Apply limit after grouping
    groupedNotifications = groupedNotifications.slice(0, limit + 1);



    // Get IDs of unread notifications
    const notificationIds = rawNotifications.map(notif => notif.id);
    if (notificationIds.length > 0) {
      await Notification.update(
        { isRead: true },
        {
          where: {
            id: notificationIds
          },
          transaction: t
        }
      );
    }
    await sendNotificationToUser(userId);

    // Determine the next cursor
    const nextCursor = hasMore ? rawNotifications[rawNotifications.length - 1].createdAt : null;


    await t.commit();

    return res.status(200).json({ userNotifications: groupedNotifications, nextCursor, hasMore });
  } catch (error) {
    await t.rollback();
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: error.toString() });
  }
};

async function groupNotifications(notifications, userLang = 'en') {
  let grouped = {};
  for (let notif of notifications) {
    // Create a date key based on the date (rounded to the day)
    const date = new Date(notif.createdAt);
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        
    // Determine the grouping key based on notification type
    let typeKey;
    switch (notif.type) {
      case 'vote':
        typeKey = `${notif.type}_${notif.ressourceId}`;
        break;

      case 'like':
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
        ressource: await getResource(notif),
        createdAt: notif.createdAt, 
        users: [notif.fromUser],
        resourcesIds: [notif.ressourceId]
      };
    } else {
      grouped[key].count++;
      grouped[key].users.push(notif.fromUser);

      if (!grouped[key].resourcesIds.includes(notif.ressourceId)) {
        grouped[key].resourcesIds.push(notif.ressourceId);
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
  // const fullName = group.users.slice(0, 3).map(u => u.fullName);
  const othersCount = Math.max(0, group.count - 3);
  const translatedMessage = notificationMessage[userLang];
  let message = '';

  if (othersCount > 0) {
    message += ` ${translatedMessage.and} ${othersCount} ${translatedMessage.others}`;
  }

  switch (group.type) {
    case 'vote':
      message += group.count > 1 && userLang == 'fr' ? ` ${translatedMessage.votes}` : ` ${translatedMessage.vote}`;
      break;

    case 'like':
      message += group.count > 1 && userLang == 'fr' ? ` ${translatedMessage.likes}` : ` ${translatedMessage.like}`;
      break;

    case 'comment':
      // If the comment is a response to another comment
      if(group.ressource.targetId){
        message += group.count > 1 && userLang == 'fr' ? ` ${translatedMessage.commentsAnswer}` : ` ${translatedMessage.commentAnswer}`;
      }else{
        message += group.count > 1 && userLang == 'fr' ? ` ${translatedMessage.comments}` : ` ${translatedMessage.comment}`;
      }
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

exports.groupNotifications = groupNotifications;
