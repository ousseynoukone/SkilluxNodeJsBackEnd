const db = require("../../../db/models/index");
const {Comment} =  db;
const {Notification} = db;
const {User} = db;
const {UserLike} = db;
const { Sequelize, QueryTypes, where } = require('sequelize');
const sequelize = db.sequelize;
const buildCommentNodeTree = require("./commentHelper");
const {saveNotification} = require("../heper");
const NotificationType = require("../../models/dtos/notificationEnum");


exports.getAllTopLevelComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const limit = parseInt(req.params.limit, 10) || 10; // Default limit is 10
    const offset = parseInt(req.params.offset, 10) || 0; // Default offset is 0

    const result = await Comment.findAndCountAll({
      where: {
        postId: postId,
        parentId: null,
      },
      include: [
        {
          model: User,
          as: 'user', // Alias for the user who made the comment
          attributes: ['id', 'fullName', 'username', 'profilePicture'],
        },
        {
          model: Comment,
          as: 'childComments', // Alias for child comments
          attributes: ['id'],
          separate: true, // Separate the count of child comments
        },
      ],
      limit: limit + 1, // Fetch one extra item to determine if there's more
      offset: offset,
      order: [
        [sequelize.literal(`CASE WHEN "user"."id" = ${userId} THEN 1 ELSE 0 END`), 'DESC'], // Order by user priority
        ['createdAt', 'DESC'], // Then by creation date
      ],
    });

    const comments = result.rows.map(comment => {
      const plainComment = comment.toJSON();
      const childCommentsCount = plainComment.childComments ? plainComment.childComments.length : 0;
      
      // Remove the childComments array and add the count
      delete plainComment.childComments;
      plainComment.descendantCount = childCommentsCount;

      return plainComment;
    });
    

    const hasMore = result.count > limit;
    const paginatedComments = hasMore ? comments.slice(0, -1) : comments;

    return res.status(200).json({ comments: paginatedComments, hasMore });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




exports.getAllChildrenComments = async (req, res) => {  
  const parentCommentId = req.params.parentCommentId;  
  const limit = parseInt(req.params.limit, 10) || 10; // Default limit is 10  
  const offset = parseInt(req.params.offset, 10) || 0; // Default offset is 0  

  try {  
    const result = await Comment.findAndCountAll({  
      where: {  
        parentId: parentCommentId,  
      },  
      include: [  
        {  
          model: User,  
          as: 'user', // Alias for the user who made the comment  
          attributes: ['id', 'fullName', 'username','profilePicture'],   
        },  
        {  
          model: User,  
          as: 'target', // Alias for the target user of the comment  
          attributes: ['id', 'fullName', 'username'],   
        },  
      ],  
      limit: limit,  
      offset: offset,  
    });  

    if (result.rows.length === 0) {  
      return res.status(404).json({ message: 'No comments found' });  
    }  

    const hasMore = result.count > offset + limit; // Check if there are more comments  
    const comments = result.rows;  
    var c = comments[0]

    return res.status(200).json({ comments, hasMore });  
  } catch (error) {  
    console.error('Error fetching comments:', error);  
    return res.status(500).json({ message: 'Internal server error' });  
  }  
};


// Get a single comment by ID
exports.getOneComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Add a new comment
exports.addComment = async (req, res) => {


    try {
        // Connected User id
        const connectedUserId = req.user.id;
        // Targed User (if ever)
        const targetUserId = req.body.targedId ?? null;

        // Use a transaction to ensure all database operations are atomic
        const result = await sequelize.transaction(async (t) => { 

        // Find the user by their ID
        const user = await User.findByPk(connectedUserId,{transaction:t});

        const targetUser = await User.findByPk(targetUserId,{transaction:t});

        // If user does not exist, return 404 error
        if (!user) {
          return res.status(404).json({ error: "USER NOT FOUND" });
        }

        req.body.userId  = user.id

        if(targetUser){
          req.body.targedId = targetUserId;
        }

        const comment = await Comment.create(req.body,{transaction:t});

        // Notification
        // Send notification to the post's owner
        const fromUser = connectedUserId
        const post = await comment.getPost({transaction:t})
        const toUser = post.userId

        var notificationResult = await saveNotification(comment.id,toUser,fromUser,NotificationType.COMMENT,t);
        if (!notificationResult.success) {
          throw new Error(notificationResult.error);
        }
    
        //  send notification to the target
        if(targetUser){
          var notificationResult = await saveNotification(comment.id,targetUserId,fromUser,NotificationType.COMMENT,t);
          if (!notificationResult.success) {
            throw new Error(notificationResult.error);
          }    
         }

        return comment

      })


        return res.status(201).json({ success: "Comment added!", result });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    try {
        var comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        comment.isModified = true;

        await comment.update(req.body);
        return res.status(200).json({ success: "Comment updated!", comment });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        await comment.destroy();
        return res.status(200).json({ success: "Comment deleted!" });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};


exports.voteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  // Check if commentId and userId are provided
  if (!commentId || !userId) {
      return res.status(400).json({ error: 'Invalid request parameters' });
  }

  try {
      // Use a transaction to ensure all database operations are atomic
      const result = await sequelize.transaction(async (t) => {
          // Find the post and user based on the provided IDs
          const [comment, user] = await Promise.all([
              Comment.findByPk(commentId, { transaction: t }),
              User.findByPk(userId, { transaction: t })
          ]);

          // If either comment or user is not found, throw an error
          if (!comment || !user) {
              throw new Error('Comment or User not found');
          }

          // Increment the votes number of the comment
         var result = await comment.increment('like', { transaction: t});
         var notificationResult = await saveNotification(comment.id,comment.userId,user.id,NotificationType.LIKE,t);

         if (!notificationResult.success) {
          throw new Error(notificationResult.error);
        } 

        
        const userLike = await UserLike.create({
          ressourceType: 'comment', 
          ressourceId: comment.id,        
          userId: userId            
        },{ transaction: t});


        return result
      
      });

      // Respond with the updated votes number
      return res.status(200).json({ likeNumber: result.like });
  } catch (error) {
      // Log the error and respond with a 500 status code
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};


exports.unVoteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  // Check if commentId and userId are provided
  if (!commentId || !userId) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  try {
    // Use a transaction to ensure all database operations are atomic
    const result = await sequelize.transaction(async (t) => {
      // Find the comment based on the provided ID
      const comment = await Comment.findByPk(commentId, { transaction: t });

      // If the comment is not found, throw an error
      if (!comment) {
        throw new Error('Comment not found');
      }

      // Decrement the votes number of the comment
      const updatedComment = await comment.decrement('like', { transaction: t });




      await UserLike.destroy({
        where: {
            ressourceId: commentId
        },
        transaction: t
    });
    


      // Optionally, handle notification logic if required
      // For example, if you need to handle unliking notifications, you can do so here.

      return updatedComment;
    });

    // Respond with the updated votes number
    return res.status(200).json({ likeNumber: result.like });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};
