'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tags', [
      {
        libelle: 'science',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'travel',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'technology',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'health',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'food',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'lifestyle',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'education',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'finance',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'sports',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'art',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'music',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'movies',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'fashion',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'business',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        libelle: 'environment',
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
