const express = require('express')
const router = express.Router();

const { auth, isInstructor } = require("../middlewares/auth")

const {updateProfile, deleteAccount, getAllUserDetails, updateDisplayPicture} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

router.put("/updateProfile", auth, updateProfile)
router.delete("/deleteAccount",auth, deleteAccount)
router.get("/getAllUserDetails",auth, getAllUserDetails)
router.put("/updateDisplayPicture",auth, updateDisplayPicture);
module.exports = router;