import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { FaShoppingCart } from "react-icons/fa";
import ProfileDropdown from '../core/Auth/ProfileDropdown';
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { FaArrowDown } from "react-icons/fa6";
import { NavbarLinks } from '../../data/navbar-links';
import logo from "../../assets/Logo/Logo-Full-Light.png";

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    
    const location = useLocation();
    const matchRoute = (route) => location.pathname === route;

    const [subLinks, setSubLinks] = useState([]);

    const fetchSublinks = async () => {
        try {
            const result = await apiConnector('GET', categories.CATEGORIES_API);
            console.log("Printing SubLinks result: ", result);
            if (Array.isArray(result.data.data)) {
                setSubLinks(result.data.data);
            } else {
                console.error("Unexpected data format:", result.data.data);
                setSubLinks([]);
            }
        } catch (err) {
            console.error("Could not fetch the category list", err);
            setSubLinks([]);
        }
    }

    useEffect(() => {
        fetchSublinks();
    }, []);

    return (
        <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
            <div className="flex w-11/12 max-w-content items-center justify-between">
                <Link to='/'>
                    <img src={logo} width={160} height={42} loading='lazy' />
                </Link>

                {/* NavLinks */}
                <nav>
                    <ul className='flex gap-x-6 text-richblack-25'>
                        {
                            NavbarLinks.map((link, index) => (
                                <li key={index}>
                                    {
                                        link.title === "Catalog" ? (
                                            <div className='relative flex items-center gap-1 group'>
                                                <p>{link.title}</p>
                                                <FaArrowDown />

                                                <div className='invisible absolute left-[50%] top-[35%] flex flex-col 
                                                translate-x-[-50%] translate-y-[35%] rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all 
                                                duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]'>

                                                    <div className='absolute left-[56%] top-0 h-6 w-6 rotate-45 rounded bg-richblack-5 translate-y-[-15%]'></div>
                                                    {
                                                        Array.isArray(subLinks) && subLinks.length > 0 ? (
                                                            subLinks.map((subLink, index) => (
                                                                <Link to={`${subLink.link}`} key={index}>
                                                                    <p>{subLink.title}</p>
                                                                </Link>
                                                            ))
                                                        ) : (<div>No Categories Available</div>)
                                                    }
                                                </div>
                                            </div>
                                        ) : (
                                            <Link to={link?.path}>
                                                <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                                    {link.title}
                                                </p>
                                            </Link>
                                        )
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </nav>

                {/* login/signup dashboard */}
                <div className='flex gap-x-4 items-center'>
                    {
                        user && user.accountType !== "Instructor" && (
                            <Link to="/dashboard/cart" className="relative">
                                <FaShoppingCart />
                                {
                                    totalItems > 0 && (
                                        <span>{totalItems}</span>
                                    )
                                }
                            </Link>    
                        )
                    }

                    {
                        token === null && (
                            <Link to="/login">
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Log In
                                </button>
                            </Link>
                        )
                    }
                    
                    {
                        token === null && (
                            <Link to='/signup'>
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }
                    
                    {
                        token !== null && <ProfileDropdown />
                    }
                </div>
            </div>
        </div>
    );
}

export default Navbar;
