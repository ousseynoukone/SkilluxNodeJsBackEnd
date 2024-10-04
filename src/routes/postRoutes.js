const express = require('express');
const router = express.Router();
const MulterHelper = require("../controllers/multerMediaSaver/multer");
const {
  deletePost, addPost, updatePost, getNotRecommandedTagsPost, 
  getRecommandedTagsPost, getOnePost, getFollowedUserPost, searchPostByTags
} = require("../controllers/post/postCrudeController");
const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const { votePost,unvotePost } = require("../controllers/post/postController");
const { postAddingValidator, postUpdateValidator } = require('../controllers/validators/postValidators');

// GET endpoints
router.get("/basic/followed-user-posts/:limit/:cursor", authenticateToken, getFollowedUserPost);
router.get("/basic/recommended-posts/:limit/:cursor", authenticateToken, getRecommandedTagsPost);
router.get("/basic/random-posts/:limit/:cursor", authenticateToken, getNotRecommandedTagsPost);
router.get("/basic/search-posts/:tag/:limit/:cursor", authenticateToken, searchPostByTags);
router.get("/basic/posts/:id", authenticateToken, getOnePost);

// POST endpoints
router.post("/basic/posts/vote/:id", authenticateToken, votePost);
router.post("/basic/posts/unvote/:id", authenticateToken, unvotePost);

router.post("/basic/posts", 
  authenticateToken,
  MulterHelper.upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'medias' }
  ]), 
  postAddingValidator,
  addPost
);

// PUT endpoint
router.put("/basic/posts/:id", authenticateToken, postUpdateValidator, updatePost);

// DELETE endpoint
router.delete("/basic/posts/:id", authenticateToken, deletePost);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Error details:', err);  // Log the full error object for debugging

  if (err) {
    // A Multer error occurred when uploading
    res.status(400).json({
      error: err.field,
    });
  } 
});


module.exports = router;