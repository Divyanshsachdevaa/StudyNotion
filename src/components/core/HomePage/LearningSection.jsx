import React from 'react';
import HighlightText from './HighlightText';
import Know_your_progress from '../../../assets/Images/Know_your_progress.png'
import Compare_with_others from '../../../assets/Images/Compare_with_others.png'
import Plan_your_lessons from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from './CTAButton';

const LearningSection = () => {
    return (
        <div className='mt-[150px] mb-32 '>
            <div className='flex flex-col gap-5 items-center'>
                <div className='text-4xl font-semibold text-center'>
                    Your Swiss Knife For
                    <HighlightText text={"learning any language"}/>
                </div>

                <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>
                    Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
                </div>

                <div className='flex flex-row items-center justify-center mt-5'>
                    <img
                        src={Know_your_progress}
                        alt = "KnowYourProgressImage"
                        className = "object-contain -mr-32"
                    />
                    <img
                        src={Compare_with_others}
                        alt = "CompareWithOthersImage"
                        className = "object-contain"
                    />
                    <img
                        src={Plan_your_lessons}
                        alt = "PlanYourLessonsImage"
                        className = "object-contain -ml-36"
                    />
                </div>

                <div className='w-fit mb-28'>
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn more
                    </CTAButton>
                </div>
            </div>
        </div>
    )
}

export default LearningSection;