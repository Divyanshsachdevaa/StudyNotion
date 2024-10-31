const express = require("express");
const router = express.Router();
const {auth, isStudent, isAdmin, isInstructor} = require("../middlewares/auth");
const {capturePayment, verifySignature} = require('../controllers/payment');

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", auth, isStudent, verifySignature);

module.exports = router;