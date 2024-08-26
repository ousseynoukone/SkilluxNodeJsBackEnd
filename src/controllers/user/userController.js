const db = require("../../../db/models/index");


const {Notification,sequelize} = db;
const {User} = db;
const {Comment} = db;
const {Tag} = db;
const {Post} = db;
const { Op } = require('sequelize');
const { saveNotification } = require("../heper");
const NotificationType = require("../../models/dtos/notificationEnum");
const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const {getMediaLink} =  require("../post/postHelper");
const deleteLocalImageFromUrl = require("../multerMediaSaver/helper");


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
  
    res.status(201).json({ success: 'User tag preferences updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.toString() });

    }
  };


  exports.getUserInformations = async (req, res) => {
    const userId = req.params.userId == '0' ? req.user.id : req.params.userId;
  
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
          },

        ],
        attributes: { exclude: ['password'] , include: [
          [
            sequelize.literal(`(SELECT COUNT(*) FROM posts WHERE "userId" = ${userId})`),
            'nbPosts'
          ], 
          [
            sequelize.literal(`(SELECT COUNT(*) FROM user_followings WHERE user_followings."followingId" = ${userId})`),
            'nbFollowers'
          ],        
          [
            sequelize.literal(`(SELECT COUNT(*) FROM user_followings WHERE user_followings."followerId" = ${userId})`),
            'nbFollowings'
          ], 
        ]
        } 
      });

      // If user exists
      if (user) {
        let jsonUser = user.toJSON();
        // Modify the user object to remove user_tag from each tag
        const userWithoutTagsUserTag = {
          ...jsonUser,
          nbPosts: parseInt(jsonUser.nbPosts, 10),
          nbFollowers: parseInt(jsonUser.nbFollowers, 10),
          nbFollowings: parseInt(jsonUser.nbFollowings, 10),
          Tags: jsonUser.Tags.map(tag => ({
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


  
exports.getUserPosts = async (req, res) => {
    // Parse and validate limit
    const limit = parseInt(req.params.limit, 10) || 10;

    // Parse and validate cursor
    const rawCursor = req.params.cursor;
    const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;

    // Extract user ID from the authenticated request
    const userId = req.params.userId == '0' ? req.user.id : req.params.userId;

    // Find the user by their ID
    const user = await User.findByPk(userId);

    // If user does not exist, return 404 error
    if (!user) {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }



    // Construct the query for finding posts
    const getPostQuery = {
      include: [
        { model: Comment, attributes: ['id'] },
      ],
      limit: limit+1,
      where: {
          ...(cursor ? { createdAt: { [Op.lt]: cursor } } : {})
             
      },
      order: [['createdAt', 'DESC']],
    };



    const userPost = await user.getPosts(getPostQuery)


    const hasMore = userPost.length > limit;
    const posts = hasMore ? userPost.slice(0, -1) : userPost;

    // Transform results to include the number of comments
    const postsWithNumberOfComments = posts.map(post => {
      const commentCount = post.Comments.length;
      const { Comments, ...postData } = post.toJSON();
      return { ...postData, commentCount };
    });

    // Determine the next cursor
    const nextCursor =
      posts.length > 0
        ? posts[posts.length - 1].createdAt
        : null;

    // Send the response
    return res.status(200).json({
      posts: postsWithNumberOfComments,
      nextCursor:nextCursor,
      hasMore:hasMore
    });

  
}



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

    const rawFollowers = await userToFollow.getFollowers({attributes:['id'], transaction: t });
    const followers = rawFollowers.map(follower=>follower.id)
    if(followers.includes(connectedUser.id)){
      await t.rollback();
      return res.status(500).json({ error: "USER ALREADY FOLLOWED" });
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
  console.log("here")

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



// Retrieve Followers List with Pagination
exports.getUserFollowers = async (req, res) => {
  const userId = req.params.userId == '0' ? req.user.id : req.params.userId;
  // Parse and validate limit
  const limit = parseInt(req.params.limit, 10) || 10;

  // Parse and validate cursor
  const rawCursor = req.params.cursor;
  const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;

  try {
    // Find the user by primary key
    const user = await User.findByPk(userId);

    // If user exists
    if (user) {
      // Construct the query for retrieving followers
      const getFollowersQuery = {
        attributes: ['id', 'fullName', 'username', 'email', 'profilePicture'],
        limit: limit + 1, // Fetch one extra to determine if there are more followers
        where: cursor ? { createdAt: { [Op.lt]: cursor } } : {},
        order: [['createdAt', 'DESC']],
      };

      const followers = await user.getFollowers(getFollowersQuery);

      const hasMore = followers.length > limit;
      const paginatedFollowers = hasMore ? followers.slice(0, -1) : followers;

      // Determine the next cursor
      const nextCursor = paginatedFollowers.length > 0 ? paginatedFollowers[paginatedFollowers.length - 1].createdAt : null;

      // Send the response
      return res.status(200).json({
        followers: paginatedFollowers,
        nextCursor: nextCursor,
        hasMore: hasMore
      });
    } else {
      // If user does not exist, send appropriate response
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};


// Retrieve Following List with Pagination
exports.getUserFollowing = async (req, res) => {
  const userId = req.params.userId == '0' ? req.user.id : req.params.userId;

  // Parse and validate limit
  const limit = parseInt(req.params.limit, 10) || 10;

  // Parse and validate cursor
  const rawCursor = req.params.cursor;
  const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;

  try {
    // Find the user by primary key
    const user = await User.findByPk(userId);

    // If user exists
    if (user) {
      // Construct the query for retrieving following users
      const getFollowingQuery = {
        attributes: ['id', 'fullName', 'username', 'email', 'profilePicture'],
        limit: limit + 1, // Fetch one extra to determine if there are more following users
        where: cursor ? { createdAt: { [Op.lt]: cursor } } : {},
        order: [['createdAt', 'DESC']],
      };

      const following = await user.getFollowing(getFollowingQuery);

      const hasMore = following.length > limit;
      const paginatedFollowing = hasMore ? following.slice(0, -1) : following;

      // Determine the next cursor
      const nextCursor = paginatedFollowing.length > 0 ? paginatedFollowing[paginatedFollowing.length - 1].createdAt : null;

      // Send the response
      return res.status(200).json({
        following: paginatedFollowing,
        nextCursor: nextCursor,
        hasMore: hasMore
      });
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
  const userId = req.params.userId == '0' ? req.user.id : req.params.userId;

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
  const userId = req.params.userId == '0' ? req.user.id : req.params.userId;

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

// Check if the connected user is following the target user
exports.isFollower = async (req, res) => {
  const targetUserId = req.params.id; // ID of the user to check
  const connectedUserId = req.user.id; // ID of the connected user

  if (!targetUserId) {
    return res.status(400).json({ error: 'NO TARGET USER ID PROVIDED!' });
  }

  if (connectedUserId == targetUserId) {
    return res.status(400).json({ error: "YOU CAN'T FOLLOW YOURSELF!" });
  }

  try {
    // Find the connected user
    const connectedUser = await User.findByPk(connectedUserId);
    if (!connectedUser) {
      return res.status(404).json({ error: 'Connected user not found' });
    }

    // Find the target user
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    // Check if the connected user is following the target user
    const followers = await targetUser.getFollowers({ attributes: ['id'] });
    const isFollowing = followers.some(follower => follower.id === connectedUserId);

    return res.status(200).json({ isFollowing });
  } catch (error) {
    console.error('Error in isFollower:', error);
    return res.status(500).json({ error: 'AN ERROR OCCURRED WHILE CHECKING FOLLOW STATUS' });
  }
};


exports.updateUser = async (req, res) => {
  const userId = req.user.id;
  const { fullName, email,profession} = req.body;

  if (!userId) {
    return res.status(404).json({ error: 'No user ID found!' });
  }

  try {
    // Find the user by primary key
    const user = await User.findByPk(userId);

    // If user exists
    if (user) {
      // Update the user's details
      await user.update({
        fullName: fullName || user.fullName,
        email: email || user.email,
        profession: profession || user.profession,
      });

      // Send success response
      return res.status(200).json({ success: 'User details updated successfully' });
    } else {
      // If user does not exist
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};


exports.updateProfilePicture = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(404).json({ error: 'No user ID found!' });
  }

  try {
    // Find the user by primary key
    const user = await User.findByPk(userId);


    // If user exists
    if (user) {

      const profilePicture = req.files['profilePicture'][0] ;
      
      await deleteLocalImageFromUrl(user.profilePicture);

      if(profilePicture!=undefined){
        user.profilePicture  = getMediaLink(profilePicture);
      }

      // Update the user's details
      await user.save();

      // Send success response
      return res.status(200).json({ success: 'User profile picture details updated successfully' });
    } else {
      // If user does not exist
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};

exports.removeUserProfilePicture = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(404).json({ error: 'No user ID found!' });
  }

  try {
    // Find the user by primary key
    const user = await User.findByPk(userId);

    // If user exists
    if (user) {
      result = await deleteLocalImageFromUrl(user.profilePicture);
      if(result){
      // Clear the profilePicture field
      user.profilePicture = null;

      // Save the updated user record
      await user.save();
            
      // Send success response
      return res.status(200).json({ success: 'User profile picture removed successfully' });
      }else{
        return res.status(404).json({ error: 'Image not found' });
      }

    } else {
      // If user does not exist
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};