const { validationResult } = require('express-validator');
const Comment =  require("../../models/Comment")
const { Sequelize, QueryTypes } = require('sequelize');
const {sequelize} = require("../../db/db")
const buildCommentNodeTree = require("./commentHelper")

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
                      c."parentID",
                      0 AS "level",
                      ARRAY[c."id"] AS "path"
                    FROM comments c
                    WHERE c."postId" = :postId AND c."parentID" IS NULL

                    UNION ALL

                    SELECT
                      c."id",
                      c."text",
                      c."isModified",
                      c."createdAt",
                      c."like",
                      c."parentID",
                      cte."level" + 1 AS "level",
                      cte."path" || ARRAY[c."id"] AS "path"
                    FROM comments c
                    JOIN cte ON c."parentID" = cte."id"
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
          c."parentID",
          0 AS "level",
          ARRAY[c."id"] AS "path"
        FROM comments c
        WHERE  c."parentID" = :parentCommentId

        UNION ALL

        SELECT
          c."id",
          c."text",
          c."isModified",
          c."createdAt",
          c."like",
          c."parentID",
          cte."level" + 1 AS "level",
          cte."path" || ARRAY[c."id"] AS "path"
        FROM comments c
        JOIN cte ON c."parentID" = cte."id"
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const comment = await Comment.create(req.body);
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
