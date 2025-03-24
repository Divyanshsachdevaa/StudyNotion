const CourseProgress = require('../models/courseProgress');
const SubSections = require('../models/subSection');

exports.updateCourseProgress = async (req, res) => {
    const {courseId, subSectionId} = req.body();
    const userId = req.user.id;

    try{
        // check if the subSection is valid
        const subSection = await SubSections.findById(subSectionId);
        if(!subSection){
            return res.status(404).json({error: "Invalid SubSection"});
        }

        // check for old entry
        let courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            subSectionId: subSectionId,
        });

        if(!courseProgress){
            return res.status(404).json({success: false, error: "Course Progress does not exist"});
        }
        else{
            // check for re-completing video/subsection
            if(CourseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({error: "You have already completed this video"});
            }

            // push into completed video
            CourseProgress.completedVideos.push(subSectionId);

        }
        await courseProgress.save();
        return res.status(200).json({
            success: true,
            message: "Course progress updated successfully"
        })

    } catch(err){
        console.error(err);
        return res.status(404).json({error: "Internal Server Error"});
    }
}