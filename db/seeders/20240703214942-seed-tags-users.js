'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Example data: user IDs and tag IDs
    const userTagData = [
      { userId: 1, tagId: 1, createdAt: new Date(), updatedAt: new Date() },
      { userId: 1, tagId: 2, createdAt: new Date(), updatedAt: new Date() },
      { userId: 1, tagId: 10, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, tagId: 2, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, tagId: 1, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, tagId: 3, createdAt: new Date(), updatedAt: new Date() },
      { userId: 1, tagId: 3, createdAt: new Date(), updatedAt: new Date() },
      { userId: 1, tagId: 5, createdAt: new Date(), updatedAt: new Date() },
      { userId: 1, tagId: 14, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, tagId: 8, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, tagId: 6, createdAt: new Date(), updatedAt: new Date() }
    ];

    // Insert associations into the user_tag table
    await queryInterface.bulkInsert('user_tag', userTagData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all data from the user_tag table (if needed for rollback)
    await queryInterface.bulkDelete('user_tag', null, {});
  }
};
