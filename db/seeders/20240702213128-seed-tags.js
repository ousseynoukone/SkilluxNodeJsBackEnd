'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tags', [
      {
        libelle: 'Science',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Travel',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Technology',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Health',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Food',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Lifestyle',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Education',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Finance',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Sports',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Art',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Music',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Movies',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Fashion',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Business',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'Environment',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tags', null, {});
  }
};
