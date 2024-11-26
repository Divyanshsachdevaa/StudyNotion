const SubSection = require("../models/subSection")
const Section = require("../models/sectionModel");
const uploadImageToCloudinary = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
    try{
        // fetch data from req body
        const {sectionId, lectureTitle, lectureDesc, timeDuration} = req.body;

        // extract file
        const lectureVideo = req.files.lectureVideo;

        // validation
        // removed timeDuration validation temporarily
        if(!sectionId || !lectureTitle || !lectureDesc || !lectureVideo){
            return res.status(400).json({
                success: false,
                message: "All fields required !",
            })
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(lectureVideo, process.env.FOLDER_NAME);
        
        // send url by mail

        // create subsection
        const SubSectionDetails = await SubSection.create({
            title: lectureTitle,
            timeDuration: 0,
            description: lectureDesc,
            videoUrl: uploadDetails.secure_url,
        })

        // push id of this subSection in Section
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId}, {
            $push: {subSection: SubSectionDetails._id}
        }, {new: true}).populate("subSection");
        // HW: log updated subsection here after adding populate query

        // return response
        return res.status(200).json({
            success: true,
            message: "SubSection Created successfully !",
            data: updatedSection,
        })
        
    } catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

// HW: updateSubSection, deleteSubSection

exports.updateSubSection = async (req, res) => {
    try{
        // step1 -> get data 
        // step2 -> validate data 
        // step3 -> update subSection
        // step4 -> populate section with subSection

        const {sectionId, subSectionId, title, description} = req.body;
        const video = req.files.videoFile;
        if(!sectionId || !subSectionId){
            return res.status(400).json({
                success: false,
                message: "Section and SubSection id required !",
            })
        }

        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(401).json({
                success: false,
                message: "No SubSection found, Please fill valid id !",
            })
        }

        if(title){
            subSection.title = title;
        }
        if(description){
            subSection.description = description;
        }

        if(video){
            const uploadedVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.video = uploadedVideo.secure_url;
            subSection.timeDuration = `${uploadedVideo.duration}`;
        }

        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate("subSection");

        return res.status(200).json({
            success: true,
            message: "subSection updated successfully",
            data: updatedSection,
        })

    } catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.deleteSubSection = async(req, res) =>{
    try{
        // step1 -> fetch section & subSection data
        // step2 -> validate data
        // step3 -> delete subSection from section and now delete individual subSection

        const {sectionId, subSectionId} = req.body;

        if(!sectionId || !subSectionId){
            return res.status(400).json({
                success: false,
                message: "please fill all the details"
            })
        }

        const section = await Section.findByIdAndUpdate(sectionId,
            {
                $pull:{
                    subSection: subSectionId,
                }
            },
            {
                new: true,
            }
        );
        if(!section){
            return res.status(400).json({
                success: false,
                message: "No section found, Please enter valid sectionId"
            })
        }

        const subSection = await SubSection.findByIdAndDelete(subSectionId);
        if(!subSection){
            return res.status(400).json({
                success: false,
                message: "No subSection found, Please enter valid subSectionId"
            })
        }

        const updatedSection = await section.findById(sectionId).populate("subSection");

        return res.status(200).json({
            success: true,
            message: "subSection Deleted successfully",
            data: updatedSection,
        })

    } catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}