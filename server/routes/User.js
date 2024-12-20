const express = require("express");
const router = express.Router();

const {auth, isStudent, isAdmin, isInstructor} = require("../middlewares/auth");
const {sendOTP, login, signUp, changePassword} = require("../controllers/auth");
const {resetPasswordToken, resetPassword} = require("../controllers/resetPassword")

router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendotp", sendOTP);
router.post("/changepassword", auth, changePassword);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;

