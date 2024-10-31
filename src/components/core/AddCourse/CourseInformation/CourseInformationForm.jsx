import React from 'react';
import { useSelector , useDispatch} from 'react-redux';
import {addCourseDetails, editCourseDetails, fetchCourseCategories} from "../../../../services/operations/courseAPI.js";
import { useForm } from 'react-hook-form';
import {useState, useEffect} from 'react'
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import RequirementField from "./ReuirementField.js";
import {setStep, setCourse} from "../../../../slices/CourseSlice.js"
import {toast} from 'react-hot-toast';

const CourseInformationForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
    } = useForm();

    const [courseCategories, setCourseCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const {course, editCourse} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);


    useEffect(() => {
        const getCourseCategory = async() => {
            setLoading(true);
            const categories = await fetchCourseCategories();
            console.log(categories);
            if(categories.length > 0){
                setCourseCategory(categories)
            }
            setLoading(false);
        }

        if (editCourse) {
            // console.log("data populated", editCourse)
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }

        getCourseCategory();
    }, []);

    const isFormUpdated = () => {
        const currentValues = getValues();
        if()
    }

    const onSubmit = async(data) => {
        // editCourse variable means Course pehle ban chuka hai m abhi edit krne aya hu
        if(editCourse){
            if(isFormUpdated()){
                const currentValues = getValues();
                const formData = new FormData();

                formData.append("courseId", course._id);

                if(currentValues.courseTitle !== course.courseName){
                    formData.append("courseName", data.courseTitle);
                }

                if(currentValues.courseShortDesc !== course.courseShortDesc){
                    formData.append("courseShortDesc", data.courseShortDesc);
                }

                if(currentValues.coursePrice !== course.coursePrice){
                    formData.append("price", data.coursePrice);
                }

                // if(currentValues.courseTags !== course.courseTags){
                //     formData.append("courseTags", data.courseTags);
                // }

                if(currentValues.courseBenefits !== course.whatYouWillLearn){
                    formData.append("whatYouWillLearn", data.courseBenefits);
                }

                if(currentValues.courseCategory._id !== course.courseCategory._id){
                    formData.append("courseCategory", data.courseCategory);
                }

                if(currentValues.courseRequirements.toString() !== course.courseRequirements.toString()){
                    formData.append("instructions", JSON.strinify(data.courseRequirements));
                }

                // if(currentValues.courseImage !== course.courseImage){
                //     formData.append("courseImage", data.courseImage);
                // }

                setLoading(true);
                const result = await editCourseDetails(formData, token);
                setLoading(false);
                if(result){
                    setStep(2);
                    dispatch(setCourse(token))
                }
            }
            else{
                toast.error("No changes made to the form");
            }
            return ;
        }
        else{
            // create a new course
            const formData = new FormData();
            formData.append("courseName", data.courseTitle);
            formData.append("courseShortDesc", data.courseShortDesc);
            formData.append("price", data.coursePrice);
            formData.append("whatYouWillLearn", data.courseBenefits);
            formData.append("courseCategory", data.courseCategory);
            formData.append("instructions", JSON.strinify(data.courseRequirements));
            formData.append("status", COURSE_STATUS.DRAFT);

            setLoading(true);
            const result = await addCourseDetails(formData, token);
            if(result){
                setStep(2);
                dispatch(setCourse(result));
            }
            setLoading(false);
        }
    }

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
        >
            <div className="space-y-2 flex flex-col">
                <label className="text-sm text-richblack-5" htmlFor="courseTitle"> Course Title<sup className='text-pink-200'>*</sup> </label>
                <input 
                    id='courseTitle'
                    placeholder='Enter Course Title'
                    {...register("courseTitle", {required: true})}
                    className='form-style w-full rounded-md bg-richblack-600'
                />
                {
                    errors.courseTitle && (
                        <span className='ml-2 text-xs tracking-wide text-pink-200'>Course Title is Required**</span>
                    )
                }
            </div>    

            <div className="space-y-2 flex flex-col">
                <label className="text-sm text-richblack-5" htmlFor="courseDesc">Course Short Description<sup>*</sup></label>
                <textarea
                    id='courseDesc'
                    placeholder='Enter Description'
                    {...register("courseShortDesc", {required: true})}
                    className="form-style resize-x-none min-h-[130px] w-full rounded-md bg-richblack-600"
                />
                {
                    errors.courseShortDesc && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">Course Short Description is Required**</span>
                    )
                }
            </div>

            <div>
                <label 
                    className="text-sm text-richblack-5"
                >Price<sup>*</sup></label>
                <div className='relative'>
                    <textarea
                        id='coursePrice'
                        placeholder='Enter Course Price'
                        {...register("coursePrice", {required: true, valuedAsNumber: true})}
                        className="form-style w-full !pl-12 rounded-md bg-richblack-600"
                    />
                    <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
                </div>
                {
                    errors.coursePrice && (
                        <span>course Price is Required**</span>
                    )
                }
            </div>

            <div>
                <label htmlFor="courseCategory" >Course Category <sup>*</sup></label>
                <select 
                    id='courseCategory'
                    defaultValue="course"
                    {...register("courseCategory", {required: true})}
                >
                    <option value="" disabled >Chooose a Category</option>
                    {
                        !loading && courseCategories.map( (category, index) => 
                            <option key={index} value={category?._id}>
                                {category?.name}
                            </option>
                        )
                    }
                </select>
            </div>

            {/* create a custom component for handling tags inputs */}
            {/* <ChipInput 
                label="Tags"
                name="courseTags"
                placeholder="Enter tags and press enter"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            /> */}

            {/* Create a component for uploading and showing preview of media */}
            {/* <Upload
                name="upload"
                label="Upload Thumbnail"
                register={register}
                errors={errors}
                setValue={setValue}
            /> */}

            {/* Benefits of the course */}

            <div>
                <label>Benefits of the course <sup>*</sup></label>
                <textarea 
                    id="coursebenefits"
                    placeholder="Enter Benefits of the course"
                    {...register("courseBenefits", {required: true})}
                    className='min-h-[130px] w-full'
                />
                {
                    errors.courseBenefits && (
                        <span>Benefits of the course are required**</span>
                    )      
                }
            </div>

            <RequirementField
                name="CourseRequirements"
                label="Requirements/Instructions"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            />

            <div>
                {
                    editCourse && (
                        <button 
                            onClick={() => dispatch(setStep(2))}
                            className='flex flex-items gap-x-2 bg-richblack-300'
                        >
                            Continue Without Saving
                        </button>
                    )
                }

                <IconBtn 
                    text={!editCourse ? "Next" : "Save Changes"}
                    
                />
            </div>

        </form>
    )
}

export default CourseInformationForm;