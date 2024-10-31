const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "course",
        }
    ],    
})

module.exports = mongoose.model("category", categorySchema);