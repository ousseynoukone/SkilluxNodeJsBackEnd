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
      ,
      {
        fullName: 'Jeferson',
        username: 'jef',
        profession: 'Devlopper',
        isAdmin: true,
        isActive: true,
        email: 'jef.@example.com',
        lang: 'fr',
        birth: new Date('1985-05-15'),
        password: await bcrypt.hash('passer123', saltRounds), // hashed password
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Alice Johnson',
        username: 'alice_j',
        profession: 'Data Analyst',
        isAdmin: false,
        isActive: true,
        email: 'alice.johnson@example.com',
        lang: 'en',
        birth: new Date('1992-03-21'),
        password: await bcrypt.hash('passer123', saltRounds),
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Carlos Mendes',
        username: 'carlos_m',
        profession: 'Network Engineer',
        isAdmin: false,
        isActive: true,
        email: 'carlos.mendes@example.com',
        lang: 'pt',
        birth: new Date('1989-11-02'),
        password: await bcrypt.hash('passer123', saltRounds),
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Maria Rossi',
        username: 'maria.rossi',
        profession: 'Project Manager',
        isAdmin: true,
        isActive: true,
        email: 'maria.rossi@example.com',
        lang: 'it',
        birth: new Date('1987-06-13'),
        password: await bcrypt.hash('passer123', saltRounds),
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Ahmed Khan',
        username: 'ahmed_k',
        profession: 'Security Specialist',
        isAdmin: false,
        isActive: true,
        email: 'ahmed.khan@example.com',
        lang: 'en',
        birth: new Date('1994-09-28'),
        password: await bcrypt.hash('passer123', saltRounds),
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Emily Nguyen',
        username: 'emily_ng',
        profession: 'UI/UX Designer',
        isAdmin: false,
        isActive: true,
        email: 'emily.nguyen@example.com',
        lang: 'en',
        birth: new Date('1996-02-17'),
        password: await bcrypt.hash('passer123', saltRounds),
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Liam Tanaka',
        username: 'liam_t',
        profession: 'Software Engineer',
        isAdmin: false,
        isActive: true,
        email: 'liam.tanaka@example.com',
        lang: 'ja',
        birth: new Date('1990-12-12'),
        password: await bcrypt.hash('passer123', saltRounds),
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Sara Lee',
        username: 'sara_lee',
        profession: 'Marketing Specialist',
        isAdmin: true,
        isActive: true,
        email: 'sara.lee@example.com',
        lang: 'en',
        birth: new Date('1988-07-08'),
        password: await bcrypt.hash('passer123', saltRounds),
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Robert Brown',
        username: 'rob_brown',
        profession: 'Database Administrator',
        isAdmin: false,
        isActive: true,
        email: 'robert.brown@example.com',
        lang: 'en',
        birth: new Date('1982-01-23'),
        password: await bcrypt.hash('passer123', saltRounds),
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Chloe Dupont',
        username: 'chloe_du',
        profession: 'Content Strategist',
        isAdmin: true,
        isActive: true,
        email: 'chloe.dupont@example.com',
        lang: 'fr',
        birth: new Date('1995-08-19'),
        password: await bcrypt.hash('passer123', saltRounds),
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Oscar Martinez',
        username: 'oscar_m',
        profession: 'System Administrator',
        isAdmin: false,
        isActive: true,
        email: 'oscar.martinez@example.com',
        lang: 'es',
        birth: new Date('1991-04-05'),
        password: await bcrypt.hash('passer123', saltRounds),
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
