const { cleanUpNotificationDate } = require("../../parameters/constants");
const { Op } = require("sequelize");
const db = require("../../../db/models/index");
const {Notification} = db;
const sequelize = db.sequelize;

// clean up old  read notification 
async function cleanupOldNotifications() {
    const t = await sequelize.transaction();
    
    try {
      const oneWeekAgo = new Date(Date.now() - cleanUpNotificationDate);
      const deletedCount = await Notification.destroy({
        where: {
          isRead: true,
          createdAt: { [Op.lt]: oneWeekAgo }
        },
        transaction: t
      });
      await t.commit();
      console.log(`Deleted ${deletedCount} old notifications.`);
    } catch (error) {
      await t.rollback();
      console.error('Error cleaning up notifications:', error);
    }
  };
  
module.exports = {cleanupOldNotifications}