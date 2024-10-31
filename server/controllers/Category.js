const Category = require("../models/Category")
const Course = require("../models/course");

exports.createCategory = async (req, res) => {
    try{
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const tagDetails = await Category.create({name: name, description : description});

        console.log(tagDetails);
        return res.status(200).json({
            success: true,
            message: "Tag created successfully"
        })
    } catch(err){
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Error in creating Tag."
        })

    }
}

exports.showAllCategories = async (req, res) => {
    try{
        const allCategories = await Category.find({}, {name: true, description: true});
        return res.status(200).json({
            success: true,
            message: "All Categories returned successfully",
            allCategories,
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "ERROR AGYA HAI -> " + err.message,
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
    try{
        // get categoryId
        const {categoryId} = req.body;
        // get courses for specified category
        const selectedCourses = await Category.findById(categoryId)
                                                                .populate("courses")
                                                                .exec();

        // validation
        if(!selectedCourses){
            return res.status(404).json({
                success: false,
                message: "Data not found!",
            })
        }
        // get courses for different catedories
        const differentCategories = await Category.find({
                                                          _id: {$ne: categoryId},  
                                                        })
                                                        .populate("course")
                                                        .exec();
        // get top selling courses -> HW
        const givenCategory = await Category.find(categoryId);
        const topCourses = await Course.aggregate([
                                                    {
                                                        $match: {
                                                            _id: {$in: category.courses}
                                                        }
                                                    },
                                                    {
                                                        $addFields: {
                                                            enrolledCount: { $size: "$StudentsEnrolled" }
                                                        }
                                                    },
                                                    {
                                                        $sort: { enrolledCount: -1 } // Sort by the number of students enrolled in descending order
                                                    },
                                                    {
                                                        $limit: 10
                                                    }
        ])
        // return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCourses,
                differentCategories,
            }
        })



    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}