import React from 'react';
import Footer from '../components/common/Footer';
import {useParams} from 'react-router-dom'
import {apiConnector} from '../services/apiConnector'
import {categories} from '../services/apis';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import Course_Card from '../components/core/Catalog/Course_Card';
import { useState, useEffect } from 'react';
import {getCatalogPageData} from '../services/operations/pageAndComponentData';
import { useSelector } from 'react-redux';

const Catalog = () => {

    const {catalogName} = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const { token } = useSelector((state) => state.auth);

    // fetch all categories 
    useEffect(() => {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API, {}, { Authorization: `Bearer ${token}`}); // returns an array of categories
            
            // category_id is current selected category
            console.log("Catalog name = " + catalogName);
            console.log("Category = " + res.data.allCategories);

            const category_id = res?.data?.allCategories?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);
        }
        getCategories();

    }, [catalogName])

    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogPageData(categoryId, token);
                setCatalogPageData(res);
            } catch(err){
                console.log(err);
            }
        }
        
        if(categoryId){
            getCategoryDetails();
        }

    }, [categoryId])

    return (
        <div className="text-white">
            <div>
                <p>{`Home / Catalog /`}
                    <span>
                        {catalogPageData?.data?.selectedCategory?.name} 
                    </span>
                </p>

                <p>{catalogPageData?.data?.selectedCategory?.name}</p>
                <p>{catalogPageData?.data?.selectedCategory?.description}</p>

            </div>

            <div>
                {/* Section 1 */}

                <div>
                    <div className="flex gap-x-3">
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>

                    <div>
                        <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
                    </div>    
                </div>

                {/* Section 2 */}
                <div>
                    <p>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</p>
                    <div>
                        <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
                    </div>
                </div>

                {/* Section 3 */}
                <div>
                    <p>Frequently Bought</p>
                    
                    <div className='py-8'>
                        <div className='grid grid-cols-1 lg:grid-cols-2'>
                            {
                                catalogPageData?.data?.mostSellingCourses?.slice(0, 4).map((course, index) => (
                                    <Course_Card course={course} key={index} Height={"h-[400px]"} />
                                ))
                            }
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default Catalog;