const express = require("express");
const router = express.Router();
const {auth, isStudent, isAdmin, isInstructor} = require("../middlewares/auth");

const {createCourse, showAllCourses, getCourseDetails} = require("../controllers/Courses")
const {createCategory, showAllCategories, categoryPageDetails} = require("../controllers/Category")
const {createRating, getAverageRating, getAllRatings} = require("../controllers/RatingAndReviews");
const {createSection, updateSection, deleteSection} = require("../controllers/Section");
const {createSubSection, updateSubSection, deleteSubSection} = require("../controllers/SubSection");("../controllers/subSection");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************


router.post("/createCourse", auth, isInstructor, createCourse);
router.get("/showAllCourses", auth, isStudent, showAllCourses);
router.post("/getCourseDetails", auth, isInstructor, getCourseDetails);
router.post("/createSection",auth, isInstructor, createSection)
router.put("/updateSection",auth, isInstructor, updateSection)
router.delete("/deleteSection",auth, isInstructor, deleteSection);
router.post("/createSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", auth, isInstructor, showAllCategories)
router.post("/categoryPageDetails", auth, isAdmin, categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

router.post("/createRating", auth, isStudent, createRating)
router.post("/getAverageRating",auth, isStudent, getAverageRating)
router.post("/getAllRatings",auth, isStudent, getAllRatings)

module.exports = router;