'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('comments', [
      {
        text: 'This is the first comment',
        isModified: false,
        like: 0,
        userId: 1, // Make sure this corresponds to an existing user
        postId: 1, // Make sure this corresponds to an existing post
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Great post! Looking forward to more.',
        isModified: false,
        like: 0,
        userId: 2, // Make sure this corresponds to an existing user
        postId: 1, // Make sure this corresponds to an existing post
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'This is the second comment',
        isModified: false,
        like: 0,
        userId: 2, // Make sure this corresponds to an existing user
        postId: 2, // Make sure this corresponds to an existing post
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'I have a question about this topic.',
        isModified: false,
        like: 0,
        userId: 1, // Make sure this corresponds to an existing user
        postId: 2, // Make sure this corresponds to an existing post
        parentId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Answering your question...',
        isModified: false,
        like: 0,
        userId: 2, // Make sure this corresponds to an existing user
        postId: 2, // Make sure this corresponds to an existing post
        parentId: 4, // Reply to the comment with id 4 (parent comment)
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Nice explanation!',
        isModified: false,
        like: 0,
        userId: 1, // Make sure this corresponds to an existing user
        postId: 1, // Make sure this corresponds to an existing post
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Looking forward to the next update.',
        isModified: false,
        like: 0,
        userId: 1, // Make sure this corresponds to an existing user
        postId: 1, // Make sure this corresponds to an existing post
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('comments', null, {});
  }
};
