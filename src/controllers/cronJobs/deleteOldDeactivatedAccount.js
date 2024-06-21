const { Op } = require("sequelize");
const { sequelize } = require("../../db/db");
const User = require("../../models/User");

async function cleanupOldDeactivatedAccount() {
  const t = await sequelize.transaction();
  try {
    // Calculate the date 10 minutes ago from now
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

    // Delete users where isActive is false and createdAt is older than 10 minutes
    const deletedCount = await User.destroy({
      where: {
        isActive: false,
        createdAt: {
          [Op.lt]: tenMinutesAgo
        }
      },
      transaction: t
    });

    await t.commit();
    console.log(`Deleted ${deletedCount} old deactivated account(s).`);
  } catch (error) {
    await t.rollback();
    console.error('Error cleaning up old deactivated account(s)', error);
  }
}

module.exports = { cleanupOldDeactivatedAccount };
