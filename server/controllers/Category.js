const Category = require("../models/Category")
const Course = require("../models/course");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

exports.createCategory = async (req, res) => {
    try{
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const categoryDetails = await Category.create({name: name, description : description});

        console.log(categoryDetails);

        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        })
    } catch(err){
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Error in creating Category."
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

exports.getCategoryPageDetails = async (req, res) => {
    try{
        // get categoryId
        const {categoryId} = req.body;
        // get courses for specified category
        const selectedCategory = await Category.findById(categoryId)
        .populate({
            path: 'courses',
            match: {status: "Published"},
            populate: "ratingAndReviews",
        }).exec();

        // validation
        if(!selectedCategory){
            console.log("Category not found");
            return res.status(404).json({
                success: false,
                message: "Category not found!",
            })
        }

        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
            })
        }

        
        // get courses for different categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
        
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
            )
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec()

        // get top selling courses
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec()
            const allCourses = allCategories.flatMap((category) => category.courses)
            const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)

        // return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
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