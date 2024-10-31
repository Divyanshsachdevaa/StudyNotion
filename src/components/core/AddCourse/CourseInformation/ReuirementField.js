import React from 'react';
import { useSelector , useDispatch} from 'react-redux';
import {fetchCourseCategories} from "../../../../services/operations/courseAPI.js";
import { useForm } from 'react-hook-form';
import {useState, useEffect} from 'react'

const RequirementField = ({name, label, register, errors, setValue, getValues}) => {
    
    const [requirement, setRequirement] = useState("")
    const [requirementList, setRequirementList] = useState([]);

    useEffect(() => {
        register(name, {
            required: true,
            validate: (value) => value.length > 0
        })
    }, [register, name])

    useEffect(() => {
        setValue(name, requirementList);
    }, [name, requirementList])

    const handleAddRequirement = () => {
        if(requirement){
            setRequirementList([...requirementList, requirement]);
            setRequirement("");
        }
    }

    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index, 1);
        setRequirementList(updatedRequirementList);
    }

    return (
        <div>
            <label htmlFor={name} >{label}<sup>*</sup></label>
            <div>
                <input 
                    type='text'
                    id={name}
                    value={requirement}
                    onChange={(e) =>
                        setRequirement(e.target.value)}
                    className='w-full text-black'
                />
                <button 
                    type="button"
                    onClick={handleAddRequirement}
                    className='font-semibold text-yellow-50'
                 >Add</button>
            </div>
            {
                requirementList.length > 0 && (
                    <ul>
                        {
                            requirementList.map((requirement, index) => 
                                <li key={index} className='flex flex-center text-richblack-5'>
                                    <span className='mr-[10px]'>{requirement}</span>

                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveRequirement(index)}
                                        className="text-xs text-pure-greys-300"
                                    >
                                        clear
                                    </button>
                                </li>
                            )
                        }
                    </ul>
                )
            }
            {errors[name] && (
                <span>{label} is required**</span>
            )}
        </div>
    )
}

export default RequirementField;