const User = require("../../models/User");
const { Op } = require('sequelize');

exports.updateUserTagsPreferences = async (req, res) => {
    const userId = req.body.userId;
    const userPreferredTags = req.body.tags;
  
    try {
      var user = await User.findByPk(userId);
  
      user.preferredTags = userPreferredTags;
      await user.save();
  
      res.status(200).json({ success: 'User tag preferences updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating user tag preferences' });
    }
  };