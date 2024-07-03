'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('posts', [
      {
        title: 'The Wonders of Quantum Physics',
        readNumber: 150,
        votesNumber: 30,
        isPublished: true,
        headerImage: 'quantum-physics-image-url',
        tags: ['science', 'physics', 'quantum'],
        userId: 1, // Make sure this corresponds to an existing user
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Exploring the Amazon Rainforest',
        readNumber: 250,
        votesNumber: 50,
        isPublished: true,
        headerImage: 'amazon-rainforest-image-url',
        tags: ['travel', 'nature', 'adventure'],
        userId: 2, // Make sure this corresponds to an existing user
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Understanding Buddhist Philosophy',
        readNumber: 120,
        votesNumber: 20,
        isPublished: true,
        headerImage: 'buddhist-philosophy-image-url',
        tags: ['religion', 'philosophy', 'buddhism'],
        userId: 1, // Make sure this corresponds to an existing user
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Future of Space Travel',
        readNumber: 300,
        votesNumber: 80,
        isPublished: true,
        headerImage: 'space-travel-image-url',
        tags: ['science', 'space', 'technology'],
        userId: 2, // Make sure this corresponds to an existing user
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'A Guide to Meditation Practices',
        readNumber: 180,
        votesNumber: 40,
        isPublished: false,
        headerImage: 'meditation-practices-image-url',
        tags: ['religion', 'health', 'wellbeing'],
        userId: 1, // Make sure this corresponds to an existing user
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Top 10 Travel Destinations for 2024',
        readNumber: 400,
        votesNumber: 90,
        isPublished: true,
        headerImage: 'travel-destinations-2024-image-url',
        tags: ['travel', 'guide', '2024'],
        userId: 2, // Make sure this corresponds to an existing user
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Introduction to Molecular Biology',
        readNumber: 220,
        votesNumber: 60,
        isPublished: true,
        headerImage: 'molecular-biology-image-url',
        tags: ['science', 'biology', 'molecular'],
        userId: 1, // Make sure this corresponds to an existing user
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Spiritual Journey in Hinduism',
        readNumber: 130,
        votesNumber: 25,
        isPublished: false,
        headerImage: 'hinduism-journey-image-url',
        tags: ['religion', 'spirituality', 'hinduism'],
        userId: 2, // Make sure this corresponds to an existing user
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
