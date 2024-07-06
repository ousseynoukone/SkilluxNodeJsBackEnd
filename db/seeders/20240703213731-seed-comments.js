'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('comments', [
      {
        text: 'This is the first comment',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Great post! Looking forward to more.',
        isModified: false,
        like: 0,
        userId: 2,
        postId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'This is the second comment',
        isModified: false,
        like: 0,
        userId: 2,
        postId: 2,
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'I have a question about this topic.',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 2,
        parentId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Answering your question...',
        isModified: false,
        like: 0,
        userId: 2,
        postId: 2,
        parentId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Nice explanation!',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Looking forward to the next update.',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'I enjoyed reading this post.',
        isModified: false,
        like: 0,
        userId: 3,
        postId: 3,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Interesting insights!',
        isModified: false,
        like: 0,
        userId: 3,
        postId: 3,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Can you elaborate more on this point?',
        isModified: false,
        like: 0,
        userId: 3,
        postId: 3,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'I agree with your analysis.',
        isModified: false,
        like: 0,
        userId: 2,
        postId: 4,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'This topic is very relevant today.',
        isModified: false,
        like: 0,
        userId: 2,
        postId: 4,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'I have a different perspective on this.',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 5,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Could you clarify this point?',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 5,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'I found this article very informative.',
        isModified: false,
        like: 0,
        userId: 3,
        postId: 6,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Looking forward to your next post!',
        isModified: false,
        like: 0,
        userId: 3,
        postId: 6,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'This is an interesting viewpoint.',
        isModified: false,
        like: 0,
        userId: 2,
        postId: 7,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'I appreciate the effort put into this.',
        isModified: false,
        like: 0,
        userId: 2,
        postId: 7,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Can you recommend further reading on this?',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 8,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'I have shared this with my friends.',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 8,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Replies to existing comments
      {
        text: 'Thanks for your comment!',
        isModified: false,
        like: 0,
        userId: 3,
        postId: 1,
        parentId: 1, // Reply to the first comment on post 1
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'I agree with this point!',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 2,
        parentId: 4, // Reply to the fourth comment on post 2
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Interesting question!',
        isModified: false,
        like: 0,
        userId: 2,
        postId: 3,
        parentId: 8, // Reply to the eighth comment on post 3
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'I hadn\'t thought about it that way!',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 4,
        parentId: 11, // Reply to the eleventh comment on post 4
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Thanks for sharing your perspective!',
        isModified: false,
        like: 0,
        userId: 3,
        postId: 5,
        parentId: 13, // Reply to the thirteenth comment on post 5
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Here are some resources on the topic.',
        isModified: false,
        like: 0,
        userId: 2,
        postId: 6,
        parentId: 16, // Reply to the sixteenth comment on post 6
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Could you elaborate more on this aspect?',
        isModified: false,
        like: 0,
        userId: 1,
        postId: 7,
        parentId: 18, // Reply to the eighteenth comment on post 7
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Shared this with my study group!',
        isModified: false,
        like: 0,
        userId: 3,
        postId: 8,
        parentId: 20, // Reply to the twentieth comment on post 8
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('comments', null, {});
  }
};
