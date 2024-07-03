const express = require('express');
const router = express.Router();

const { getAllModerations, getOneModeration, addModeration, updateModeration, deleteModeration } = require('../controllers/moderation/moderationCrudContrloler');
const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const { moderationValidator } = require('../controllers/validators/moderatorValidators');

// MODERATION ENDPOINTS
router.get("/basic/post_moderations/:postId", authenticateToken, getAllModerations);
router.get("/basic/moderations/:id", authenticateToken, getOneModeration);
router.post("/basic/moderations", authenticateToken, moderationValidator, addModeration);
router.put("/basic/moderations/:id", authenticateToken, moderationValidator, updateModeration);
router.delete("/basic/moderations/:id", authenticateToken, deleteModeration);

module.exports = router;
