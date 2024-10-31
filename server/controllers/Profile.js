const Profile = require("../models/profile")
const User = require("../models/user")

const uploadImageToCloudinary = require("../utils/imageUploader")
require("dotenv").config();

// HW -> check how I can schedule a request

exports.updateProfile = async(req, res) =>{
    try{
        // get data , user data
        const {dob="", about="",contactNumber="", gender=""} = req.body;
        const id = req.user.id;

        // find Profile 
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        profileDetails.dateOfBirth = dob;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        
        await profileDetails.save();
        
        // return response
        return res.json({
            success: true,
            message: "Profile updated successfully.",
            profileDetails,
        })
    } catch(err){
        return res.json({
            success: false,
            message: "Error in creating Profile ."
        })
    }
}

// deleteAccount
// EXPLORE -> how can we schedule this deletion operation

exports.deleteAccount = async (req, res) => {
    try{
        // get userId from request
        const id = req.user.id;

        // validation
        const userDetails = await User.findById({_id: id});
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "User not found",
            })
        }

        // delete profile
        const profileDetails = await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});
        // TODO HW -> unenroll user from all enrolled courses
        // delete user
        await User.findByIdAndDelete({_id: id});

        return res.status(200).json({
            success: true,
            message: "Profile Deleted successfully.",
            profileDetails,
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}


exports.getAllUserDetails = async (req, res) => {
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();


        // return response
        return res.status(200).json({
            success: true,
            message: "Profile data fetched successfully.",
            userDetails,
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "error in getting user Details."
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture;
      const userId = req.user.id;

      const image = await uploadImageToCloudinary(displayPicture, process.env.FOLDER_NAME, 1000, 1000);

      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }