const Course = require("../models/course");
const Section = require("../models/sectionModel");
const SubSection = require("../models/subSection");

exports.createSection = async (req, res) => {
    try{
        // data fetch
        console.log('enterd createsection');
        const {sectionName, courseId} = req.body;
        console.log("Section name = ", sectionName);
        console.log("courseId = ", courseId);

        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                error: "All fields are required."});
        }

        // create section
        const newSection = await Section.create({sectionName});
        
        console.log("Before updating course");
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
              $push: {
                courseContent: newSection._id,
              },
            },
            { new: true }
          ).populate({
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            })
            .exec()

            console.log("After updating course")
        
        // HW -> use populate to replace section subsections both in the updatedCourseDetails
        // return reponse
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse,
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Error in creating Section !",
            error: err.message,
        })
    }
}


exports.updateSection = async (req, res) =>{
    try{
        // fetch data
        const {newSectionName, sectionId, courseId} = req.body;
        
        // data validation
        if(!newSectionName || !sectionId || !courseId){
            return res.status(400).json({
                success: false,
                message: "Please fill all the details !",
            })
        }

        // update data
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName: newSectionName}, {new: true});

        const updatedCourse = await Course.findById(courseId).populate({
            path: 'courseContent',
            populate: {
                path: 'subSection'
            }
        }).exec();

        
        
        // return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedCourse,
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Error in updating Section !",
            err: err.message,
        })
    }
}

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body ;

        // Validate inputs
        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Section ID and Course ID are required",
            });
        }

        // Remove the section reference from the course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $pull: { courseContent: sectionId } },
            { new: true } // Return the updated document
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Find the section
        const section = await Section.findById(sectionId);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // Delete associated sub-sections
        await SubSection.deleteMany({ _id: { $in: section.subSection } });

        // Delete the section itself
        await Section.findByIdAndDelete(sectionId);

        // Populate the updated course content
        const populatedCourse = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully!",
            data: populatedCourse,
        });
    } catch (err) {
        // Handle server errors
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the section",
            error: err.message,
        });
    }
};
