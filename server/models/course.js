const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
        required: true,
        trim: true,
    },
    courseContent:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "section",
        }
    ],
    ratingAndReviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "ratingAndReview",
        }
    ],
    price:{
        type: Number,
        require: true,
    },
    thumbnail:{
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "category"
    },
    StudentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        }
    ]
})

module.exports = mongoose.model("course", courseSchema);