const express = require('express');
const router = express.Router();

const { deleteSection, addSection, updateSection, getAllSections, getOneSection } = require("../controllers/section/sectionCrudController");
const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const { sectionAddingValidator, sectionUpdateValidator } = require('../controllers/validators/sectionsValidators');

// SECTION ENDPOINTS
router.get("/basic/sections_post/:postId", authenticateToken, getAllSections);
router.get("/basic/sections/:id", authenticateToken, getOneSection);
router.post("/basic/sections", authenticateToken, sectionAddingValidator, addSection);
router.put("/basic/sections/:id", authenticateToken, sectionUpdateValidator, updateSection);
router.delete("/basic/sections/:id", authenticateToken, deleteSection);

module.exports = router;
