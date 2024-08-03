'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;

    await queryInterface.bulkInsert('users', [
      {
        fullName: 'John Doe',
        username: 'ousseynou781227',
        profession: 'Software Developer',
        isAdmin: false,
        isActive: true,
        email: 'ousseynou781227@gmaul',
        lang: 'en',
        birth: new Date('1990-01-01'),
        password: await bcrypt.hash('passer123', saltRounds), // hashed password
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Jane Smith',
        username: 'djibi',
        profession: 'Designer',
        isAdmin: true,
        isActive: true,
        email: 'jane.smith@example.com',
        lang: 'en',
        birth: new Date('1985-05-15'),
        password: await bcrypt.hash('passer123', saltRounds), // hashed password
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Neil Tyson',
        username: 'taki',
        profession: 'Devlopper',
        isAdmin: true,
        isActive: true,
        email: 'neil.tyson@example.com',
        lang: 'en',
        birth: new Date('1985-05-15'),
        password: await bcrypt.hash('passer123', saltRounds), // hashed password
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
