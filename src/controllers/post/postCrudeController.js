const db = require("../../../db/models/index");
const {Post} = db;
const {User} = db;
const {Comment} = db;
const {saveBulkNotification} = require('../heper');
const { validationResult } = require('express-validator');
const { checkForTags } = require("./postController");
const { Op ,Sequelize} = require('sequelize');
const NotificationType = require("../../models/dtos/notificationEnum");
const sequelize = db.sequelize;
const {insertMediasIntoDocument,getMediaLink, extractMediaUrlsFromDocument} =  require("./postHelper")
const deleteLocalImageFromUrl = require("../multerMediaSaver/helper");


// FUNCTION TO GET FOLLOWED TAGS' POSTS WITH CURSOR PAGINATION
exports.getRecommandedTagsPost = async (req, res) => {
  try {
    // Parse and validate limit
    const limit = parseInt(req.params.limit, 10) || 10;

    // Extract user ID from the authenticated request
    const userId = req.user.id;

    // Find the user by their ID
    const user = await User.findByPk(userId);

    // If user does not exist, return 404 error
    if (!user) {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }

    // Parse and validate cursor
    const rawCursor = req.params.cursor;
    const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;
    
    // Get tags associated with the user, fetching only 'libelle' and 'score'
    const userTags = await user.getTags({
      attributes: [[Sequelize.fn('LOWER', Sequelize.col('libelle')), 'libelle'], 'score'],
      order: [['score', 'DESC']] // Order tags by score in descending order
    });

    // Extract libelle values into an array
    const userPreferedTagsLibelle = userTags.map(tag => tag.libelle);

    // Construct the query for finding posts
    const preferredPostsQuery = {
      include: [
        { model: Comment, attributes: ['id'] },
        { model: User, attributes: ['id','fullName','username','profilePicture','email','profession'] }
      ],
      limit: limit + 1, // Fetch one extra record to determine if there's a next page
      where: {
        [Op.and]: [
          { tags: { [Op.overlap]: userPreferedTagsLibelle } },
          { isPublished: true },
          cursor ? { createdAt: { [Op.lt]: cursor } } : {}
        ]
      },
      order: [
        [Sequelize.literal(`(SELECT MAX("score") FROM unnest("Post"."tags") as tag("libelle") JOIN "tags" ON "tags"."libelle" = tag."libelle")`), 'DESC'], // Order by highest tag score
        ['createdAt', 'DESC'] // Order by creation date in descending order
      ]
    };

    // Execute the query
    const preferredPosts = await Post.findAll(preferredPostsQuery);

    // Determine if there are more records to fetch
    const hasMore = preferredPosts.length > limit;
    const posts = hasMore ? preferredPosts.slice(0, -1) : preferredPosts;

    // Transform results to include the number of comments
    const postWithNumberOfComment = posts.map(post => {
      const commentCount = post.Comments.length;
      const { Comments, ...postData } = post.toJSON();
      return { ...postData, commentCount };
    });

    // Determine the next cursor
    const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt : null;

    // Send the response
    return res.status(200).json({
      posts: postWithNumberOfComment,
      nextCursor,
      hasMore: hasMore
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: error.toString() });
  }
};


// Get random no followed  tag's post
exports.getNotRecommandedTagsPost = async (req, res) => {
  try {

    // Parse and validate limit
    const limit = parseInt(req.params.limit, 10) || 10;

    // Parse and validate cursor
    const rawCursor = req.params.cursor;
    const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;

        // Extract user ID from the authenticated request
    const userId = req.user.id;

    // Find the user by their ID
    const user = await User.findByPk(userId);

    // If user does not exist, return 404 error
    if (!user) {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }
    // Get tags associated with the user, fetching only 'libelle'
    const userTags = await user.getTags({
      attributes: [[Sequelize.fn('LOWER', Sequelize.col('libelle')), 'libelle']]
    });
    

    // Extract libelle values into an array
    const userPreferedTagsLibelle = userTags.map(tag=>tag.libelle)

    
    // Fetch preferred post IDs separately
    const preferredPostIds = await Post.findAll({
      where: {
        tags: { [Op.overlap]: userPreferedTagsLibelle },
        isPublished: true 

      },
      attributes: ['id'],
    }).then(preferredPosts => preferredPosts.map(post => post.id));


    // Construct the query for finding posts not matching user's preferred tags
    const noFollowedTagsPostQuery = {
      include: [
        { model: User, attributes: ['id','fullName','username','profilePicture','email','profession'] },

        { model: Comment, attributes: ['id'] },
      ],
      limit: limit+1,
      where: {
        [Op.and]: [
          { id: { [Op.notIn]: preferredPostIds } }, // Exclude preferred posts by ID
          { isPublished: true },
          cursor ? { createdAt: { [Op.lt]: cursor } } : {},
        ],
      },
      order: [['createdAt', 'DESC']],
    };

    // Execute the query
    const noFollowedTagsPosts = await Post.findAll(noFollowedTagsPostQuery);

    const hasMore = noFollowedTagsPosts.length > limit;
    const posts = hasMore ? noFollowedTagsPosts.slice(0, -1) : noFollowedTagsPosts;

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
      nextCursor,
      hasMore:hasMore
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: error.toString() });
  }
};





