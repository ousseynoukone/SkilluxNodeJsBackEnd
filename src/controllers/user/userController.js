const User = require("../../models/User");
const { Op } = require('sequelize');


// UPDATE USER TAGS PREFERENCES
exports.updateUserTagsPreferences = async (req, res) => {
    const userId = req.body.userId;
    const userPreferredTags = req.body.tags;

    if (!userId) {
      return res.status(404).json({ error: 'NO  USER ID FOUND!' });
    }

    try {
      var user = await User.findByPk(userId);
  
      user.preferredTags = userPreferredTags;
      await user.save();
  
      res.status(200).json({ success: 'User tag preferences updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.toString() });

    }
  };


  // GET USER INFORMATION
  exports.getUserInformations = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
      return res.status(404).json({ error: 'NO FOLLOWING USER ID FOUND!' });
    }
  
    try {
      // Find user by primary key
      const user = await User.findByPk(userId);
  
      // If user exists
      if (user) {
        // Create a new object without the password key
        const userWithoutPassword = Object.fromEntries(
          Object.entries(user.toJSON()).filter(([key]) => key !== 'password')
        );
  
        // Send the modified user object as response
        return res.status(200).json(userWithoutPassword);
      } else {
        // If user does not exist, send appropriate response
        return res.status(404).json({ error: 'User not found' });
      }
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
  

// Follow user
exports.followUser = async (req, res) => {
  const userId = req.params.id;
  const connectedUserId = req.user.id;
  console.error(connectedUserId)

  if (!userId) {
    return res.status(404).json({ error: 'NO FOLLOWING USER ID FOUND!' });
  }

  try {
    // Find the connected user by primary key
    const connectedUser = await User.findByPk(connectedUserId);

    // If connected user exists
    if (connectedUser) {

      if(connectedUserId==userId){
        return res.status(500).json({ error: "CAN'NT FOLLOW YOURSELF !"});
      }

      // Find the user to follow by primary key
      const userToFollow = await User.findByPk(userId);

      // If user to follow exists
      if (userToFollow) {
        // Add following relationship
        await connectedUser.addFollowing(userToFollow);

        // Send success response
        return res.status(201).json({ success: 'User Followed' });
      } else {
        // If user to follow does not exist, send appropriate response
        return res.status(404).json({ error: 'User to follow not found' });
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
      const followers = await user.getFollowers();

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
      const following = await user.getFollowing();

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