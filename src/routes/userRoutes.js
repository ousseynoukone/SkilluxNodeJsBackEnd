const express = require('express');
const router = express.Router();

const { updateUserTagsPreferences,isFollower, getUserInformations,getUserPosts, followUser, unfollowUser, getUserFollowers, getUserFollowing, getUserNbFollowers, getUserNbFollowing, searchUser } = require('../controllers/user/userController');
const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");

// USER OPERATION ENDPOINTS
router.post("/basic/update_user_preferences", authenticateToken, updateUserTagsPreferences, updateUserTagsPreferences);
router.get("/basic/users/:userId", authenticateToken, getUserInformations);
router.get("/basic/users/post/:limit/:cursor/:userId", authenticateToken, getUserPosts);
router.get("/basic/users/followers/:limit/:cursor/:userId", authenticateToken, getUserFollowers);
router.get("/basic/users/following/:limit/:cursor/:userId", authenticateToken, getUserFollowing);
// router.get("/basic/users/nb_followers/:userId", authenticateToken, getUserNbFollowers);
// router.get("/basic/users/nb_following/:userId", authenticateToken, getUserNbFollowing);
router.get("/basic/search-users/:username/:limit/:cursor", authenticateToken, searchUser);
router.post("/basic/users/follow/:id", authenticateToken, followUser);
router.post("/basic/users/unfollow/:id", authenticateToken, unfollowUser);
router.get("/basic/users/is-follower/:id", authenticateToken, isFollower);

module.exports = router;
