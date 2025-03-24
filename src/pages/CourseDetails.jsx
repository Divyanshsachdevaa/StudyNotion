import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import {fetchCourseDetails} from '../services/operations/courseAPI.js';
import GetAvgRating  from '../utils/AvgRating';
import Error from './Error.jsx';
import ConfirmationModal from "../components/common/ConfirmationModal.jsx"
import RatingStars from "../components/common/RatingStars.jsx"
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard.jsx';
import {formatDate} from '../services/formatDate.jsx'

const CourseDetails = () => {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const {loading} = useSelector( (state) => state.profile);
    const {paymentLoading} = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {courseId} = useParams();
    const [courseData, setCourseData] = useState(null);
    const [avgRatingCount, setAvgRatingCount] = useState(0);
    const [lectureCount, setLectureCount] = useState(0);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const [active, setActive] = useState(Array(0));

    const handleActive = (id) => {
        setActive(!active.includes(id) ? active.concat(id) : active.filter((e) => e != id));
    }

    useEffect(() => {
        const getCourseFullDetails = async() => {
            try{
                const result = await fetchCourseDetails(courseId, token);
                setCourseData(result);
            }
            catch(err){
                console.log("Error in fetching course data = ", err);
            }
        }
        getCourseFullDetails();
    }, [courseId]);

    useEffect(() => {
        const count = GetAvgRating(courseData?.data?.courseDetails.ratingAndReviews);
        setAvgRatingCount(count);
    }, [courseData]);

    useEffect(() => {
        let lectures = 0;
        courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0;
        })
        setLectureCount(lectures);
    }, [courseData]);

    // Needs to be Updated
    const handleBuyCourse = () => {
        if(token){
            buyCourse(token, [courseId], user, navigate, dispatch);
            return ;
        }
        // If User does not has token means he is not logged in but still trying to buy the course
        setConfirmationModal({
            text1: "You are not logged in",
            text2: "Please loggin to purchase the course",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        })
    }

    if(loading || !courseData){
        return (<div>Loading...</div>);
    }

    if(!courseData.success){
        return (
            <div>
               <Error />
            </div>
        )
    }

    const {
        _id: course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        StudentsEnrolled,
        createdAt,
    } = courseData.data?.courseDetails


    return (
        <div className="flex flex-col text-white" >
            
            <div className="relative flex flex-col justify-start p-8 ">
                <p>{courseName}</p>
                <p>{courseDescription}</p>
                <div className="flex gap-x-2">
                    <span>{avgRatingCount}</span>
                    <RatingStars Review_Count={avgRatingCount} Star_Size={24} />
                    <span>{`${ratingAndReviews.length} reviews`}</span>
                    <span>{`${StudentsEnrolled.length} students enrolled`}</span>
                </div>

                <div>
                    <p>Created By {`${instructor.firstName}`}</p>
                </div>

                <div className="flex gap-x-3">
                    <p>
                        Created At {formatDate(createdAt)}
                    </p>
                    <p> {" "} English </p>
                </div>

                <div>
                    <CourseDetailsCard 
                        course = {courseData?.data?.courseDetails} 
                        setConfirmationModal = {setConfirmationModal}
                        handleBuyCourse={handleBuyCourse}  
                    />
                </div>
            </div>

            <div>
                <p>What You Will Learn</p>
                <div>
                    {whatYouWillLearn}
                </div>
            </div>

            <div>
                <div>
                    <p>Course Content:</p>
                </div>

                <div className='flex gap-x-3 justify-between'>
                    <div>
                        <span>
                            {courseContent.length} section(s)
                        </span>
                        <span>
                            {lectureCount} lecture(s)
                        </span>
                        <span>{courseData.data?.totalDuration} total length</span>
                    </div>   

                    <div>
                        <button 
                            onClick={() => setActive([])}
                        >
                            Collapse all Sections
                        </button>
                    </div> 
                </div>
            </div>

            {confirmationModal && <ConfirmationModal modalData={confirmationModal} /> }
        </div>
    )
}

export default CourseDetails;