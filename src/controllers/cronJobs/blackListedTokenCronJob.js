const { Op } = require("sequelize");
const { sequelize } = require("../../db/db");
const BlacklistedToken = require("../../models/BlacklistedToken");

// Clean up expired blacklisted tokens
async function cleanupOldBlackListedToken() {
  const t = await sequelize.transaction();
  try {
    // Get the current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Delete tokens where the current time exceeds the createdAt time plus the expiration seconds
    const deletedCount = await BlacklistedToken.destroy({
      where: {
        [Op.and]: [
          // Calculate the age of the token in seconds
          sequelize.literal(`${currentTime} - EXTRACT(EPOCH FROM "createdAt") >= "tokenExpirationSecondsLeft"`)
        ]
      },
      transaction: t
    });

    await t.commit();
    console.log(`Deleted ${deletedCount} old BlackListed Token(s).`);
  } catch (error) {
    await t.rollback();
    console.error('Error cleaning up BlackListed Token:', error);
  }
}

module.exports = { cleanupOldBlackListedToken };
