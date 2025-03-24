const express = require("express");
const router = express.Router();
const {auth, isStudent, isAdmin, isInstructor} = require("../middlewares/auth");

const {createCourse, showAllCourses, getCourseDetails, editCourse, getInstructorCourses, deleteCourse} = require("../controllers/Courses")
const {createCategory, showAllCategories, getCategoryPageDetails} = require("../controllers/Category")
const {createRating, getAverageRating, getAllRatings} = require("../controllers/RatingAndReviews");
const {createSection, updateSection, deleteSection} = require("../controllers/Section");
const {createSubSection, updateSubSection, deleteSubSection} = require("../controllers/subSection");
const {updateCourseProgress} = require('../controllers/courseProgress');

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************


router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse", auth, isInstructor, editCourse);
router.get("/showAllCourses", auth, isStudent, showAllCourses);
router.post("/getCourseDetails", auth, isInstructor, getCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.delete("/deleteCourse", deleteCourse);
router.post("/createSection",auth, isInstructor, createSection)
router.put("/updateSection",auth, isInstructor, updateSection)
router.post("/deleteSection",auth, isInstructor, deleteSection);
router.post("/createSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", auth, showAllCategories)
router.post("/getCategoryPageDetails", auth, getCategoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

router.post("/createRating", auth, isStudent, createRating)
router.post("/getAverageRating",auth, isStudent, getAverageRating)
router.post("/getAllRatings",auth, isStudent, getAllRatings)

module.exports = router;