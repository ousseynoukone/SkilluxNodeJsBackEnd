const express = require('express');
const router = express.Router();
const MulterHelper =  require("../controllers/multerMediaSaver/multer")
const { 
  deletePost, addPost, updatePost, getNotRecommandedTagsPost, getRecommandedTagsPost, getOnePost, getFollowedUserPost, searchPostByTags 
} = require("../controllers/post/postCrudeController");

const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const {votePost} =  require("../controllers/post/postController");
const { postAddingValidator, postUpdateValidator } = require('../controllers/validators/postValidators');

// POST ENDPOINTS
router.get("/basic/followed-user-posts/:limit/:cursor", authenticateToken, getFollowedUserPost);
router.get("/basic/recommended-posts/:limit/:cursor", authenticateToken, getRecommandedTagsPost);
router.get("/basic/random-posts/:limit/:cursor", authenticateToken, getNotRecommandedTagsPost);
router.get("/basic/search-posts/:tag/:limit/:cursor", authenticateToken, searchPostByTags);
router.get("/basic/posts/:id", authenticateToken, getOnePost);

router.post("/basic/posts/vote/:id", authenticateToken, votePost);

router.post("/basic/posts",   MulterHelper.upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'medias' }  
]),authenticateToken, postAddingValidator, addPost);


router.put("/basic/posts/:id", authenticateToken, postUpdateValidator, updatePost);
router.delete("/basic/posts/:id", authenticateToken, deletePost);

module.exports = router;
