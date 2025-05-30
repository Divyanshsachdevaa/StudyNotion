const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

// auth
exports.auth = async (req, res, next) => {
    try{

        console.log("Entered auth middleware");

        let token = req.cookies.token || req.body.token || req.header("Authorization");

        if (token) {
            token = token.replace("Bearer ", "").trim();
        }

        console.log("Extracted Token:", token); // This should always print something, even if undefined

        // if token missing, return res
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }

        // verify token
        try{
            console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            
        } catch(err){
            console.log("TOKEN verification error");
            return res.status(401).json({
                success: false,
                messages: "token is invalid"
            })
        }
        next();
        console.log("passed from AUTH");
        
    } catch(err){
        return res.status(401).json({
            success: false,
            messages: "Something went wrong while validating the token",
        })
    }
}

// isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                status: false,
                message: "This is a protected route for Students only",
            })
        }
        next();
    } catch(err){
        return res.status(500).json({
            success: false,
            messages: "User role can't be verified, please try again",
        })
    }
}

// inInstructor
exports.isInstructor = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                status: false,
                message: "This is a protected route for Instructor only",
            })
        }
        next();
        console.log("passed from isInstructor");
    } catch(err){
        return res.status(500).json({
            success: false,
            messages: "User role can't be verified, please try again",
        })
    }
}

// isAdmin
exports.isAdmin = async(req, res, next) => {
    try{
        // req.user is token that i am sending through request
        // while creating token in login api i have included accountType in token
        // that is why i am able to fetch it here
        
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                status: false,
                message: "This is a protected route for Admin only",
            })
        }
        next();
    } catch(err){
        return res.status(500).json({
            success: false,
            messages: "User role can't be verified, please try again",
        })
    }
}