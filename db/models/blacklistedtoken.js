'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlacklistedToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Association with User model
      BlacklistedToken.belongsTo(models.User, {
        foreignKey: 'userId', // Specify the foreign key name in camelCase
        onDelete: 'CASCADE', // Delete tokens associated with a user when the user is deleted
        onUpdate: 'CASCADE'
      });
    }
  }
  BlacklistedToken.init({
    token: DataTypes.TEXT,
    tokenExpirationSecondsLeft: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BlacklistedToken',
    tableName: 'blacklisted_tokens' // Specify the correct table name

  });
  return BlacklistedToken;
};
