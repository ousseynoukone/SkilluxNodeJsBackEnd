
const { Notification,sequelize} = require("../../db/models");
const { sendNotificationToUser ,sendPostNotificationToUser} = require("./notification/notificationSEEController");

async function saveNotification(ressourceId,toUserId,fromUserId,type,transaction) {
  try {
      const notification = await Notification.create(
          {
            ressourceId:ressourceId,
            toUserId : toUserId,
            fromUserId : fromUserId,
            type : type,
          },
          {
            returning:true,
            transaction:transaction
          }
        )
        await sendNotificationToUser(toUserId)
        return { success: true, notification };

  } catch (error) {

    return { success: false, error: error.toString() };
  }
}

// Helper function to save bulk notifications
async function saveBulkNotification(ressourceId, arrayOfToUserId, fromUserId, type, transaction) {
  try {
    const notifications = await Notification.bulkCreate(
      arrayOfToUserId.map(id => ({
        ressourceId: ressourceId,
        toUserId: id,
        fromUserId: fromUserId,
        type: type,
      })),
      { 
        returning: true, 
        transaction: transaction 
      }
    );
  await sendPostNotificationToUser(arrayOfToUserId)


    return { success: true, notifications };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

module.exports = {saveNotification,saveBulkNotification};