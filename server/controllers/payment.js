const {instance} = require("../config/razorpay");
const Course = require("../models/course");
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    // get course id and user id
    const {courseId} = req.body;
    const userId = req.user.id;
    // validation
    if(!courseId){
        return res.json({
            success: false,
            message: "Please provide valid course Id"
        })
    }
    // valid courseDetails and id
    let course;
    try{
        course = await Course.findById(courseId);
        if(!course){
            return res.json({
                success: false,
                message: "Could not find the course",
            })
        }
        // user already pay for the same course
        // right now my userId is of type string
        // but in my course model, it is of type objectId
        // so convert string to objectId
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.StudentsEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: "Student already enrolled",
            })
        }
        
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
    // order create
    const amount = course.price;
    const currency = 'INR';

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId : courseId,
            userId,
        }
    };

    // return response
    try{
        // initialize the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        // return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.orderId,
            amount: paymentResponse.amount,
            currency: paymentResponse.currency,
        })
    } catch(err){
        res.json({
            success: false,
            message: "Could not initiate order"
        })
    }
};

// verify signature of RazorPay and Server
exports.verifySignature = async(req, res) => {
    const webHookSecret = "123456778";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHnac("sha256", webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    
    if(digest == signature){
        console.log("Payment is Authorized");

        // user id and course id nikal lo notes m se
        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{
            // fulfill the action

            // find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                                                                {_id: courseId},
                                                                {$push: {studentsEnrolled: userId}},
                                                                {new: true}
                                                            );
            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: 'Course not found'
                })
            }

            console.log(enrolledCourse);

            // find thr student and add the course in their lsit enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                {_id: userId},
                {$push: {courses: courseId}},
                {new: true},
            );

            console.log(enrolledStudent);

            // send confirmation mail
            let title = "Congratulations from CodeHelp!";
            let body = "Congratulations! you are onboarded into new Course";

            const emailResponse = await mailSender(enrolledStudent.email, title ,body);
            console.log(emailResponse);
            return res.status(200).json({
                success: true,
                message: "Course Enrolled Successfully",
            })               
        } catch(err){
            return res.status(500).json({
                success: false,
                message: err.message,
            }) 
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid! request",
        }) 
    }
}