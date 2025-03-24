import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FreeMode, Pagination, Autoplay, Navigation } from 'swiper/modules';
import ReactStars from 'react-rating-stars-component';
import {ratingEndPoints} from '../../services/apis';

const ReviewSlider = () => {

    const [reviews, setReviews] = useState([]);
    const truncateWords = 15;

    useEffect(() => {
        const fetchAllReviews = async () => {
            const {data} = await apiConnector("GET", ratingEndPoints.REVIEWS_DETAILS_API);

            if(data?.success){
                setReviews(data?.data);
            }
            console.log("Reviews = ", reviews);
        }
        fetchAllReviews();
    }, []);

    return (
        <div className='text-white'>
            <div className='h-[190px] max-w-content'>
                <Swiper
                    slidesPerView={4}
                    spaceBetween={24}
                    loop={true}
                    freeMode={true}
                    autoplay={{delay: 2500}}
                    modules={[FreeMode, Pagination, Autoplay]}
                    className='w-full'
                >
                    {
                        reviews.map((review, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src= {review?.user?.image ? review?.user?.image : `http://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                                    alt='Profile pic'
                                    className='h-9 w-9 object-cover rounded-full'
                                />
                                <p>{review?.user?.firstName} {review?.user?.lastName}</p>
                                <p>{review?.course?.courseName }</p>
                                <p>{review?.review}</p>
                                <p>{review?.rating?.toFixed(1)}</p>
                                <ReactStars
                                    count={5}
                                    value={review.rating}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<FaStar/>}
                                    fullIcon={<FaStar/>}
                                />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default ReviewSlider;