const express = require('express');
const { sequelize } = require("./src/db/db");
const applyRelationShip = require("./src/db/applyRelationShip")
const {login,register,forgotPasswword,resetPasswwordPageRenderer,resetPassword,changePassword, refreshToken, logout, deactivateAccount, deleteUser, activateAccount, resendVerifierEmail, accountActivationPageRenderer} = require("./src/controllers/auth/authController")
const {deletePost,addPost,updatePost,getNoFollowedTagsPost,getFollowedTagsPost,getOnePost, getFollowedUserPost, searchPostByTags} = require("./src/controllers/post/postCrudeController")
// const {deleteCategory,addCategory,updateCategory,getAllCategories,getOneCategory} = require("./src/controllers/category/categoryCrudController")
const { getOneComment, addComment, updateComment, deleteComment , getAllChildrenComments,getAllTopLevelComments} = require('./src/controllers/comment/commentController');

const {deleteSection,addSection,updateSection,getAllSections,getOneSection} = require("./src/controllers/section/sectionCrudController")
const { userRegisterValidator, userLoginValidator, postAddingValidator,
  categoryAddingValidator,postUpdateValidator,categoryUpdateValidator,
  sectionAddingValidator,sectionUpdateValidator,commentAddingValidator,
  commentUpdateValidator,moderationValidator,
  updateUserTagsPreferencesValidator
} = require('./src/controllers/validators/validators');
const authenticateToken  = require("./src/controllers/auth/authMiddleWare")
require('dotenv').config(); // Load environment variables from .env file

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const { getAllModerations, getOneModeration, addModeration, updateModeration, deleteModeration } = require('./src/controllers/moderation/moderationCrudContrloler');
const { updateUserTagsPreferences, getUserInformations, followUser, unfollowUser, getUserFollowers, getUserFollowing, getUserNbFollowers, getUserNbFollowing, searchUser } = require('./src/controllers/user/userController');
const { votePost } = require('./src/controllers/post/postController');
const { markNotificationAsRead, getUserNotifications } = require('./src/controllers/notification/notificationController');

const cron = require('node-cron');
const { logMessage } = require('./src/helper/helper');
const { cleanupOldNotifications } = require('./src/controllers/cronJobs/notificationCronJob');
const { cleanupOldBlackListedToken } = require('./src/controllers/cronJobs/blackListedTokenCronJob');
const { cleanupOldDeactivatedAccount } = require('./src/controllers/cronJobs/deleteOldDeactivatedAccount');

const app = express();
const PORT = process.env.PORT || 5050;
const cors = require('cors');

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body for html post form
app.use(express.urlencoded({ extended: true }));

// To use cors and allow all origins
app.use(cors())

