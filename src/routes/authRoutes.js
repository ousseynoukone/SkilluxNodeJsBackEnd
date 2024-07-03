const express = require('express');
const router = express.Router();

const { 
  login, register, forgotPassword, resetPasswordPageRenderer, resetPassword, changePassword, 
  refreshToken, logout, deactivateAccount, deleteUser, activateAccount, resendVerifierEmail, 
  accountActivationPageRenderer
} = require("../controllers/auth/authController");

const authenticateToken = require("../controllers/auth/middleware/authMiddleWare");
const refreshTokenMiddleWare = require("../controllers/auth/middleware/refreshTokenMiddleWare");
const { validateRegister, validateLogin } = require('../controllers/validators/authValidators');

// AUTH ENDPOINTS
router.post("/auth/register/:lang", validateRegister, register);
router.post("/auth/login/:lang", validateLogin, login);
router.get("/auth/logout", authenticateToken, logout);
router.post("/auth/forgot-password", forgotPassword);
router.get("/auth/reset-password/:token", resetPasswordPageRenderer);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/change-password", authenticateToken, validateLogin, changePassword);
router.post("/auth/refresh-token", refreshTokenMiddleWare, refreshToken);

router.get("/auth/account-activation/:token", accountActivationPageRenderer);
router.get("/auth/verify-email/:email/:lang", resendVerifierEmail);

// For moderator and User
router.get("/auth/deactivate-account/:userId", authenticateToken, deactivateAccount);
router.get("/auth/activate-account/:userId", authenticateToken, activateAccount);
router.post("/auth/delete-account", authenticateToken, deleteUser);

module.exports = router;
