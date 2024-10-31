const mongoose = require('mongoose');
const mailSender = require("../utils/mailSender");

// Define the OTP schema
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Use function for default date
        expires: 5 * 60, // TTL index in seconds
    }
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);
        console.log("Email sent successfully: ", mailResponse);
    } catch (err) {
        console.error("Error occurred while sending mail: ", err);
        throw err; // Ensure errors are propagated
    }
}

// Pre-save hook to send email
otpSchema.pre("save", async function (next) {
    if (this.isNew) { // Send email only if this is a new document
        try {
            await sendVerificationEmail(this.email, this.otp);
            next();
        } catch (err) {
            next(err); // Pass errors to the next middleware
        }
    } else {
        next(); // Skip if not a new document
    }
});

// Export the model
module.exports = mongoose.model("OTP", otpSchema);
