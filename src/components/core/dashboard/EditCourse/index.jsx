import React from 'react';
import RenderSteps from '../../AddCourse/RenderSteps';
import {useDispatch , useSelector} from 'react-redux';
import {useState, useEffect} from 'react'; 
import {useParams} from 'react-router-dom';
import {getFullDetailsOfCourse} from '../../../../services/operations/courseAPI';
import {setCourse, setEditCourse} from '../../../../slices/CourseSlice';

// render steps ki need hai
// data pre filled hai
// editCourse wale flag ko true mark krna h

export default function EditCourse(){
    const dispatch = useDispatch();
    const {courseId} = useParams();
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state) => state.auth);
    const {course} = useSelector((state) => state.course);

    // phle render m data aa jana chahiye screen par isliye i used useEffect
    useEffect(() => {
        const populateCourseDetails = async () => {
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId, token);
            if(result?.courseDetails){
                dispatch(setEditCourse(true));
                dispatch(setCourse(result?.courseDetails))
            }
            setLoading(false);
        }
        populateCourseDetails();
    },[])

    if(loading){
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className="text-white">
            <h1>Edit Course</h1>
            <div>
                {
                    course ? (<RenderSteps />) : (<p>Course not found</p>)
                }
            </div>

        </div>
    )
}