// Function to get followed user posts with cursor pagination
exports.getFollowedUserPost = async (req, res) => {
  try {
    // Parse and validate limit
    const limit = parseInt(req.params.limit, 10) || 10;

    // Parse and validate cursor
    const rawCursor = req.params.cursor;
    const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;

    // Extract user ID from the authenticated request
    const userId = req.user.id;

    // Find the user by their ID
    const user = await User.findByPk(userId);

    // If user does not exist, return 404 error
    if (!user) {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }

    // Get the IDs of users followed by the authenticated user
    const followedUsers = await user.getFollowing().then(users => {
      return users.map(user => user.id);
    });

    // Construct the query for finding posts
    const followedUserPostsQuery = {
      include: [
        { model: Comment, attributes: ['id'] },
        { model: User, attributes: ['id','fullName','username','profilePicture','email','profession'] }

      ],
      limit: limit+1,
      where: {
        [Op.and]: [
          { userId: { [Op.in]: followedUsers } },
          { isPublished: true },
          cursor ? { createdAt: { [Op.lt]: cursor } } : {},
        ],
      },
      order: [['createdAt', 'DESC']],
    };

    // Execute the query to retrieve followed user posts
    const followedUserPosts = await Post.findAll(followedUserPostsQuery);

    const hasMore = followedUserPosts.length > limit;
    const posts = hasMore ? followedUserPosts.slice(0, -1) : followedUserPosts;

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
      nextCursor,
      hasMore:hasMore
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: error.toString() });
  }
};

  







exports.searchPostByTags = async (req, res) => {
  try {
    // Parse and validate limit
    const limit = parseInt(req.params.limit, 10) || 10;

    // Parse and validate cursor
    const rawCursor = req.params.cursor;
    const cursor = rawCursor && rawCursor !== '0' ? new Date(rawCursor) : null;

    // Extract tag from request parameters
    const tag = req.params.tag.toLowerCase().trim();

    if (!tag) {
      return res.status(400).json({ error: "No tag provided in parameters" });
    }

    const whereClause = {
      [Op.and]: [
        Sequelize.literal(`ARRAY_TO_STRING(tags, ',') ILIKE '%${tag}%'`),
        { isPublished: true }
      ]
    };

    if (cursor) {
      whereClause.createdAt = { [Op.lt]: cursor };
    }

    const foundPosts = await Post.findAll({
      
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: limit + 1 // Fetch one extra to determine if there are more results
    });

    const hasMore = foundPosts.length > limit;
    const posts = hasMore ? foundPosts.slice(0, -1) : foundPosts;

    // Determine the next cursor
    const nextCursor = hasMore ? posts[posts.length - 1].createdAt.toISOString() : null;

    // Send the response
    return res.status(200).json({
      posts,
      nextCursor,
      hasMore
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: "An error occurred while fetching posts" });
  }
};


exports.getOnePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
}

exports.addPost = async (req, res) => {  
  try {
    
    const result = await sequelize.transaction(async (t) => {
      // Extract user ID from the authenticated request
      const userId = req.user.id;
      // Find the user by their ID
      const user = await User.findByPk(userId, { transaction: t });

          // Access cover image
      const coverImage = req.files['coverImage'] ? req.files['coverImage'][0] : null;

      // Access content files (medias)
      const mediaFiles = req.files['medias'] || [];

      var post=req.body;
      post.userId = userId;
      var paths = []

      mediaFiles.forEach(async file => {

        let path = getMediaLink(file)
        paths.push(path)   
      });

      if(coverImage!=undefined){
        post.headerImage = getMediaLink(coverImage)
      }
      post.content = await insertMediasIntoDocument(post.content,paths);
      var response = Post.create(post)

            // Get the IDs of the user's followers
      const followers = await user.getFollowers({ 
        attributes: ['id'],
        transaction: t 
      });
      const followerIds = followers.map(follower => follower.id);

      // Send notifications to followers
      if (followerIds.length > 0) {
        const notificationResult = await saveBulkNotification(post.id, followerIds, user.id,NotificationType.POST, t);
        if (!notificationResult.success) {
          throw new Error(notificationResult.error);
        }
      }
      return response;
    });

    return res.status(201).json({ success: "Post added!", post: result });
  } catch (error) {
    console.log(error)
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }
    return res.status(500).json({ error: error.toString() });
  }
};



exports.updatePost = async (req, res) => {
    try {
        var post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        await post.update(req.body);
        return res.status(200).json({ success: "Post updated!", post });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
}

exports.deletePost = async (req, res) => {
  try {
      const post = await Post.findByPk(req.params.id);
      if (!post) {
          return res.status(404).json({ error: "Post not found" });
      }

      // Delete the cover image
      const coverImageDeletionResult = await deleteLocalImageFromUrl(post.coverImage);

      if (!coverImageDeletionResult) {
          console.info({ info: "Cover image do not exist, passsing..." });
      }

      // Extract media links from content
      const mediaLinks = extractMediaUrlsFromDocument(post.content);

      if (mediaLinks.length > 0) {
          // Delete all media links
          const deletionResults = await Promise.all(mediaLinks.map(async (link) => {
              try {
                  return await deleteLocalImageFromUrl(link);
              } catch (error) {
                  console.error(`Failed to delete media link ${link}: ${error}`);
                  return false;
              }
          }));

          const allDeletionsSuccessful = deletionResults.every(result => result);

          if (!allDeletionsSuccessful) {
              return res.status(500).json({ error: "Failed to delete some media links" });
          }
      }

      // Delete the post
      await post.destroy();

      return res.status(200).json({ success: "Post deleted!" });

  } catch (error) {
      return res.status(500).json({ error: error.toString() });
  }
};

