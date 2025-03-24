import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Player } from 'video-react';
import '~video-react/dist/video-react.css'; // import css
import { FaPlayCircle } from "react-icons/fa";

const VideoDetails = () => {

    const {courseId, sectionId, subSectionId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const playerRef = useRef();
    const {token} = useSelector((state) => state.auth);
    const {courseSectionData, courseEntireData, completedLectures} = useSelector((state) => state.viewCourse);

    const [videoData, setVideoData] = useState([]);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect((() => {

        const setVideoSpecificDetails = async () => {
            if(!courseSectionData.length){
                return ;
            }

            if(!courseId && !sectionId && !subSectionId){
                navigate("/dashboard/enrolled-courses");
            }
            else{
                // let's assume all 3 fields are present
                const filteredData = courseSectionData.filter((section) => section._id === sectionId)

                const filteredVideoData = filteredData?.[0].subSection?.filter((subSection) => subSection._id === subSectionId);

                setVideoData(filteredVideoData[0]);
                setVideoEnded(false);
            }
        }

        setVideoSpecificDetails();
    }), [courseSectionData, courseEntireData, location.pathname]);

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex( (section) => section.Id === sectionId);
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((subSection) => subSection._id === subSectionId);
        
        if(currentSectionIndex === 0 && currentSubSectionIndex === 0){
            return true;
        }
        else{
            return false;
        }
    }

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex( (section) => section.Id === sectionId);
        const n = courseSectionData.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((subSection) => subSection._id === subSectionId);
        const m = courseSectionData[currentSectionIndex].subSection.length;
        
        if(currentSectionIndex === n-1 && currentSubSectionIndex === m-1){
            return true;
        }
        else{
            return false;
        }
    }
    
    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex( (section) => section.Id === sectionId);
        const n = courseSectionData.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((subSection) => subSection._id === subSectionId);
        const m = courseSectionData[currentSectionIndex].subSection.length;

        // there are two cases possible
        // 1. My current video is last video of current subSection
        // 2. its not last

        if(currentSubSectionIndex !== m-1){
            // if its not last video of current subSection then go to next video of current subSection
            const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSectionIndex + 1]._id;
            navigate(`/view-course/section/${sectionId}/sub-section/${nextSubSectionId}`);

        }
        else{
            // if its last video of current subSection then go to first subSection of nextSection
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
            navigate(`/view-course/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
        }
    }

    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex( (section) => section.Id === sectionId);
        const n = courseSectionData.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((subSection) => subSection._id === subSectionId);
        const m = courseSectionData[currentSectionIndex].subSection.length;

        // there are two cases possible
        // 1. My current video is first video of current subSection
        // 2. its not first

        if(currentSubSectionIndex !== 0){
            // if its not first video of current subSection then go to previous video of current subSection
            const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSectionIndex - 1]._id;
            navigate(`/view-course/section/${sectionId}/sub-section/${prevSubSectionId}`);
        }
        else{
            const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
            const x = courseSectionData[currentSectionIndex-1].subSection.length;

            const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[x-1]._id;
            navigate(`/view-course/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
        }
    }

    const handleLectureCompletion = async () => {
        setLoading(true);

        // controller likhna hai iska
        const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);
        if(res){
            dispatch(updateCompletedLectures[subSectionId]);
        }
        setLoading(false);
    }

    return (
        <div>
            {
                !videoData ? (<div> No Data Found </div>) : (
                    <Player
                        ref={playerRef}
                        aspectRatio='16:9'
                        playsInline
                        onEnded = {() => setVideoEnded(true)}
                        src={videoData?.videoUrl}
                    >

                        <FaPlayCircle />

                        {
                            videoEnded && (
                                <div>
                                    {
                                        !completedLectures.includes(subSectionId) && (
                                            <IconBtn 
                                                disables={loading}
                                                onClick={() => handleLectureCompletion()}
                                                text={!loading ? "Mark As Completed" : "Loading..."}
                                            />
                                        )
                                    }

                                    <IconBtn
                                        disabled={loading}
                                        onClick={() => {
                                            if(playerRef?.current){
                                                playerRef.current?.seek(0);
                                                setVideoEnded(false);
                                            }
                                        }}
                                        text="Re-Watch"
                                        customClasses="text-xl"
                                    />

                                    <div>
                                        {!isFirstVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={() => goToPrevVideo}
                                                className='blackButton'
                                            >
                                                Prev
                                            </button>
                                        )}

                                        {!isLastVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={() => goToNextVideo}
                                                className='blackButton'
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        }

                    </Player>
                )
            }

            <h1>{videoData?.name}</h1>
            <p>{videoData.description}</p>
        </div>
    )
}

export default VideoDetails;