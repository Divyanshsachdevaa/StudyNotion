const bcrypt = require("bcrypt")
const User = require("../models/user")
const OTP = require("../models/otp")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const Profile = require("../models/profile")
const otpTemplate = require("../mail/templates/EmailVerificationTemplate");
require("dotenv").config()

// otp
exports.sendOTP = async (req, res) => {
    console.log("INSIDE OTP CONTROLLER");

    try {
        const { email } = req.body;
        console.log("Email received:", email);

        const checkUserPresent = await User.findOne({ email });
        console.log("User check:", checkUserPresent);

        let otp = otpGenerator.generate(6, {
            lowerCaseAlphabet: false,
            upperCaseAlphabet: false,
            specialChars: false,
        });
        console.log("Generated OTP:", otp);

        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP stored in DB:", otpBody);

        await mailSender(email, "OTP VERIFICATION MAIL", otpTemplate(otp));
        console.log("Email sent successfully");

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (err) {
        console.error("Error in sendOTP:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


// signUp
exports.signUp = async (req, res) => {
    try {
        // Fetch data from request
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;
        
        // Validate data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        let token = "";

        // Check both passwords
        if (confirmPassword !== password) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match. Please try again",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please login",
            });
        }

        // Find most recent OTP stored for the user
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

        // Validate OTP
        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        } else if (otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile entry
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber || null,
        });

        // Create user entry
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            token,
            password: hashedPassword,
            accountType: accountType,
            additionalDetails: profileDetails._id,
            image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: "User signed up successfully",
            user: newUser,
        });

    } catch (err) {
        console.error("hello", err);
        return res.status(500).json({
            success: false,
            message: "User can't be registered. Please try again",
        });
    }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        console.log("User does not exists....");
        return res.status(404).json({ 
            success: false, 
            message: "User does not exist, please sign up first." 
        });
    }
    
    const accountType = user.accountType;

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials, please check your password." 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id , accountType:user.accountType}, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      accountType,
      user
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// change password
exports.changePassword = async (req, res) =>{
    try{
        // fetch data
        // validate data
        // update in db
        // send mail that password updated
        // return response

        const {email, password, newPassword, confirmNewPassword} = await req.body;
        if(!email || !password || !newPassword || !confirmNewPassword){
            return res.json({
                success: false,
                message: "Plese fill all the details."
            })
        }

        if(newPassword !== confirmNewPassword){
            return res.json({
                success: false,
                message: "password and confirm password are not same, please try again"
            })
        }

        const updatedPassword = await User.findOneAndUpdate({email: email}, {password: newPassword}, {new: true});
        await mailSender(email, "Password Changes Confirmation", "Your Password has been changed successfully");
        return res.json({
            sucess: true,
            message: "Password has been changed successfully"
        })
    } catch(err){
        return res.json({
            success: false,
            message: "Error in changing password, Please try again !"
        })
    }
}