const Course = require("../models/course");
const User = require("../models/user");
const Category = require("../models/Category");
const uploadImageToCloudinary = require("../utils/imageUploader");

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
        const { name, description, whatYouWillLearn, price, categoryId } = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // validation
        if (!name || !description || !whatYouWillLearn || !price || !categoryId || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields!"
            });
        }

        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ", instructorDetails);

        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: "Instructor details not found"
            });
        }

        // check given category is valid or not
        const categoryDetails = await Category.findById(categoryId);
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
            name,
            description,
            instructor: instructorDetails._id,
            price,
            whatYouWillLearn,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        // add the new course to the user model of instructor
        await User.findByIdAndUpdate(
            instructorDetails._id,
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
        );

        // update course ka schema
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryDetails._id,
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
            updatedCategory: updatedCategory,
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
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
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