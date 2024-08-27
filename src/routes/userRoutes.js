const express = require('express');
const router = express.Router();

const { updateUserTagsPreferences,isFollower,updateUser,updateProfilePicture,removeUserProfilePicture,getUserInformations,getUserPosts, followUser, unfollowUser, getUserFollowers, getUserFollowing, getUserNbFollowers, getUserNbFollowing, searchUser } = require('../controllers/user/userController');
const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const MulterHelper =  require("../controllers/multerMediaSaver/multer");
const { updateUserValidator, updateUserTagsPreferencesValidator } = require('../controllers/validators/userValidators.js');

// USER OPERATION ENDPOINTS

router.post("/basic/update-user", authenticateToken, updateUserValidator, updateUser);
router.post("/basic/remove-user-profile-picture", authenticateToken, removeUserProfilePicture);
router.post("/basic/update-user-profile-picture", authenticateToken,
    
    MulterHelper.upload.fields([
    { name: 'profilePicture', maxCount: 1 },
  ]),
  
  updateProfilePicture);

router.post("/basic/update_user_preferences", authenticateToken,updateUserTagsPreferencesValidator, updateUserTagsPreferences);
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
