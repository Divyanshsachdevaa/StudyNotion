import React from 'react';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {getUserEnrolledCourses} from '../../../services/operations/ProfileAPI.js'

const EnrolledCourses = () => {

    const {token} = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async() => {
        try{
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response);
        } catch(err){
            console.log("Unable to Fetch Enrolled Courses");
        }
    }
    useEffect( () => {
        getEnrolledCourses();
    }, [])

    return (
        <div>
            <h1>Enrolled Courses</h1>
            {
                !enrolledCourses ? (
                    <div>Loading...</div>
                ) : !enrolledCourses.length ? (
                    <div> You have not Enrolled in any Courses Yet</div>
                ) : (
                    <div>
                        <div>
                            <p>Course Name</p>
                            <p>Duration</p>
                            <p>Progress</p>
                        </div>  

                        {/* Cards shuru hote h ab */}
                        {
                            enrolledCourses.map((course, index) => 
                                <div key={index}>
                                    <div>
                                        <img src={course.thumbnail} />
                                        <div>
                                            <p>{course.courseName}</p>
                                            <p>{course.courseDescription}</p>
                                        </div>
                                    </div>

                                    <div>
                                        {course?.totalDuration}
                                    </div>

                                    <div>
                                        <p>Progress: {course.progressPercentage || 0}%</p>
                                        {/* <ProgressBar 
                                            completed={course.progressPercentage || 0}
                                            height="8px"
                                            isLabelVisible={true}
                                        /> */}
                                    </div>    
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default EnrolledCourses;