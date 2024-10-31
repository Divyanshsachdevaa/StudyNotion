const crypto = require('crypto'); 
const mailSender = require('../utils/mailSender'); 
const User = require('../models/user');
const bcrypt = require('bcrypt');

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try{
        // get email from req body
        // check user for this email, email validation
        // generate token
        // update user by adding token and expiration time
        // create url
        // send mail containing the url
        // return response

        const email = req.body.email;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(500).json({
                success: false,
                messages: "User doesn't exist , please try again",
            })
        }

        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate({email: email}, {
                                                            token: token,
                                                            resetPasswordExpires: Date.now() + 5 * 60 * 1000,
        }, {new: true});
        const url = `http://localhost:3000/update-password/${token}`;
        await mailSender(email, "Password reset link", `password reset link: ${url} `);

        return res.status(200).json({
            success: true,
            message: "Mail Sent successfully! Please check your email",
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while changing password, Please try again",
        })
    }
}


// resetPassword
exports.resetPassword = async (req, res) => {
    try{
        // data fetch
        // validation
        // get user details from db using token
        // if no entry - invalid token ya token ka time expire ho chuka h
        // token time check 
        // hash password
        // password update
        // return response

        const {password, confirmPassword, token} = req.body;
        if(!password || !confirmPassword || !token){
            return res.status(500).json({
                success: false,
                message: "Please fill all details asked",
            })
        }
        if(password !== confirmPassword){
            return res.status(500).json({
                success: false,
                message: "password and confirm password are not same, please fill carefully",
            })
        }    
        const details = await User.findOne({token: token});
        
        if(!details){
            return res.json({
                success: false,
                message: "Token is invalid !",
            })
        }
        
        if(details.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Please regenerate token",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate({token: token}, {password: hashedPassword}, {new: true});
        
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        })

    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in changing password, please try again",
        })
    }
}   