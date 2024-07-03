const express = require('express');
const router = express.Router();

const { getOneComment, addComment, updateComment, deleteComment, getAllChildrenComments, getAllTopLevelComments } = require("../controllers/comment/commentController");
const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const { commentAddingValidator, commentUpdateValidator } = require('../controllers/validators/commentValidators');

// COMMENT ENDPOINTS
router.get("/basic/post-top-level-comments/:postId/:limit/:offset", authenticateToken, getAllTopLevelComments);
router.get("/basic/children_comments/:parentCommentId/:limit/:offset", authenticateToken, getAllChildrenComments);
router.get("/basic/comments/:id", authenticateToken, getOneComment);
router.post("/basic/comments", authenticateToken, commentAddingValidator, addComment);
router.put("/basic/comments/:id", authenticateToken, commentUpdateValidator, updateComment);
router.delete("/basic/comments/:id", authenticateToken, deleteComment);

module.exports = router;