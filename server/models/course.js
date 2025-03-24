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
            ref: "Section",
        }
    ],
    ratingAndReviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ratingAndReview",
        }
    ],
    price:{
        type: Number,
        requiredd: true,
    },
    thumbnail:{
        type: String,
        require: true,
    },
    tag:{
        type: [String],
        required: true,
    },
    instructions:{
        type: [String]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
    },
    StudentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("course", courseSchema);