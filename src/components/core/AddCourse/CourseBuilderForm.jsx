import React from 'react';
import {useForm} from 'react-hook-form';
import { IoIosAddCircleOutline } from "react-icons/io";
import {useState, useEffect} from 'react';
import IconButton from '../../common/IconButton';
import { useSelector, useDispatch } from 'react-redux';
import {setSteps, setCourse} from "../../../slices/CourseSlice";
import NestedView from './NestedView.jsx';
import toast from 'react-hot-toast';
import {updateSection, createSection} from '../../../services/operations/courseAPI.js';

const CourseBuilderForm = () => {
    const {register, handleSubmit, setValue, formState:{errors} } = useForm();
    const [editSectionName, setEditSectionName] = useState(null);
    const [loading, setLoading] = useState(false);
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);
    const {step} = useSelector((state) => state.course);
    const dispatch = useDispatch();

    
    useEffect(() => {
        console.log("Updated value of step: ", step);
        if (step === 3) {
            console.log("Navigating to PublishCourse step...");
        }
    }, [step]);
    
    const cancelEdit = () => {
        setEditSectionName(null);
        setValue('sectionName', "");
    }

    const handleChangeEditSectionName = (sectionId, sectionName) => {
        // if phle se hi vo editing state m hai 
        // section id is just true or false to set editing state
        if(editSectionName === sectionId){
            cancelEdit();
            return ;
        }
        // if nahi hai editing state m
        setEditSectionName(sectionId);
        setValue("sectionName", sectionName);
    }

    const goBack = () => {
        dispatch(setSteps(1));
    }

    const goNext = () => {
        if(course.courseContent.length === 0){
            toast.error("Please add atleast one section")
            return ;
        }
        if(course.courseContent.some((section) => section.subSection.length === 0)){
            toast.error("Please add atleast one lecture in each section");
            return ;
        }
        dispatch(setSteps(3));
        console.log("Step is dispatched successfully");
    }

    const onSubmit = async (data) => {
        setLoading(true);
    
        let result;
        if (editSectionName) {
            // Editing the section name
            result = await updateSection(
                {
                    sectionName: data.sectionName,
                    sectionId: editSectionName,
                    courseId: course._id,
                },
                token
            );
        } else {
            // Creating a new section
            console.log("Creating a new section", data);
            result = await createSection(
                {
                    sectionName: data.sectionName,
                    courseId: course._id,
                },
                token
            );
        }
    
        // Ensure result is valid before using
        if (result) {
            dispatch(setCourse(result)); // result is updated course
            console.log(result); // Log the correct result
            setEditSectionName(null);
            setValue("sectionName", "");
        } else {
            toast.error("Failed to update the course.");
        }
    
        setLoading(false);
    };
    

    return (
        <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="text-sm text-richblack-5" htmlFor='sectionName'> Section Name <sup className="text-pink-200">*</sup> </label>
                    
                    <input 
                        id='sectionName'
                        placeholder='Add Section Name'
                        {...register("sectionName", {required: true})}
                        className="form-style w-full rounded-md bg-richblack-500 text-white"
                    />
                    
                    {
                        errors.sectionName && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is required</span>
                        )
                    }
                    
                </div>
                <div className="flex items-end gap-x-4">
                    <IconButton
                        type='submit'
                        text={editSectionName ? "Edit Section Name" : "Create Section"}
                        outline={true}
                    >
                        
                    <IoIosAddCircleOutline size={20} className="text-yellow-50" />
                    </IconButton>
                    {
                        editSectionName && (
                            <button
                                type='button'
                                onClick={cancelEdit}
                                className='text-sm text-richblack-300 underline'
                            >
                                Cancel edit
                            </button>
                        )
                    }
                </div>
            </form>

            {
                course.courseContent.length > 0 && (
                    <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
                )
            }

            <div className="flex justify-end gap-x-3">
                <button
                    onClick={goBack}
                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                > Back</button>
                <IconButton disabled={loading} text='Next' onClick={goNext}/>
            </div>
        </div>
    )
}

export default CourseBuilderForm;