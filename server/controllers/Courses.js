const Course = require("../models/course");
const User = require("../models/user");
const Category = require("../models/Category");
const uploadImageToCloudinary = require("../utils/imageUploader");
const Section = require("../models/sectionModel");
const SubSection = require("../models/subSection");

function convertSecondsToDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

// Add this function to your module or import it if defined elsewhere


// create course handler
exports.createCourse = async (req, res) => {
    try {
        // fetch data
        let { courseName, courseShortDesc, whatYouWillLearn, price, status, tag: _tag, category, instructions: _instructions} = req.body;

        courseName = courseName.trim();
        courseShortDesc = courseShortDesc.trim();
        whatYouWillLearn = whatYouWillLearn.trim();
        price = Number(price); // Convert price to number
      
        // get thumbnail
        const thumbnail = req.files.thumbnailImage;
        if (!req.files || !req.files.thumbnailImage) {
          console.log("req.files is:", req.files);  // Debugging
          return res.status(400).json({
              success: false,
              message: "Thumbnail image not present",
          });
      }
      
        // Convert the tag and instructions from stringified Array to Array

        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);

        console.log("TAG = ", tag);
        console.log("INSTRUCTIONS = ", instructions);

        console.log("courseName = " + courseName);
        console.log("courseShortDesc = " + courseShortDesc);
        console.log("whatYouWillLearn = " + whatYouWillLearn);
        console.log("price = " + price);
        console.log("status = " + status);
        console.log("tags = " + tag);
        console.log("Category = " + category);
        console.log("instructions = " + instructions);

        if(thumbnail){
          console.log("Thumnail is present");
        }
        

        // validation
        if (!courseName || !courseShortDesc || !whatYouWillLearn || !price || !thumbnail || !tag.length || !category || !instructions.length) {
          console.log("VALIDATION M DIKKAT HAI");
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields!"
            });
        }

        if(!status || status === undefined){
          status = "Draft"
        }

        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId, {accountType: "Instructor"});
        console.log("Instructor Details: ", instructorDetails);

        if (!instructorDetails) {
            console.log("No instructor");
            return res.status(400).json({
                success: false,
                message: "Instructor details not found"
            });
        }

        // check given category is valid or not
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an entry for new course
        const newCourse = await Course.create({
            name: courseName,
            description: courseShortDesc,
            instructor: instructorDetails._id,
            price,
            whatYouWillLearn,
            courseContent: [],
            thumbnail: thumbnailImage.secure_url,
            status: status,
            tag,
            category: categoryDetails._id,
            instructions,
        });

        // add the new course to the user model of instructor
        await User.findByIdAndUpdate(
            {
              _id: instructorDetails._id,
            },  
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
        );

        // Add the new course to the Categories
        const updatedCategory = await Category.findByIdAndUpdate(
            { _id: categoryDetails._id},
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
        );

        // return response
        return res.status(200).json({
            success: true,
            message: "Course created successfully!",
            data: newCourse,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in creating Course!",
        });
    }
};

// get all courses handler function

exports.showAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.find({}, {name: true,
                                                    price: true,
                                                    thumbnail: true,
                                                    intructor: true,
                                                    raitingAndReviews: true,
                                                    studentsEnrolled: true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "All Courses fetched successfully !",
            data: allCourses,
        })

    } catch(err){
        console.log(err);
        return res.status(500).json({
            sucess: false,
            message: "Error in fetching Courses !",
        })
    }
}

exports.getCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate("StudentsEnrolled")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
            select: "-videoUrl",
          },
        })
        .exec()
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      if (courseDetails.status === "Draft") {
        return res.status(403).json({
          success: false,
          message: `Accessing a draft course is forbidden`,
        });
      }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}

// DELETE and Edit COURSE KA CONTROLLER TO LIKH DE  

exports.editCourse = async (req, res) => {
  try{
    // fetch data 
    // validate data 
    // update data in database
    // return updated response

    const {courseId} = req.body;
    const updatedData = req.body;
    
    const course = await Course.findById(courseId);

    if(!course){
      return res.status(404).json({
        success: false,
        message: "Course id is not valid",
      })
    }

    if(req.files){
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updatedData) {
      if (updatedData.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updatedData[key])
        } else {
          course[key] = updatedData[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
    
  } catch(error){
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Course updation failed Internal Server Error",
      error: error.message,
    })
  }
}

exports.getInstructorCourses = async (req, res) => {
  try{
    const instructorId = req.user.id;
    const instructor = await User.findById(instructorId).populate({
      path: "courses",
      options: {sort : {createdAt: -1}},
    });

    if(!instructor){
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Instructor courses fetched successfully",
      data: instructor.courses,
    })
  } catch(err){
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: err.message
    })

  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnroled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}