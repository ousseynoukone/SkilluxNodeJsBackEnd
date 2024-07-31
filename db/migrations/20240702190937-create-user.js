'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      profession: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      lang: {
        type: Sequelize.STRING,
        allowNull: true
      },
      birth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true,
        default:""
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
