import React from 'react';
import {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useForm} from 'react-hook-form';
import {useEffect} from 'react';
import IconButton from '../../../common/IconButton';
import {resetCourseState, setSteps} from '../../../../slices/CourseSlice'
import {editCourseDetails} from '../../../../services/operations/courseAPI';
import { COURSE_STATUS } from "../../../../utils/constants";

export default function PublishCourse() {
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, setValue, getValues} = useForm();
    const dispatch = useDispatch();
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);

    const goBack = () => {
        dispatch(setSteps(2));
    }

    useEffect( () => {
        if(course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public", true);
        }
    }, [course, setValue])

    const goToCourses = () => {
        dispatch(resetCourseState());
        // navigate to dashboard - my Courses 
    }

    const handleCoursePublish = async () => {
        // check if form has been updated or not

        // This function is not clear to me
        if (
          (course?.status === COURSE_STATUS.PUBLISHED &&
            getValues("public") === true) ||
          (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
        ) {
          // form has not been updated
          // no need to make api call
          goToCourses()
          return
        }
        const formData = new FormData()
        formData.append("courseId", course._id)
        const courseStatus = getValues("public")
          ? COURSE_STATUS.PUBLISHED
          : COURSE_STATUS.DRAFT
        formData.append("status", courseStatus)
        setLoading(true);

        console.log("AFTER FILLING OF FORMDATA");

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const result = await editCourseDetails(formData, token)
        if (result) {
          goToCourses()
        }
        setLoading(false)
    }

    const onSubmit = () => {
        setLoading(true);
        handleCoursePublish();
    }


    return (
        <div className="rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-800">
            <p className="text-2xl font-semibold text-richblack-5">Publish Course</p>
            <form onSubmit = {handleSubmit(onSubmit)} >
                <div className="my-6 mb-8">
                    <label htmlFor="public" className="inline-flex items-center text-lg">
                        <input
                            type="checkbox"
                            id="public"
                            {...register("public")}
                            className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                        />
                        <span className="ml-2 text-richblack-400">
                            Make this course as Public</span>
                    </label>
                </div>

                <div className="ml-auto flex max-w-max items-center gap-x-4">
                    <button 
                        disabled={loading}
                        type='button'
                        onClick={goBack}
                        className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                    >
                        back
                    </button>
                    <IconButton 
                        disabled={loading}
                        text="save changes"
                    />

                </div>
            </form>
        </div>
    )
} 
