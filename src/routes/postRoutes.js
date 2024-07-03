const express = require('express');
const router = express.Router();

const { 
  deletePost, addPost, updatePost, getNoFollowedTagsPost, getFollowedTagsPost, getOnePost, getFollowedUserPost, searchPostByTags 
} = require("../controllers/post/postCrudeController");

const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const {votePost} =  require("../controllers/post/postController");
const { postAddingValidator, postUpdateValidator } = require('../controllers/validators/postValidators');

// POST ENDPOINTS
router.get("/basic/followed-user-posts/:limit/:cursor", authenticateToken, getFollowedUserPost);
router.get("/basic/recommended-posts/:limit/:cursor", authenticateToken, getFollowedTagsPost);
router.get("/basic/random-posts/:limit/:cursor", authenticateToken, getNoFollowedTagsPost);
router.get("/basic/search-posts/:tags/:limit/:cursor", authenticateToken, searchPostByTags);
router.get("/basic/posts/:id", authenticateToken, getOnePost);

router.post("/basic/posts/vote/:id", authenticateToken, votePost);

router.post("/basic/posts", authenticateToken, postAddingValidator, addPost);
router.put("/basic/posts/:id", authenticateToken, postUpdateValidator, updatePost);
router.delete("/basic/posts/:id", authenticateToken, deletePost);

module.exports = router;
