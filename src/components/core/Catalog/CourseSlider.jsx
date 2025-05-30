import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FreeMode, Pagination, Autoplay, Navigation } from 'swiper/modules';
import Course_Card from './Course_Card';

const CourseSlider = ({ Courses }) => {
    return (
        <>
            {Courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    loop={true}
                    spaceBetween={200}
                    modules={[Autoplay, Navigation, Pagination]}
                    className="mySwiper"
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    breakpoints={{
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {Courses?.map((course, index) => (
                        <SwiperSlide key={index}>
                            <Course_Card course={course} Height={"h-[250px]"} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p>No Course Found</p>
            )}
        </>
    );
};

export default CourseSlider;
