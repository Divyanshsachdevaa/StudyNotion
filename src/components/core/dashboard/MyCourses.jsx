import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '../../common/IconButton';
import { fetchInstructorCourses } from '../../../services/operations/courseAPI';
import CoursesTable from './InstructorCourses/CoursesTable';
import { VscAdd } from "react-icons/vsc"

const MyCourses = () => {
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async() => {
            const result = await fetchInstructorCourses(token);
            if(result){
                setCourses(result);
            }
        }
        fetchCourses();
    }, [])

    return (
        <div>
            <div className="mb-14 flex items-center justify-between">
                <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
                <IconButton 
                    text="Add Course"
                    onClick={() => navigate('/dashboard/add-course')}
                    // TODO ADD ICON BUTTON
                >
                    <VscAdd />
                </IconButton>    
            </div>

            {courses && <CoursesTable courses={courses} setCourses={setCourses} />}

        </div>
    )
}

export default MyCourses;