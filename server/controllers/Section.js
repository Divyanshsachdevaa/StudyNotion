const Section = require("../models/section");
const Course = require("../models/course");
const SubSection = require("../models/subSection");

exports.createSection = async (req, res) => {
    try{
        // data fetch
        const {sectionName, courseId} = req.body;
        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                error: "All fields are required."});
        }

        // create section
        const newSection = await Section.create({sectionName});
        // add in course
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, 
            {
                $push: {courseContent: newSection._id}
            },
            {new: true}
        )
        // HW -> use populate to replace section subsections both in the updatedCourseDetails
        // return reponse
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
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
        const {newSectionName, sectionId} = req.body;
        
        // data validation
        if(!newSectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Please fill all the details !",
            })
        }

        // update data
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName: newSectionName}, {new: true});
        
        // return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updatedSection
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
    try{
        // fetch id -> asuming we are sending Id in params
        const {sectionId, courseId} = req.body;

        // use 
        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(404).json({
                success: false,
                message: "Section not found",
            })
        }
        // delete associated subSections
        await SubSection.deleteMany({_id: {$in: section.subSection}});
        await Section.findByIdAndDelete(sectionId);

        // TODO -> do we need to delete sectionId from course model?
        const updatedCourse = await Course.findByIdAndUpdate(courseId, 
            {
                $pull : {courseContent: sectionId},
            },
            {
                new: true,
            }
        )
        // return res
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully !",
            updatedCourse
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}


