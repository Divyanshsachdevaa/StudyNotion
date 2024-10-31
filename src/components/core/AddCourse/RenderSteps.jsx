import React from 'react';
import { useSelector } from 'react-redux';
import { FaCheck } from "react-icons/fa";
import CourseInformationForm from "./CourseInformation/CourseInformationForm.jsx";

const RenderSteps = () => {

    const {step} = useSelector((state) => state.course);

    const steps = [
        {
            id: 1,
            title: "Course Information",
        },
        {
            id: 2,
            title: "Course Builder",
        },
        {
            id: 3,
            title: "Publish",
        }
    ];

    return (
        <>
            <div className="min-w-full"> 
                {steps.map( (item) =>
                    <div className="flex flex-col" key={item.id}>
                        <div className={`${step === item.id ? "bg-yellow-900 border-yellow-50 text-yellow-50" : "border-richblack-700 bg-richblack-800 text-richblack-300"}`}>
                            {
                                step > item.id ? (<FaCheck className="font-bold text-richblack-900"/>) : (item.id)
                            }
                        </div>
                        {/* Add dashes  */}
                    </div>
                )}
            </div>

           {/* step name */}
            <div>
                {
                    steps.map( (item) => 
                        <div key={item.id}>
                            <p>{item.title}</p>
                        </div>
                    )
                }
            </div>

            {/* FORM */}

            {step === 1 && <CourseInformationForm />}
            {/* {step === 2 && <CourseBuilderForm />}
            {step === 2 && <PublishCourse />} */}
        </>
    )
}

export default RenderSteps;