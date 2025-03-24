import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus, setActiveStatus] = useState("");
    const [videobarActive, setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const {sectionId, subSectionId} = useParams();
    const location = useLocation();

    const {
        courseSectionData, 
        courseEntireData, 
        totalNoOfLectures,
        completedLectures
    } = useSelector((state) => state.viewCourse);

    useEffect(() => {
        ;(() => {
            if(!courseSectionData.length)
                return ;

            const currentSectionIndex = courseSectionData.findIndex(
                (data) => data._id === sectionId
            )

            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                (data) => data._id === subSectionId
            )

            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;
            
            // set Current section here
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);

            // set current sub-Section here
            setVideoBarActive(activeSubSectionId);

        })()
    }, [courseSectionData, courseEntireData, location.pathname])

    const handleSubSectionClick = (sectionId, subSectionId) => {
        navigate(`/view-course/${courseEntireData?._id}/section/${sectionId}/sub-section/${subSectionId}`);
        setVideoBarActive(subSectionId);
    }

    return (
        <>
            <div className='text-white'>
                {/* for buttons and headings */}
                <div>
                    {/* for buttons */}
                    <div
                        onClick={navigate("/dashboard/enrolled-courses")}
                    >
                        {/* ADD BACK ICON HERE */}
                        Back
                    </div>

                    <div

                    >
                        <IconBtn
                            text={"Add Review"}
                            onclick={() => setReviewModal(true)}
                        />
                    </div>
                    
                    {/* for headings or title */}
                    <div>
                        <p>{courseEntireData?.courseName}</p>
                        <p>{completedLectures?.length} / {totalNoOfLectures}</p>
                    </div>
                </div>

                {/* for sections and subSections */}
                <div>
                    {
                        courseSectionData?.map((section, index) => (
                            <div
                                onClick={() => setActiveStatus(section?._id)}
                                key={index}
                            >

                                {/* sections */}
                                <div>
                                    <div>
                                        {course?.sectionName}
                                    </div>
                                    {/* HW - add arrow icon here and handle rotate logic */}
                                </div>

                                {/* subSections */}
                                <div>
                                    {
                                        activeStatus === section?._id && (
                                            <div>
                                                {
                                                    course.subSection.map((subSection, index) => (
                                                        <div 
                                                            key={index}
                                                            className={`flex gap-5 p-5 
                                                                ${videobarActive === topic._id ? "bg-yellow-200 text-richblack-900" : "bg-richblack-900 text-white" 
                                                            }`}
                                                            onClick={() => handleSubSectionClick(section?._id, subSection?._id)}
                                                        >
                                                            <div>
                                                                <input 
                                                                    type='checkbox'
                                                                    checked = {completedLectures.includes(topic?.id)}
                                                                    onChange={() => {}}
                                                                />
                                                                <span>{subSection?.name}</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default VideoDetailsSidebar;