import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OTPInput from 'react-otp-input';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { signUp, sendOtp } from "../services/operations/authAPI";

const VerifyEmail = () => {
    // Get signupData and loading from Redux store
    const { signupData, loading } = useSelector((state) => state.auth);
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Check if signupData exists
    useEffect(() => {
        if (!signupData) {
            navigate("/signup");
        }
    }, [signupData, navigate]);

    // Destructure only if signupData exists
    if (!signupData) {
        return null;  // Prevents destructuring error
    }

    const { accountType, firstName, lastName, email, password, confirmPassword } = signupData;

    // Handle form submission
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate));
    }

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className='text-richblack-5'>
                    <h1>Verify Email</h1>
                    <p>A verification code has been sent to you. Enter the code below:</p>
                    <form onSubmit={handleOnSubmit}>
                        <OTPInput  
                            renderSeparator={<span>-</span>} 
                            value={otp} 
                            onChange={setOtp} 
                            numInputs={6}
                            renderInput={(props) => (<input {...props} className='bg-richblack-800' />)} 
                        />
                        <button type='submit'>
                            Verify Email
                        </button>
                    </form>
                    <div>
                        <div>
                            <Link to='/login'>
                                <p>Back to Login</p>
                            </Link>
                        </div>

                        <div onClick={() => dispatch(sendOtp(signupData.email, navigate))}>
                            Resend it
                        </div>    
                    </div>    
                </div>
            )}
        </div>
    )
}

export default VerifyEmail;
