import React from 'react';
import { useForm } from 'react-hook-form';
import { createSubSection } from '../../../services/operations/courseAPI';
import { setCourse } from '../../../slices/CourseSlice';
import { ImCross } from "react-icons/im";
import {useDispatch, useSelector} from 'react-redux';
import { toast } from "react-hot-toast"
import {useState, useEffect} from 'react';
import { updateSubSection } from '../../../services/operations/courseAPI';
import IconButton from '../../common/IconButton';
import Upload from './Upload';

const SubSectionModal = ({
    modalData,
    setModalData,
    view = false,
    edit = false,
    add = false,
}) => {

    const {register, handleSubmit,setValue, formState : {errors},
    getValues} = useForm();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);

    
    useEffect( () => {
        if(view || edit) {
            setValue("lectureTitle", modalData.lectureTitle);
            setValue("lectureDesc", modalData.lectureDescription);
            setValue("lectureVideo", modalData.lectureVideoUrl);
        }
    }, [])
    
    const handleEditSubSection = async () => {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if(currentValues.lectureTitle !== modalData.title){
            formData.append("title", currentValues.title);
        }

        if(currentValues.lectureDesc !== modalData.description){
            formData.append("description", currentValues.lectureDesc);
        }

        if(currentValues.lectureVideo !== modalData.videoUrl){
            formData.append("video", currentValues.lectureVideo);
        }

        setLoading(true);

        // API call 
        const result = await updateSubSection(formData, token);
        if(result){
            const updatedCourseContent = course.courseContent.map((section) => section._id === modalData.sectionId ? result : section);
            const updatedCourse = {...course, coursContent: updatedCourseContent};
            dispatch(setCourse(updatedCourse));
        }

        setModalData(null);
        setLoading(false);
    }

    const isFormUpdated = () => {
        const currentValues = getValues();

        if(currentValues.lectureTitle !== modalData.lectureTitle ||
            currentValues.lectureDesc !== modalData.lectureDesc ||
            currentValues.lectureVideo !== modalData.lectureVideo) 
        {
            return true;
        }
        else{
            return false;
        }
    }

    const onSubmit = async (data) => {
        if(view){
            return ;
        }
        if(edit){
            if(!isFormUpdated()) {
                toast.error("No changes made to the form");
            }
            else{
                // edit krdo
                handleEditSubSection();
            }
            return ;
        }

        console.log("HELLO I AM INSIDE ONSUBMIT")

        const formData = new FormData();
        console.log("section id -> " + modalData + ", title -> " + data.lectureTitle + ", description -> " + data.lectureDesc);
        
        formData.append("sectionId", modalData); // Correct section ID
        formData.append("lectureTitle", data.lectureTitle);
        formData.append("lectureDesc", data.lectureDesc);
        formData.append("lectureVideo", data.lectureVideo);

        console.log("AFTER FILLING OF FORMDATA");

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        setLoading(true);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        const result = await createSubSection(formDataObject, token); 
        console.log("THIS IS RESULT -> "+ result );
        
        // result is updated section
        if(result){
            // TODO : check for updation
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id === modalData ? result : section
            )
            const updatedCourse = {...course, courseContent: updatedCourseContent};
            
            dispatch(setCourse(updatedCourse))
            
        }

        toast.success("SubSection created successfully");
        setModalData(null);
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
                <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                    <p className="text-xl font-semibold text-richblack-5">{view && "Viewing" } {add && "Adding" } {edit && "Editing" } Lecture</p>
                    <button onClick={() => (!loading ? setModalData(null): {})}>
                        <ImCross className="text-2xl text-richblack-5"/>
                    </button>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
                        <Upload
                            name="lectureVideo"
                            label = "Lecture Video"
                            register={register}
                            setValue={setValue}
                            errors={errors}
                            video={true}
                            viewData = {view ? modalData.videoUrl: null}
                            editData = {edit ? modalData.videoUrl: null}
                        />
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">Lecture Title</label>
                            <input
                                id='lectureTitle'
                                placeholder="Enter Lecture Title"
                                {...register("lectureTitle", {required: true})}
                                className="w-full form-style bg-richblack-500 text-white rounded-md"
                            />
                            {
                                errors.lectureTitle && (
                                    <span className="ml-2 text-xs tracking-wide text-pink-200">Lecture Title is required</span>
                                )
                            }
                        </div>

                        {/* Lecture Description */}
                        
                        <div className="flex flex-col space-y-2">
                            <label  className="text-sm text-richblack-5" htmlFor="lectureDesc"> Lecture Description</label>  
                            <textarea
                                id="lectureDesc"
                                placeholder="Enter Lecture Description"
                                {...register("lectureDesc", {required: true})}
                                className="form-style resize-x-none min-h-[130px] w-full bg-richblack-500 text-white rounded-md"
                            />

                            {
                                errors.lectureDesc && (
                                    <span className="ml-2 text-xs tracking-wide text-pink-200">Lecture Description is required</span>
                                )
                            }
                            
                        </div>

                        {
                            !view && (
                                <div className="flex justify-end">
                                    <IconButton
                                        text={loading ? "Loading..." : edit ? "Save Changes": "Save"}
                                    />
                                </div>
                            )
                        }

                    </form>
                </div>
            </div>
        </div>
    )
}

export default SubSectionModal;