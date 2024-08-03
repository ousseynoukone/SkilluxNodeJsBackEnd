const db = require("../../../db/models/index");
const {Comment} =  db;
const {Notification} = db;
const {User} = db;
const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = db.sequelize;
const buildCommentNodeTree = require("./commentHelper");
const {saveNotification} = require("../heper");
const NotificationType = require("../../models/dtos/notificationEnum");

// Get all comments NOT USED FOR NOW
// exports.getAllComments = async (req, res) => {
//     const commentId=req.params.postId
//     if(!postId){
//         return res.status(400).json({ error: "Please provide the post id" });
//     }
//     try {
//         const comments = await Comment.findAll({where:{postId:postId}});
//         nestedComments = buildCommentNodeTree(comments)
//         return res.status(200).json(nestedComments);
//     } catch (error) {
//         return res.status(500).json({ error: error.toString() });
//     }
// };


exports.getAllTopLevelComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const limit = parseInt(req.params.limit, 10) || 10; // Default limit is 10
    const offset = parseInt(req.params.offset, 10) || 0; // Default offset is 0

    const result = await sequelize.query(
                `
                  WITH RECURSIVE cte AS (
                    SELECT
                      c."id",
                      c."text",
                      c."isModified",
                      c."createdAt",
                      c."like",
                      c."parentId",
                      0 AS "level",
                      ARRAY[c."id"] AS "path"
                    FROM comments c
                    WHERE c."postId" = :postId AND c."parentId" IS NULL

                    UNION ALL

                    SELECT
                      c."id",
                      c."text",
                      c."isModified",
                      c."createdAt",
                      c."like",
                      c."parentId",
                      cte."level" + 1 AS "level",
                      cte."path" || ARRAY[c."id"] AS "path"
                    FROM comments c
                    JOIN cte ON c."parentId" = cte."id"
                  )


                  SELECT
                    id,
                    text,
                    "isModified",
                    "createdAt",
                    "like",
                    (
                      SELECT COUNT(*)
                      FROM cte c1
                      WHERE c1."path" @> ARRAY[cte."id"]
                      AND c1."id" <> cte."id"
                    ) AS "descendantCount"
                  FROM cte
                  WHERE "level" = 0 
                  LIMIT :limit OFFSET :offset;

                  `,
          {
        replacements: {
          postId,
          limit,
          offset,
        },
        type: QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'No comments found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllParentsComments = async(req,res)=>{
  const childCommentId = req.params.childCommentId;
  const limit = parseInt(req.params.limit, 10) || 10; // Default limit is 10
  const offset = parseInt(req.params.offset, 10) || 0; // Default offset is 0
  try {
    const result = await sequelize.query(
      `
      WITH RECURSIVE cte AS (
        SELECT
          c."id",
          c."text",
          c."isModified",
          c."createdAt",
          c."like",
          c."parentId",
          0 AS "level",
          ARRAY[c."id"] AS "path"
        FROM comments c
        WHERE  c."id" = :childCommentId

        UNION ALL

        SELECT
          c."id",
          c."text",
          c."isModified",
          c."createdAt",
          c."like",
          c."parentId",
          cte."level" + 1 AS "level",
          cte."path" || ARRAY[c."id"] AS "path"
        FROM comments c
        JOIN cte ON c."id" = cte."parentId"
      )


      SELECT
        id,
        text,
        "isModified",
        "createdAt",
        "like",
        (
          SELECT COUNT(*)
          FROM cte c1
          WHERE c1."path" @> ARRAY[cte."id"]
          AND c1."id" <> cte."id"
        ) AS "ascendantCount"
      FROM cte
      WHERE "level" > 0 
      ORDER BY level DESC
      LIMIT :limit OFFSET :offset;

      `,
      {
      replacements: {
      childCommentId,
      limit,
      offset,
      },
      type: QueryTypes.SELECT,
      }
    );

if (result.length === 0) {
return res.status(404).json({ message: 'No comments found' });
}

return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ error: error.toString() });

  }

}


exports.getAllChildrenComments = async(req,res)=>{
  const parentCommentId = req.params.parentCommentId;
  const limit = parseInt(req.params.limit, 10) || 10; // Default limit is 10
  const offset = parseInt(req.params.offset, 10) || 0; // Default offset is 0
  try {
    const result = await sequelize.query(
      `
      WITH RECURSIVE cte AS (
        SELECT
          c."id",
          c."text",
          c."isModified",
          c."createdAt",
          c."like",
          c."parentId",
          0 AS "level",
          ARRAY[c."id"] AS "path"
        FROM comments c
        WHERE  c."parentId" = :parentCommentId

        UNION ALL

        SELECT
          c."id",
          c."text",
          c."isModified",
          c."createdAt",
          c."like",
          c."parentId",
          cte."level" + 1 AS "level",
          cte."path" || ARRAY[c."id"] AS "path"
        FROM comments c
        JOIN cte ON c."parentId" = cte."id"
      )


      SELECT
        id,
        text,
        "isModified",
        "createdAt",
        "like",
        (
          SELECT COUNT(*)
          FROM cte c1
          WHERE c1."path" @> ARRAY[cte."id"]
          AND c1."id" <> cte."id"
        ) AS "descendantCount"
      FROM cte
      WHERE "level" = 0 
      LIMIT :limit OFFSET :offset;

      `,
      {
      replacements: {
      parentCommentId,
      limit,
      offset,
      },
      type: QueryTypes.SELECT,
      }
    );

if (result.length === 0) {
return res.status(404).json({ message: 'No comments found' });
}

return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ error: error.toString() });

  }
}


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
        // Use a transaction to ensure all database operations are atomic
        const result = await sequelize.transaction(async (t) => { 
        // Find the user by their ID
        const user = await User.findByPk(connectedUserId,{transaction:t});

        // If user does not exist, return 404 error
        if (!user) {
          return res.status(404).json({ error: "USER NOT FOUND" });
        }

        req.body.userId  = user.id
        const comment = await Comment.create(req.body,{transaction:t});

        // Notification
        const fromUser = connectedUserId
        const post = await comment.getPost({transaction:t})
        const toUser = post.userId

        var notificationResult = await saveNotification(comment.id,toUser,fromUser,NotificationType.COMMENT,t);
        if (!notificationResult.success) {
          throw new Error(notificationResult.error);
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
