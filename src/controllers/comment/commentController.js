const db = require("../../../db/models/index");
const {Comment} =  db;
const {Notification} = db;
const {User} = db;
const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = db.sequelize;
const buildCommentNodeTree = require("./commentHelper");

// Get all comments NOT USED FOR NOW
// exports.getAllComments = async (req, res) => {
//     const postId=req.params.postId
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

        // Find the user by their ID
        const user = await User.findByPk(connectedUserId);

        // If user does not exist, return 404 error
        if (!user) {
          return res.status(404).json({ error: "USER NOT FOUND" });
        }

        req.body.userId  = user.id
        const comment = await Comment.create(req.body);

        // Notification
        const fromUser = connectedUserId
        const post = await comment.getPost()
        const toUser = post.userId
        const notification = Notification.create(
          {
            ressourceId:comment.id,
            toUserId : toUser,
            fromUserId : fromUser,
            type : "comment"
          }
        )


        return res.status(201).json({ success: "Comment added!", comment });
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
