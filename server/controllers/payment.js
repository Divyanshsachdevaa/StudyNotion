const {instance} = require("../config/razorpay");
const Course = require("../models/course");
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const crypto = require('crypto');
const CourseProgress = require("../models/courseProgress");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    
    // step1 -> get course and user id
    const {courses} = req.body;
    const userId = req.user.id;

    // step2 -> validate if courses are 0
    if(courses.length === 0){
        return res.status(400).json({success: false, message: "No courses selected"});
    }

    // step3 -> calculate total amount
    let totalAmount = 0;

    for(const course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.status(400).json({success: false, message: "Course not found"});
            }
            const uid = new mongoose.Types.ObjectId(userId);

            if(course.StudentsEnrolled.includes(uid)){
                return res.status(200).json({success: false, message: "Student is already Enrolled"});
            }

            totalAmount += course.price;
        }
        catch(err){
            console.log(err);
            return res.status(500).json({success: false, message: err.mesage});
        }
    }

    // step4 -> create payment order
    const options = {
        amount: totalAmount * 100, // convert to paise
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success: true,
            message: paymentResponse,
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Could not Initialize Order"});
    }
}

// verify payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.rarazorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.body?.userId;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId ){
        return res.status(400).json({success: false, message: "Payment failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if(expectedSignature === razorpay_signature){
        // enroll student
        await enrollStudents(courses, userId, res);

        // return res
        return res.status(200).json({success: true, message: "Payment verified"});
    }    
    return res.status(400).json({success: "false", message: "Payment rejected"});
}

const enrollStudents = async (courses, userId, res) => {
    
    if(!courses || !userId){
        return res.status(400).json({success: false, message: "Please provide data for courses and userid"});
    }

    for(const courseId of courses){
        try{
            // find the course and find student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId},
                {$push: {studentsEnrolled: userId}},
                {new: true},
            )

            if(!enrolledCourse){
                return res.status(400).json({success: false, message: "Course not found"});
            }

            const courseProgress = await CourseProgress.create({
                courseId: courseId,
                userId: userId,
                completedVideos: [],
            })

            // find the student and add this course in its courses
            const enrolledUser = await User.findOneAndUpdate(
                { _id : userId},
                {$push: {courses: courseId, courseProgress: courseProgress._id}},
                {new: true},
            )
            // send mail to student
            const emailResponse = await mailSender(
                enrollStudents.email,
                `SuccessFully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledUser.firstName}`)
            )
            // console.log("Email sent successfully", emailResponse.response4);
        }
        catch(err){
            console.log(err);
            return res.status(200).json({success: false, message: err.message})
        }

    }
}    

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;
    
    const userId = req.user.id;
    
    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).status({success: false, message: "Please provide all the fields" })
    }

    try{
        // find student to get its email 
        const enrolledStudent = await User.findById(userId);
        await mailSender(enrolledStudent.email, `Payment Received`, paymentSuccessEmail(`${enrolledStudent.firstName}`, amount/100, orderId, paymentId))
    }
    catch(err){
        console.log("error in sending mail");
        return res.status(500).json({success: false, message: "Could not send email"});
    }

}