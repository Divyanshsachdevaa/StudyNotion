import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/CTAButton";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningSection from "../components/core/HomePage/LearningSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/common/Footer.jsx";
import ExploreMore from "../components/core/HomePage/ExploreMore"
import ReviewSlider from '../components/common/ReviewSlider.jsx';

const Home = () => { 
    return (
        <div>
            {/* Section1 */}
            <div className="relative mx-auto flex flex-col max-w-maxContent w-11/12 items-center text-white justify-between">
                <Link to={"/signup"}>
                    <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

                <div className="text-center text-4xl font-semibold mt-7">
                    EMPOWER YOUR FUTURE WITH 
                    <HighlightText text={"CODING SKILLS"} />
                </div>

                <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
                </div>

                <div className="flex flex-row gap-7 mt-8">
                    <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                    <CTAButton active={false} linkto={"/login"}>Book a Demo</CTAButton>
                </div>

                <div className="shadow-blue-200 mx-3 my-12">
                    <video muted loop autoPlay>
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>

                {/* Code Section 1 */}
                <div>
                    <CodeBlocks 
                        position={"lg:flex-row"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock your 
                                <HighlightText text={"coding potential "} />
                                with our online course
                            </div>    
                        }
                        subHeading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you. Try it Yourself Learn More"}
                        ctabtn1={{
                            btnText: "try it yourself",
                            linkto: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "learn how",
                            linkto: "/login",
                            active: false,
                        }}
                        codeblock = {`<!DOCTYPE html> 
                                      <html> 
                                      head><title>Example</title><linkrel="stylesheet"href="styles.css"> 
                                      /head> 
                                      body>
                                      h1><ahref="/">Header</a>
                                      /h1>
                                      nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>
                                      /nav>`}
                        
                                    codecolor = {"text-blue-400"}
                    />
                </div>
                
                {/* Code Section 2 */}
                <div>
                    <CodeBlocks 
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock your 
                                <HighlightText text={"coding potential "} />
                                with our online course
                            </div>    
                        }
                        subHeading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you. Try it Yourself Learn More"}
                        ctabtn1={{
                            btnText: "try it yourself",
                            linkto: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "learn how",
                            linkto: "/login",
                            active: false,
                        }}
                        codeblock = {`<!DOCTYPE html> 
                                    <html> 
                                    head><title>Example</title><linkrel="stylesheet"href="styles.css"> 
                                    /head> 
                                    body>
                                    h1><ahref="/">Header</a>
                                    /h1>
                                    nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>
                                    /nav>`}
                        
                        codecolor = {"text-yellow-400   "}
                    />
                </div>
            </div>

            <div>
                <ExploreMore />
            </div>
            
            {/* Section2 */}
            <div className="bg-pure-greys-5 text-richblack-700">
                <div className="homepage_bg h-[333px] ">
                    <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto justify-between">
                        <div className="h-[150px]"> </div>
                        <div className="flex flex-row gap-7 text-white">
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className="flex items-center gap-3">
                                    Explore Full Catalog
                                    <FaArrowRight/>
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkto={"/signup"}>
                                <div>Learn More</div> 
                                {/* here we have passed children a props to components that's why it is showing this div as content to button */}
                            </CTAButton>
                        </div> 
                    </div>
                </div> 

                <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
                    <div className="flex flex-row gap-5 mt-[95px]">
                        <div className="text-4xl font-semibold w-[45%]">
                            Get the Skills for a 
                            <HighlightText text={"Job that is in demand"}/>
                        </div>
                        <div className='flex flex-col gap-10 w-[40%] items-start'>
                            <div className='text-[16px]'>
                                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton active={true} linkto={"/signup"}>
                                <div>Learn More</div>
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <TimelineSection className="w-11/12"/>
                <LearningSection />
            </div>
            {/* Section3 */}
            <div>
                <InstructorSection />
                <div>
                    <h2>Reviews from other Learners</h2>
                </div>
            </div>

            {/* Footer */}
            <div>
                <Footer />
            </div>    
        </div>
    );
}

export default Home;