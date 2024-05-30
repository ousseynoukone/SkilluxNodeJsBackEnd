const Post = require("../../models/Post");
const { validationResult } = require('express-validator');
const Section = require("../../models/Section");
const Comment = require("../../models/Comment");
const {sequelize} = require("../../db/db");
const { checkForTags } = require("./postController");
const { Op } = require('sequelize');
const { user } = require("pg/lib/defaults");



// FUNCTION TO GET WITH CURSOR PAGINATION  FOLLOWED TAGS'S POST
exports.getFollowedTagsPost = async (req, res) => {
  try {
    // Parse and validate limit
    const limit = parseInt(req.params.limit, 10) || 10;

    // Parse and validate cursor
    const rawCursor = req.params.cursor;
    const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;
    
    // Extract user preferences
    const userPreferences = req.user.preferredTags || [];

    // Construct the query for finding posts
    const preferredPostsQuery = {
      include: [
        { model: Section },
        { model: Comment, attributes: ['id'] },
      ],
      limit: limit,
      where: {

        [Op.and]: [
            { tags: { [Op.overlap]: userPreferences } },
            cursor ? { createdAt: { [Op.lt]: cursor } } : {},
          ],
  
      },
      order: [['createdAt', 'DESC']],
    };


    // Execute the query
    const preferredPosts = await Post.findAll(preferredPostsQuery);

    // Transform results to include the number of comments
    const postWithNumberOfComment = preferredPosts.map(post => {
      const commentCount = post.comments.length;
      const { comments, ...postData } = post.toJSON();
      return { ...postData, commentCount };
    });

    // Determine the next cursor
    const nextCursor =
      preferredPosts.length > 0
        ? preferredPosts[preferredPosts.length - 1].createdAt
        : null;

    // Send the response
    return res.status(200).json({
      posts: postWithNumberOfComment,
      nextCursor,
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: error.toString() });
  }
};



  



exports.getNoFollowedTagsPost = async (req, res) => {
  try {
    // Parse and validate limit
    const limit = parseInt(req.params.limit, 10) || 10;

    // Parse and validate cursor
    const rawCursor = req.params.cursor;
    const cursor = rawCursor !== '0' ? new Date(rawCursor) : null;

    // Extract user preferences
    const userPreferences = req.user.preferredTags || [];

    // Fetch preferred post IDs separately
    const preferredPostIds = await Post.findAll({
      where: {
        tags: { [Op.overlap]: userPreferences },
      },
      attributes: ['id'],
    }).then(preferredPosts => preferredPosts.map(post => post.id));

    // Construct the query for finding posts not matching user's preferred tags
    const noFollowedTagsPostQuery = {
      include: [
        { model: Section },
        { model: Comment, attributes: ['id'] },
      ],
      limit: limit,
      where: {
        [Op.and]: [
          { id: { [Op.notIn]: preferredPostIds } }, // Exclude preferred posts by ID
          cursor ? { createdAt: { [Op.lt]: cursor } } : {},
        ],
      },
      order: [['createdAt', 'DESC']],
    };

    // Execute the query
    const noFollowedTagsPosts = await Post.findAll(noFollowedTagsPostQuery);

    // Transform results to include the number of comments
    const postsWithNumberOfComments = noFollowedTagsPosts.map(post => {
      const commentCount = post.comments.length;
      const { comments, ...postData } = post.toJSON();
      return { ...postData, commentCount };
    });

    // Determine the next cursor
    const nextCursor =
      noFollowedTagsPosts.length > 0
        ? noFollowedTagsPosts[noFollowedTagsPosts.length - 1].createdAt
        : null;

    // Send the response
    return res.status(200).json({
      posts: postsWithNumberOfComments,
      nextCursor,
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: error.toString() });
  }
};










exports.getOnePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id,{include:[Section]});
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const post = await Post.create(req.body);

        return res.status(201).json({ success: "Post added!", post });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
}

exports.updatePost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
        
        await post.destroy();
        return res.status(200).json({ success: "Post deleted!" });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
}
