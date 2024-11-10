const express = require('express');
const router = express.Router();

const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const { getUserLikesIds } = require('../controllers/userLike/userLikeController');

router.get("/basic/user-likes-ids/:ressourceType", authenticateToken, getUserLikesIds);

module.exports = router;
