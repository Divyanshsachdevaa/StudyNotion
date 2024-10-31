import React from 'react';
import {getPasswordResetToken} from "../services/operations/authAPI.js";
import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import { Link, useLocation } from "react-router-dom";

const ResetPassword = () => {
    const {loading} = useSelector((state) => state.auth);
    const {emailSent, setEmailSent} = useState(false);
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    }
    const handleOnEmailEvent=(e)=>{
        setEmail(e.target.value);
    }

    return (
        <div className='text-white flex justiy-center items-center'>
            {
                loading ? (
                    <div> loading... </div>
                ):
                (
                    <div>
                        <h1>
                            {
                                !emailSent ? "ResetPassword" : "Check Your Email"
                            }
                        </h1>

                        <p>
                            {
                                !emailSent ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" :
                                `We have sent the reset email to ${email}`
                            }
                        </p>

                        <form onSubmit={handleOnSubmit}>
                            {
                                !emailSent && (
                                    <label>
                                        <p>Email Address*</p>
                                        <input
                                            required
                                            type='email'
                                            name='email'
                                            value={email}
                                            onChange={handleOnEmailEvent}
                                            placeholder='Enter your Email Address'
                                            />
                                    </label>
                                )
                            }
                            <button type='submit'>
                                {
                                    !emailSent ? "Reset Password" : "Resend Email"
                                }
                            </button>
                        </form >
                        
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

export default ResetPassword;