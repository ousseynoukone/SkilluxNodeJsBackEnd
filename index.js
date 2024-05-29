const express = require('express');
const { sequelize } = require("./src/db/db");
const applyRelationShip = require("./src/db/applyRelationShip")
const {login,register,forgotPasswword,resetPasswwordPageRenderer,resetPassword,changePassword, refreshToken} = require("./src/controllers/auth/authController")
const {deletePost,addPost,updatePost,getAllPosts,getOnePost} = require("./src/controllers/post/postCrudeController")
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
const { updateUserTagsPreferences } = require('./src/controllers/user/userController');


const app = express();
const PORT = process.env.PORT || 5050;


// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body for html post form
app.use(express.urlencoded({ extended: true }));


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
app.post("/api/v1/auth/register", userRegisterValidator, register);
app.post("/api/v1/auth/login", userLoginValidator, login);
app.post("/api/v1/auth/forgot-password",forgotPasswword);
app.get("/api/v1/auth/reset-password/:token",resetPasswwordPageRenderer);
app.post("/api/v1/auth/reset-password",resetPassword);
app.post("/api/v1/auth/change-password",authenticateToken,changePassword);
app.post("/api/v1/auth/refresh-token",authenticateToken,refreshToken);



///////////////////////////// CRUD ENDPOINTS ////////////////////////////////////////////////

//POST CRUD//
app.get("/api/v1/basic/posts/:limit/:offset",authenticateToken , getAllPosts);
app.get("/api/v1/basic/posts/:id",authenticateToken, getOnePost);
app.post("/api/v1/basic/posts",authenticateToken,postAddingValidator, addPost);
app.put("/api/v1/basic/posts/:id",authenticateToken,postUpdateValidator, updatePost);
app.delete("/api/v1/basic/posts/:id",authenticateToken, deletePost);

//CATEGORY ENDPOINTS//
// app.get("/api/v1/basic/categories",authenticateToken , getAllCategories);
// app.get("/api/v1/basic/categories/:id",authenticateToken, getOneCategory);
// app.post("/api/v1/basic/categories",authenticateToken,categoryAddingValidator, addCategory);
// app.put("/api/v1/basic/categories/:id",authenticateToken,categoryUpdateValidator, updateCategory);
// app.delete("/api/v1/basic/categories/:id",authenticateToken, deleteCategory);


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



////////////////////////////////// OPERATIONS ENDPOINTS////////////////////////////////////////////////


// // Follow/Unfollow Endpoints
// app.post("/api/v1/basic/users/:id/follow", authenticateToken, followUser);
// app.delete("/api/v1/basic/users/:id/follow", authenticateToken, unfollowUser);

// // Retrieve Followers and Following Lists
// app.get("/api/v1/auth/users/:id/followers", authenticateToken, getUserFollowers);
// app.get("/api/v1/auth/users/:id/following", authenticateToken, getUserFollowing);

// Update User preferences
app.post("/api/v1/basic/update_user_preferences",authenticateToken,updateUserTagsPreferencesValidator,updateUserTagsPreferences)

// Search Endpoints
// app.get("/api/v1/auth/search", authenticateToken, searchContent);