app.listen(PORT, async () => {
  console.log("Server running on port "+PORT);
  console.log('Swagger UI Express server is running on http://localhost:5050/api-docs');
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    applyRelationShip()
    await sequelize.sync({ alter: true });
    //{ force: true }
    // { alter: true }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});


// enable Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



/////////////////////////////////////////////////////////////////////////////////////// ENDPOINTS /////////////////////////////////////////////////////////////////////////////

// AUTH ENDPOINTS
app.post("/api/v1/auth/register/:lang", userRegisterValidator, register);
app.post("/api/v1/auth/login", userLoginValidator, login);
app.get("/api/v1/auth/logout",authenticateToken, logout);
app.post("/api/v1/auth/forgot-password",forgotPasswword);
app.get("/api/v1/auth/reset-password/:token",resetPasswwordPageRenderer);
app.post("/api/v1/auth/reset-password",resetPassword);
app.post("/api/v1/auth/change-password",authenticateToken,changePassword);
app.post("/api/v1/auth/refresh-token",authenticateToken,refreshToken);

// For moderator and User
app.get("/api/v1/auth/deactivate-account/:userId",authenticateToken, deactivateAccount);
app.get("/api/v1/auth/activate-account/:userId",authenticateToken, activateAccount);
app.get("/api/v1/auth/delete-account/:userId",authenticateToken, deleteUser);




///////////////////////////// CRUD ENDPOINTS ////////////////////////////////////////////////

//POST ENDPOINTS//
app.get("/api/v1/basic/followed-user-posts/:limit/:cursor",authenticateToken , getFollowedUserPost);
app.get("/api/v1/basic/recommanded-posts/:limit/:cursor",authenticateToken , getFollowedTagsPost);
app.get("/api/v1/basic/random-posts/:limit/:cursor",authenticateToken , getNoFollowedTagsPost);

app.get("/api/v1/basic/search-posts/:tags/:limit/:cursor",authenticateToken ,searchPostByTags);


app.get("/api/v1/basic/posts/:id",authenticateToken, getOnePost);
app.post("/api/v1/basic/posts/vote/:id",authenticateToken, votePost);
app.post("/api/v1/basic/posts",authenticateToken,postAddingValidator, addPost);
app.put("/api/v1/basic/posts/:id",authenticateToken,postUpdateValidator, updatePost);
app.delete("/api/v1/basic/posts/:id",authenticateToken, deletePost);


//SECTION ENDPOINTS//
app.get("/api/v1/basic/sections",authenticateToken , getAllSections);
app.get("/api/v1/basic/sections/:id",authenticateToken, getOneSection);
app.post("/api/v1/basic/sections",authenticateToken,sectionAddingValidator, addSection);
app.put("/api/v1/basic/sections/:id",authenticateToken,sectionUpdateValidator, updateSection);
app.delete("/api/v1/basic/sections/:id",authenticateToken, deleteSection);



//COMMENT ENDPOINTS//
app.get("/api/v1/basic/post-top-level-comments/:postId/:limit/:offset",authenticateToken , getAllTopLevelComments);
app.get("/api/v1/basic/children_comments/:parentCommentId/:limit/:offset",authenticateToken , getAllChildrenComments);
app.get("/api/v1/basic/comments/:id",authenticateToken, getOneComment);
app.post("/api/v1/basic/comments",authenticateToken,commentAddingValidator, addComment);
app.put("/api/v1/basic/comments/:id",authenticateToken,commentUpdateValidator, updateComment);
app.delete("/api/v1/basic/comments/:id",authenticateToken, deleteComment);



//MODERATION ENDPOINTS//
app.get("/api/v1/basic/post_moderations/:postId",authenticateToken , getAllModerations);
app.get("/api/v1/basic/moderations/:id",authenticateToken, getOneModeration);
app.post("/api/v1/basic/moderations",authenticateToken,moderationValidator, addModeration);
app.put("/api/v1/basic/moderations/:id",authenticateToken,moderationValidator, updateModeration);
app.delete("/api/v1/basic/moderations/:id",authenticateToken, deleteModeration);


// NOTIFICATION ENDPOINTS//

// Get notifications for the connected user
app.get('/api/v1/basic/notifications/:limit/:cursor', authenticateToken, getUserNotifications);

// Mark a notification as read
app.patch('/api/v1/basic/notifications/:id/read', authenticateToken,markNotificationAsRead);


////////////////////////////////// OPERATIONS ENDPOINTS////////////////////////////////////////////////


// // Follow/Unfollow Endpoints
app.post("/api/v1/basic/users/follow/:id", authenticateToken, followUser);
app.post("/api/v1/basic/users/unfollow/:id", authenticateToken, unfollowUser);

// Retrieve Followers and Following Lists
app.get("/api/v1/basic/users/followers", authenticateToken, getUserFollowers);
app.get("/api/v1/basic/users/following", authenticateToken, getUserFollowing);

// Followers and Following number
app.get("/api/v1/basic/users/nb_followers", authenticateToken, getUserNbFollowers);
app.get("/api/v1/basic/users/nb_following", authenticateToken, getUserNbFollowing);



// Update User preferences
app.post("/api/v1/basic/update_user_preferences",authenticateToken,updateUserTagsPreferencesValidator,updateUserTagsPreferences)
// Get user information
app.get("/api/v1/basic/users/:id",authenticateToken,getUserInformations)

// SEARCH BY USER 
app.get("/api/v1/basic/search-users/:username/:limit/:cursor",authenticateToken ,searchUser);

// Email verification system
app.get("/api/v1/auth/account-activation/:token",accountActivationPageRenderer);
app.get("/api/v1/auth/verify-email/:email/:lang",resendVerifierEmail);

// ////////////////////////////////////////////////////BACKGROUND TASK//////////////////////////////////////////////////////

// BACKGROUND TASK TO CLEAN UP OLD READ NOTIFICATION
            // ┌───────────── minute (0 - 59)
            // │ ┌───────────── heure (0 - 23)
            // │ │ ┌───────────── jour du mois (1 - 31)
            // │ │ │ ┌───────────── mois (1 - 12 ou JAN-DÉC)
            // │ │ │ │ ┌───────────── jour de la semaine (0 - 6 ou DIM-SAM)
            // │ │ │ │ │
            // * * * * *  
cron.schedule('0 0 * * 0', async () => {
  logMessage()
  cleanupOldNotifications()
});

// BACKGROUND TASK TO CLEAN UP OLD EXPIRED TOKEN
cron.schedule(' 0 0 * * * ', async () => {
  cleanupOldBlackListedToken()
  logMessage()
});


// BACKGROUND TASK TO CLEAN UP OLD Deactivated Account
cron.schedule(' * * * * * ', async () => {
  cleanupOldDeactivatedAccount()
  logMessage()
});








