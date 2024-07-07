const db = require("../../../db/models/index");


const {Notification,sequelize} = db;
const {User} = db;
const {Tag} = db;
const { Op } = require('sequelize');
const { saveNotification } = require("../heper");
const NotificationType = require("../../models/dtos/notificationEnum");


// UPDATE USER TAGS PREFERENCES
exports.updateUserTagsPreferences = async (req, res) => {
  const userId = req.user.id;
  const tagIds = req.body.tags;

    if (!userId) {
      return res.status(404).json({ error: 'NO  USER ID FOUND!' });
    }

    try {
      var user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found!' });
      }

    // Find tags by tagIds
    const tags = await Tag.findAll({
      where: {
        id: tagIds
      }
    });
  
    if (!tags || tags.length === 0) {
      return res.status(404).json({ error: 'Tags not found!' });
    }

    // Associate tags with the user
    await user.setTags(tagIds);
  
    res.status(200).json({ success: 'User tag preferences updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.toString() });

    }
  };


  exports.getUserInformations = async (req, res) => {
    const userId = req.user.id;
  
    if (!userId) {
      return res.status(404).json({ error: 'No user found!' });
    }
  
    try {
      // Find user by primary key, including associated tags
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Tag,
            attributes: ['id', 'libelle', 'score'] // Specify the attributes you want to include from the Tag model
          }
        ],
        attributes: { exclude: ['password'] } // Exclude the password field from the user attributes
      });
  
      // If user exists
      if (user) {
        // Modify the user object to remove user_tag from each tag
        const userWithoutTagsUserTag = {
          ...user.toJSON(),
          Tags: user.Tags.map(tag => ({
            id: tag.id,
            libelle: tag.libelle,
            score: tag.score
          }))
        };
  
        return res.status(200).json(userWithoutTagsUserTag);
      } else {
        // If user does not exist, send appropriate response
        return res.status(404).json({ error: 'User not found' });
      }
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.toString() });
    }
  };
  

// Follow user
exports.followUser = async (req, res) => {
  const userIdToFollow = req.params.id;
  const connectedUserId = req.user.id;

  if (!userIdToFollow) {
    return res.status(400).json({ error: 'NO FOLLOWING USER ID PROVIDED!' });
  }

  if (connectedUserId == userIdToFollow) {
    return res.status(400).json({ error: "YOU CAN'T FOLLOW YOURSELF!" });
  }
  

  const t = await sequelize.transaction();

  try {
    // Find the connected user and the user to follow
    const [connectedUser, userToFollow] = await Promise.all([
      User.findByPk(connectedUserId, { transaction: t }),
      User.findByPk(userIdToFollow, { transaction: t })
    ]);

    if (!connectedUser) {
      await t.rollback();
      return res.status(404).json({ error: "CONNECTED USER NOT FOUND" });
    }

    if (!userToFollow) {
      await t.rollback();
      return res.status(404).json({ error: "USER TO FOLLOW NOT FOUND" });
    }

    // Add following relationship
    await connectedUser.addFollowing(userToFollow, { transaction: t });

    // Create notification
    const notificationResult = await saveNotification(connectedUserId, userIdToFollow, connectedUserId,NotificationType.FOLLOW, t);
    
    if (!notificationResult.success) {
      throw new Error(notificationResult.error);
    }

    await t.commit();
    return res.status(201).json({ message: "USER FOLLOWED SUCCESSFULLY" });

  } catch (error) {
    await t.rollback();
    console.error('Error in followUser:', error);
    return res.status(500).json({ error: "AN ERROR OCCURRED WHILE FOLLOWING USER" });
  }
}


// Unfollow user
exports.unfollowUser = async (req, res) => {
  const userId = req.params.id;
  const connectedUserId = req.user.id;

  if (!userId) {
    return res.status(404).json({ error: 'NO USER ID FOUND!' });
  }

  try {
    // Find the connected user by primary key
    const connectedUser = await User.findByPk(connectedUserId);

    // If connected user exists
    if (connectedUser) {
      if(connectedUserId==userId){
        return res.status(500).json({ error: "CAN'NT FOLLOW YOURSELF !"});
      }

      // Find the user to unfollow by primary key
      const userToUnfollow = await User.findByPk(userId);

      // If user to unfollow exists
      if (userToUnfollow) {
        // Remove following relationship
        await connectedUser.removeFollowing(userToUnfollow);

        // Send success response
        return res.status(200).json({ success: 'User Unfollowed' });
      } else {
        // If user to unfollow does not exist, send appropriate response
        return res.status(404).json({ error: 'User to unfollow not found' });
      }
    } else {
      // If connected user does not exist, send appropriate response
      return res.status(404).json({ error: 'Connected user not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
}



// Retrieve Followers List
exports.getUserFollowers = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find the user by primary key
    const user = await User.findByPk(userId);

    // If user exists
    if (user) {
      // Retrieve the list of followers using Sequelize association method
      const followers = await user.getFollowers({
        attributes: ['id', 'fullName', 'username', 'email', 'profilePicture']
      });

      // Send the list of followers as response
      return res.status(200).json(followers);
    } else {
      // If user does not exist, send appropriate response
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};

// Retrieve Following List
exports.getUserFollowing = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find the user by primary key
    const user = await User.findByPk(userId);

    // If user exists
    if (user) {
      // Retrieve the list of following users using Sequelize association method
      const following = await user.getFollowing({
        attributes: ['id', 'fullName', 'username', 'email', 'profilePicture']
      });

      // Send the list of following users as response
      return res.status(200).json(following);
    } else {
      // If user does not exist, send appropriate response
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};


// Get number of followers for a user
exports.getUserNbFollowers = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find the user by primary key
    const user = await User.findByPk(userId);

    // If user exists
    if (user) {
      // Get the count of followers for the user
      const count = await user.countFollowers();

      // Send the count as response
      return res.status(200).json({ count });
    } else {
      // If user does not exist, send appropriate response
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};

// Get number of users the user is following
exports.getUserNbFollowing = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find the user by primary key
    const user = await User.findByPk(userId);

    // If user exists
    if (user) {
      // Get the count of users the user is following
      const count = await user.countFollowing();

      // Send the count as response
      return res.status(200).json({ count });
    } else {
      // If user does not exist, send appropriate response
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};

// SEARCH USER BY USERNAME OR FULL NAME
exports.searchUser = async (req, res) => {
  const username = req.params.username;

    // Parse and validate limit
  const limit = parseInt(req.params.limit, 10) || 10;

    // Parse and validate cursor
  const rawCursor = req.params.cursor;
  const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;


  if (!username) {
    return res.status(404).json({ error: 'NO USERNAME  FOUND!' });
  }
  try {
    // Find the user by primary key
    const users = await User.findAll({
            
      where: {
        [Op.and]: [
          {[Op.or]:[{username:{[Op.substring]: username}},{fullName:{[Op.substring]: username}}]},
          cursor ? { createdAt: { [Op.lt]: cursor } } : {},
        ],
      },
    limit: limit,
    order: [['createdAt', 'DESC']],

  },
  );


    // If user exists
    if (users) {
      // Determine the next cursor
      const nextCursor =
      users.length > 0
        ? users[users.length - 1].createdAt
        : null;

      return res.status(200).json({ users,nextCursor });
    } else {
      // If users do not exist, send appropriate response
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};