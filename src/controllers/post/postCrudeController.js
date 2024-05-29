const Post = require("../../models/Post");
const { validationResult } = require('express-validator');
const Section = require("../../models/Section");
const Comment = require("../../models/Comment");
const {sequelize} = require("../../db/db");
const { checkForTags } = require("./postController");
const { Op } = require('sequelize');
const { user } = require("pg/lib/defaults");

exports.getAllPosts = async (req, res) => {
    const limit = parseInt(req.params.limit, 10) || 10; // Default limit is 10
    const offset = parseInt(req.params.offset, 10) || 0; // Default offset is 0
    const userPreferences = req.user.preferredTags || [];
    const diversityLimit = Math.floor(limit / 4); // Limit for diverse posts
    const preferredLimit = limit - diversityLimit; // Limit for preferred posts

    try {
        // Find posts that match user's preferred tags
        const preferredPosts = await Post.findAll({
            include: [
                { model: Section },
                { model: Comment, attributes: ['id'] } // Include comments and get only the 'id' attribute
            ],
            limit: preferredLimit,
            offset,
            where: {
                tags: {
                    [Op.overlap]: userPreferences // Use Op.overlap to find overlapping tags
                }
            }
        });

        // Extract the IDs of the preferred posts to exclude them from the diverse posts query
        const preferredPostIds = preferredPosts.map(post => post.id);

        // Find random posts that do not match user's preferred tags
        const allDiversePosts = await Post.findAll({
            include: [
                { model: Section },
                { model: Comment, attributes: ['id'] } // Include comments and get only the 'id' attribute
            ],
            limit: diversityLimit,
            where: {
                id: {
                    [Op.notIn]: preferredPostIds // Exclude preferred posts by ID
                }
            },
            order: sequelize.random() // Get random posts
        });

        // Filter out any posts from the diverse set that overlap with user preferences
        const diversePosts = allDiversePosts.filter(post => {
            return !userPreferences.some(tag => post.tags.includes(tag));
        });

        const allPosts = [...preferredPosts, ...diversePosts];

        if (allPosts.length === 0) {
            return res.status(200).json({ message: "End of feed" });
        }

        const postWithNumberOfComment = allPosts.map(post => {
            const commentCount = post.comments.length; // Get the length of the comments array
            const { comments, ...postData } = post.toJSON(); // Extract the comments array and the rest of the post data
            return { ...postData, commentCount }; // Merge the post data with the comment count
        });

        return res.status(200).json(postWithNumberOfComment);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ error: error.toString() });
    }
};






    //   // Find all posts with associated sections, and comments number
    //   var posts = await Post.findAll({
    //     include: [
    //       { model: Section },
    //       { model: Comment, attributes: ['id'] } // Include comments and get only the 'id' attribute
    //     ],
    //     limit,
    //     offset,
    //   });

    //   var postWithNumberOfComment = posts.map(post => {
    //     const commentCount = post.comments.length; // Get the length of the comments array
    //     const { comments, ...postData } = post.toJSON(); // Extract the comments array and the rest of the post data
    //     return { ...postData, commentCount }; // Merge the post data with the comment count
    //   });


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
