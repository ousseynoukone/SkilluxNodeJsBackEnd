const { Op } = require('sequelize');
const { Post, User, Tag, sequelize } = require("../../../db/models");
const { getStringThatAreInAAndNotInB, getStringThatAreInAAndInB } = require('./postHelper');
const {saveNotification} = require('../heper');
const NotificationType = require('../../models/dtos/notificationEnum');

// This function handles voting on a post
exports.votePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if postId and userId are provided
    if (!postId || !userId) {
        return res.status(400).json({ error: 'Invalid request parameters' });
    }

    try {
        // Use a transaction to ensure all database operations are atomic
        const result = await sequelize.transaction(async (t) => {
            // Find the post and user based on the provided IDs
            const [post, user] = await Promise.all([
                Post.findByPk(postId, { transaction: t }),
                User.findByPk(userId, { transaction: t })
            ]);

            // If either post or user is not found, throw an error
            if (!post || !user) {
                throw new Error('Post or User not found');
            }

            // Increment the votes number of the post
            await post.increment('votesNumber', { transaction: t });

            //Send notification to the target
            var notificationResult = await saveNotification(post.id,post.userId,user.id,NotificationType.VOTE,t);
            if (!notificationResult.success) {
              throw new Error(notificationResult.error);
            }

            // Get tags associated with the post and user
            const postTags = post.tags;
            const userTags = await user.getTags({
                attributes: [[sequelize.fn('LOWER', sequelize.col('libelle')), 'libelle']],
                transaction: t
            });
            const userTagLibelles = userTags.map(tag => tag.libelle);

            // Get all tags from the database
            const allTagLibelles = await Tag.findAll({
                attributes: ['libelle'],
                transaction: t
            }).then(tags => tags.map(tag => tag.libelle));

            // Determine new tags and existing tags
            const newTags = getStringThatAreInAAndNotInB(postTags, [...userTagLibelles, ...allTagLibelles]);
            const existingTags = getStringThatAreInAAndInB(postTags, allTagLibelles);
            
            // Create new tags that don't exist in the database
            const createdTags = await Tag.bulkCreate(
                newTags.map(tag => ({ libelle: tag, score: 0 })),
                { returning: true, transaction: t }
            );

            // Associate new tags with the user
            await user.addTags(createdTags, { transaction: t });

            // Increment the score of existing tags
            await Tag.increment('score', {
                where: { libelle: { [Op.in]: existingTags } },
                transaction: t
            });

            // Return the updated votes number of the post
            return post.votesNumber;
        });

        // Respond with the updated votes number
        return res.status(200).json({ votesNumber: result });
    } catch (error) {
        // Log the error and respond with a 500 status code
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};
