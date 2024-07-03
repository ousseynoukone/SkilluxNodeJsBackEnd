const express = require('express');
const router = express.Router();

const { updateUserTagsPreferences, getUserInformations, followUser, unfollowUser, getUserFollowers, getUserFollowing, getUserNbFollowers, getUserNbFollowing, searchUser } = require('../controllers/user/userController');
const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");

// USER OPERATION ENDPOINTS
router.post("/basic/update_user_preferences", authenticateToken, updateUserTagsPreferences, updateUserTagsPreferences);
router.get("/basic/users", authenticateToken, getUserInformations);
router.get("/basic/users/followers", authenticateToken, getUserFollowers);
router.get("/basic/users/following", authenticateToken, getUserFollowing);
router.get("/basic/users/nb_followers", authenticateToken, getUserNbFollowers);
router.get("/basic/users/nb_following", authenticateToken, getUserNbFollowing);
router.get("/basic/search-users/:username/:limit/:cursor", authenticateToken, searchUser);
router.post("/basic/users/follow/:id", authenticateToken, followUser);
router.post("/basic/users/unfollow/:id", authenticateToken, unfollowUser);

module.exports = router;
