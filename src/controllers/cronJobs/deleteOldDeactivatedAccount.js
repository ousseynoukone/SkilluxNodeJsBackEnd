const { Op } = require("sequelize");
const { sequelize } = require("../../db/db");
const User = require("../../models/User");

// Clean up expired blacklisted tokens
async function cleanupOldDeactivatedAccount() {
  const t = await sequelize.transaction();
  try {
    const user = await User.findOne({where:{email:req.user.email}})


    // Delete tokens where the current time exceeds the createdAt time plus the expiration seconds
    const deletedCount = await User.destroy({
      where: {
        isActive:false
      },
      transaction: t
    });

    await t.commit();
    console.log(`Deleted ${deletedCount} old Deactivated Account(s).`);
  } catch (error) {
    await t.rollback();
    console.error('Error cleaning up Old Deactivated Account(s)', error);
  }
}

module.exports = { cleanupOldDeactivatedAccount };
