const express = require('express');
const router = express.Router();

const { setTags, getTags, getTagById, updateTag, deleteTag } = require("../controllers/tag/tag_controller");
const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const { tagAddingValidator, tagUpdatingValidator } = require('../controllers/validators/tagValidators');

// TAG ENDPOINTS
router.post('/basic/tags', authenticateToken, tagAddingValidator, setTags);
router.get('/basic/tags', authenticateToken, getTags);
router.get('/basic/tags/:id', authenticateToken, getTagById);
router.put('/basic/tags/:id', authenticateToken, tagUpdatingValidator, updateTag);
router.delete('/basic/tags/:id', authenticateToken, deleteTag);

module.exports = router;
