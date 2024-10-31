const RatingAndReviews = require("../models/ratingAndReviews");
const Course = require("../models/course");
const course = require("../models/course");

// create Rating

exports.createRating = async (req, res) => {
    try{
        // get userId
        const userId = req.user.id; // middleware se ye req m dali thi
        // fetch data from req body
        const {rating, reivew, courseId} = req.body;
        // check is user is enrolled or not
        const courseDetails = await Course.findOne({_id:courseId, studentsEnrolled: {$eleMatch: {$eq: userId}}});
        
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in Course",
            })
        }

        // check user already reviewed the course
        const alreadyReviewedCourse = await RatingAndReviews.findOne({user:userId, course: courseId});
        if(alreadyReviewedCourse){
            return res.status(403).json({
                success: false,
                message: "You already reviewed this course",
            })
        }
        // create rating and reviews
        const ratingReview = await RatingAndReviews.create({rating, review, course:courseId, user: userId});
        // update course 
        await course.findByIdAndUpdate({_id:courseId}, 
                                                {
                                                    $push: {
                                                        ratingsAndReviews: ratingReview._id,
                                                    }
                                                }, 
                                                {new: true}                                      
        )
        // return response
        return res.status(200).json({
            success: true,
            message: "Rating and Review created Successfully",
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Rating and Review created Successfully",
        })
    }
}
// get Avg Rating

exports.getAverageRating = async (req, res) =>{
    try{
        // get course Id
        const courseId = req.body.courseId;

        // calculate avg rating 
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id: null,
                    averageRating: { $avg: "$rating"},
                }
            }
        ])
        
        // return rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        // else means there is no rating on this course
        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no ratings given till now",
            averageRating: 0,
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

// getAllRatingsAndReviews
exports.getAllRatings = async (req, res) =>{
    try{
        const allReviews = await RatingAndReviews.find({})
                                                        .sort({rating: "desc"})
                                                        .populate({
                                                            path: "user",
                                                            select: "firstName lastName email image",
                                                        })
                                                        .populate({
                                                            path: "course",
                                                            select: "courseName",
                                                        })
                                                        .exec();
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}