import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import ReactStars from 'react-rating-stars-component';

const CourseReviewModal = ({setReviewModal}) => {

    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const {courseEntireData} = useSelector((state) => state.viewCourse);
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm();

    useEffect(( () => {
        setValue("courseExperience", "");
        setValue("courseRating", 0);
    }),[])

    const ratingChanged = (newRating) => {
        setValue("courseRating", newRating);
    }

    const onSubmit = async (data) => {
        // post ratings in database
        // close reviewModal 

        await createRating(
            {
                courseId: courseEntireData._id,
                rating: data.courseRating,
                review: data.courseExperience,
            },
            token
        );
        setReviewModal(false);
    }


    return (
        <div>
            <div>
                {/* Modal header */}
                <div>
                    <p>Add Review</p>
                    <button
                        onClick={() => setReviewModal(false)}
                    >
                        Close
                    </button>
                </div>

                {/* Modal Body */}
                <div>

                    <div>
                        <img 
                            src={user?.image}
                            alt='user Image'
                            className='aspect-square w-[50px] rounded-full object-cover'
                        />
                        <div>
                            <p>{user?.firstName} {user?.lastName}</p>
                            <p>Posting Publicly</p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='mt-6 flex flex-col items-center'
                    >
                        <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            activeColor="#ffd700"
                        />

                        <div>
                            <label htmlfor='courseExperience'>
                                Add Your Experience
                            </label>
                            <textarea
                                id='courseExperience'
                                placeholder='Add Your Experience here'
                                {...register("courseExperience", {required: true})}
                                className='form-style min-h-[130px] w-full'
                            />
                            {
                                errors.courseExperience && (
                                    <span>
                                        Please add your experience
                                    </span>
                                )
                            }
                        </div>

                        {/* Cancel and save button */}

                        <div>
                            <button
                                onClick={() => setReviewModal(false)}
                            >
                                Cancel
                            </button>

                            <IconBtn 
                                text="save"
                            />
                        </div>
                    </form>
                </div>    
            </div>
        </div>
    )
}

export default CourseReviewModal;