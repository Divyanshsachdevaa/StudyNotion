import React from 'react';
import { RiStarSFill } from "react-icons/ri";
import { RiStarSLine } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import {useSelector, useDispatch} from "react-redux";
import ReactStars from 'react-stars'
import { removeFromCart } from '../../../../slices/CartSlice';
const RenderCartCourses = () => {
    
    const {cart} = useSelector( (state) => state.auth);
    const dispatch = useDispatch();

    
    return (
        <div>
            {
                cart.map( (course, index) => {
                    <div>
                        <div>
                            <img src={course?.thumbnail} />
                            <div>
                                <p>{course?.courseName}</p>
                                <p>{course?.category?.name}</p>
                                <div>
                                    {/* Connect This function with get avg rating in backend api */}
                                    <span>4.8</span>
                                    <ReactStars 
                                        count={5}
                                        size={20}
                                        edit={false}
                                        activeColor="#ffd700"
                                        emptyIcon={< RiStarSLine />}
                                        fullIcon={<RiStarSFill />}
                                    />
                                    <span>{course?.ratingAndReviews?.length} Ratings </span>
                                </div>   
                            </div>    
                        </div> 
                        <div>
                            <button onClick={() => dispatch(removeFromCart(course._id))}>
                                <MdDeleteForever />
                                <span>Remove</span>
                            </button>    

                            <p>Rs {course?.price}</p>
                        </div>      
                    </div>
                })
            }
        </div>
    )
}

export default RenderCartCourses;