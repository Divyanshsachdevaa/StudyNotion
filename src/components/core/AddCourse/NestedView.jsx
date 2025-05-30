import React from 'react';
import { RxDropdownMenu } from "react-icons/rx";
import { useSelector, useDispatch } from 'react-redux';
import {useState} from 'react';
import { MdEdit, MdDelete } from "react-icons/md";
import { BiSolidDownArrow } from "react-icons/bi";
import { AiFillPlusCircle } from "react-icons/ai";
import SubSectionModal from "./SubSectionModal"
import { deleteSection, deleteSubSection } from '../../../services/operations/courseAPI.js';
import {setCourse} from '../../../slices/CourseSlice.js'
import ConfirmationModal from "../../common/ConfirmationModal.jsx";

const NestedView = ({handleChangeEditSectionName}) => {

    const {course} = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const [addSubSection, setAddSubSection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);
    const {token} = useSelector((state) => state.auth);

    const [confirmationModal, setConfirmationModal] = useState(null);
    
    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection({sectionId, courseId: course._id, token});
        
        if(result) {
            dispatch(setCourse(result));
        }
        setConfirmationModal(null);
    }

    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        const result = await deleteSubSection({subSectionId, sectionId, token});
        // here in result i am getting updated section from backend so I should make a new course then update this course state

        if(result){
            const updatedCourseContent = course.courseContent.map((section) => section._id === sectionId ? result : section);
            const updatedCourse = {...course, courseContent: updatedCourseContent};
            dispatch(setCourse(updatedCourse));
        }
        setConfirmationModal(null);
    }
    

    return (
        <div>
            <div className="rounded-lg bg-richblack-700 p-6 px-8">
                {
                    course?.courseContent?.map( (section) => (
                        <details key={section._id} open>
                            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                                <div classname='flex items-center gap-x-3'>
                                    <RxDropdownMenu className="text-2xl text-richblack-50"/>
                                    <p className="font-semibold text-richblack-50">{section.sectionName}</p>
                                </div>

                                <div className='flex items-center gap-x-3'>
                                    <button onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}>
                                        <MdEdit className="text-xl text-richblack-300"/>
                                    </button>

                                    <button onClick={() => {
                                        setConfirmationModal({
                                            text1: "Delete this Section",
                                            text2: "All the lectures in this section will be deleted",
                                            btn1Text: "Delete",
                                            btn2Text: "Cancel",
                                            btn1Handler: () => handleDeleteSection(section._id),
                                            btn2Handler: () => setConfirmationModal(null),
                                        });
                                    }}>
                                        <MdDelete className="text-xl text-richblack-300" />
                                    </button>

                                    <button>
                                        <span className="font-medium text-richblack-300"></span>
                                        <BiSolidDownArrow className={`text-xl text-richblack-300`} />
                                    </button>
                                </div>
                            </summary>

                            <div className="px-6 pb-4">
                                {
                                    section.subSection.map((data) => (
                                        <div 
                                        key={data?._id} 
                                        onClick={() => setViewSubSection(data)}
                                        className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                                        >
                                            <div className="flex items-center gap-x-3 py-2">
                                                <RxDropdownMenu className="text-2xl text-richblack-50"/>
                                                <p className="font-semibold text-richblack-50">{data.title}</p>
                                            </div>

                                            <div 
                                            onClick={(e) => e.stopPropagation()}
                                            className='flex items-center gap-x-3' >
                                                <button onClick={() => setEditSubSection({...data, sectionId: section._id})}>
                                                    <MdEdit className="text-xl text-richblack-300"/>
                                                </button> 

                                                <button onClick={() => {
                                                    setConfirmationModal({
                                                        text1: "Delete this Sub Section",
                                                        text2: "selected Lecture will be deleted",
                                                        btn1Text: "Delete",
                                                        btn2Text: "Cancel",
                                                        btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                                        btn2Handler: () => setConfirmationModal(null),
                                                    })
                                                }}>
                                                    <MdDelete className="text-xl text-richblack-300"/>
                                                </button>

                                            </div>   


                                        </div>
                                    ))
                                }
                            </div>
                            
                            <button 
                                onClick={() => setAddSubSection(section._id)}
                                className='mt-3 flex items-center gap-x-2 text-yellow-50'
                            >
                                <AiFillPlusCircle className='text-lg' />
                                <p>Add Lecture</p>
                            </button>

                        </details>
                    ))
                }
            </div>

            {
                // modalData contains section id
                addSubSection ?
                (<SubSectionModal
                    modalData={addSubSection} 
                    setModalData={setAddSubSection}
                    add={true}
                />) 
                : editSubSection ?
                (<SubSectionModal
                    modalData={editSubSection}
                    setModalData={setEditSubSection}
                    edit={true}
                />) 
                : viewSubSection ? 
                (<SubSectionModal
                    modalData={viewSubSection}
                    setModalData={setViewSubSection}
                    view={true}
                />) 
                : (<div></div>)

            }

            {
                confirmationModal ? (<ConfirmationModal modalData={confirmationModal}/>) : (<div></div>)
            }
        </div>
    )
}

export default NestedView;