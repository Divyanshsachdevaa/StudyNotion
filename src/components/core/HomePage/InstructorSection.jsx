import React from 'react';
import instructor from "../../../assets/Images/Instructor.png";
import HighlightText from "./HighlightText.jsx";
import CTAButton from "./CTAButton.jsx";
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = () => {
    return (
        <div>
            <div className="flex flex-row gap-20 items-center pl-24 pb-12">
                <div className='w-[50%]'>
                    <img src={instructor} alt="" className='shadow-custom' />
                </div>

                <div className='w-[50%] flex flex-col gap-10'>
                    <div className="text-4xl font-semibold">
                        <div className="text-white">Become an </div>
                        <HighlightText text={"Instructor"} />
                    </div>

                    <p className="font-medium text-[16px] w-[80%] text-richblack-300">
                        Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love. Start Teaching Today
                    </p>

                    <div className="w-fit">
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className="flex flex-row gap-2 items-center">
                                Start Teaching Today 
                                <FaArrowRight />
                            </div>
                        </CTAButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorSection;