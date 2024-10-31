import React from 'react';
import { IoEye, IoEyeOff } from "react-icons/io5";
import {resetPassword} from '../services/operations/authAPI';
import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import { Link, useLocation } from "react-router-dom";

const UpdatePassword = () => {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })

    const {loading} = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const {password, confirmPassword} = formData;
    const dispatch = useDispatch();
    const location = useLocation();

    const handleOnChange = (e) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]: e.target.value
            }
        ));
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password, confirmPassword, token));
    }

    return (
        <div className="text-white">
            {
                loading ? (
                    <div>loading....</div>
                ) : (
                    <div>
                        <h1>Choose new Password</h1>
                        <p>Almost done. Enter your new password and youre all set.</p>
                        <form onSubmit={handleOnSubmit}>
                            <label>
                                <p>New Password*</p>
                                <input className='w-full p-6 bg-richblack-600 text-richblack-5'
                                required type={showPassword ? "text" : "password"} name="password" value={password} onChange={handleOnChange} placeholder='Password' />
                                <span onClick={ () => setShowPassword( (prev) => !prev )}>
                                    {
                                        showPassword ? <IoEye fontSize={24}/> : <IoEyeOff fontSize={24} />
                                    }
                                </span>
                            </label>

                            <label>    

                                <p>Confirm Password*</p>
                                <input className='w-full p-6 bg-richblack-600 text-richblack-5'
                                required type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={confirmPassword} onChange={handleOnChange} placeholder='Confirm Password'/>
                                <span onClick={ () => setConfirmPassword( (prev) => !prev )}>
                                    {
                                        showConfirmPassword ? <IoEye fontSize={24}/> : <IoEyeOff fontSize={24} />
                                    }
                                </span>
                            </label>

                            <button type='submit' >
                                Reset Password
                            </button>
                        </form>

                        <div>
                            <Link to='/login'>
                                <p>Back to Login</p>
                            </Link>
                        </div>
                    </div>
                )

            }
        </div>
    )
}

export default UpdatePassword;