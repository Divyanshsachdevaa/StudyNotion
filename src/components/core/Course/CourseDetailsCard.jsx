import React from 'react'
import { Navigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import {toast} from 'react-hot-toast';
import {ACCOUNT_TYPE} from '../../../utils/constants';
import { addToCart } from '../../../slices/CartSlice';
import { useSelector, useDispatch } from 'react-redux';

function CourseDetailsCard({course, setConfirmationModal, handleBuyCourse}){

    const {
        thumbnail: ThumbnailImage,
        prices: CurrentPrice,

    } = course;

    const user = useSelector((state) => state.profile);
    const token = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error('You are an instructor, you can not buy a course');
            return;
        }
        if(token){
            dispatch(addToCart(course));
            return ;
        }
        setConfirmationModal({
            text1: "You are not logged in",
            text2: "Please login to add to cart",
            btn1text: "login",
            btn2text: "cancel",
            btn1Handler: () => Navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        })
    }

    const handleShare = () => {
        copy(window.location.href);
        toast.success("Link Copied To Clipboard");
    }

    return (
        <div>
            <img 
                src={ThumbnailImage}
                alt='Thumbnail Image'
                className='max-h-[300px] min-h-[180px] w-[480px] rounded-xl'
            />

            <div>
                Rs. {CurrentPrice}
            </div>

            <div className='flex flex-col gap-y-6' >
                <button
                    className='bg-yellow-50'
                    onClick={user && course?.StudentsEnrolled.includes(user?._id) ? 
                        () => Navigate("/dashboard/enrolled-courses") 
                        : 
                        handleBuyCourse
                    }
                >
                    {/* if user has already bought this course then show "Go To Course" button 
                    if not then show "buy Now" button */}
                    
                    {
                        user && course?.StudentsEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now"
                    }
                </button>

                {
                    (!course?.StudentsEnrolled.includes(user?.id)) && (
                        <button 
                            onClick={handleAddToCart} 
                            className='bg-yellow-50 w-fit text-richblack-900' 
                        >
                            Add to Cart
                        </button>
                    )
                }
            </div>

            <div>
                <p>
                    30-Day money back guarantee
                </p>
                <p>
                    This Course Includes: 
                </p>
                <div className='flex flex-col gap-y-3'>
                    {
                        course?.instructions?.map((item, index) => {
                            <p key={index} className='flex gap-2' >
                                <span>{item}</span>
                            </p>
                        })
                    }
                </div>
            </div>

            <div>
                <button
                    className='mx-auto flex items-center gap-2 p-6 text-yellow-50'
                    onClick={handleShare}
                >
                    Share
                </button>
            </div>
        </div>
    )
}

export default CourseDetailsCard;