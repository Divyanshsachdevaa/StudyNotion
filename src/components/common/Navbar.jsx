import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { FaShoppingCart } from "react-icons/fa";
import ProfileDropdown from '../core/Auth/ProfileDropdown';
import { apiConnector } from "../../services/apiConnector";
import { NavbarLinks } from '../../data/navbar-links';
import { FaArrowDown } from "react-icons/fa6";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { categories } from '../../services/apis';

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    
    const location = useLocation();
    const matchRoute = (route) => location.pathname === route;

    const [subLinks, setSubLinks] = useState([]);

    const fetchSublinks = async () => {
        try {
            const result = await apiConnector('GET', categories.CATEGORIES_API , {}, { Authorization: `Bearer ${token}` });
            
            if (Array.isArray(result.data.allCategories)) {
                setSubLinks(result.data.allCategories);
            } else {
                console.error("Unexpected data format:", result.data.data);
                setSubLinks([]);
            }
        } catch (err) {
            console.error("Could not fetch the category list", err);
            setSubLinks([]);
        }
    };

    useEffect(() => {
        fetchSublinks();
    }, []);

    return (
        <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
            <div className="flex w-11/12 max-w-content items-center justify-between">
                <Link to='/'>
                    <img src={logo} width={160} height={42} loading="lazy" alt="Logo" />
                </Link>

                {/* Navigation Links */}
                <nav>
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <div className="relative group flex items-center gap-1">
                                        <p>{link.title}</p>
                                        <FaArrowDown />
                                        {/* The dropdown is nested directly under the trigger so that the hover state
                                            remains active even when moving the mouse over the dropdown */}
                                        <div className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-auto z-10">
                                            {Array.isArray(subLinks) && subLinks.length > 0 ? (
                                                subLinks.map((subLink, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                                        className="block rounded-lg bg-transparent py-2 px-4 hover:bg-richblack-50"
                                                    >
                                                        {subLink.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <div>No Categories Available</div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={link.path}>
                                        <p className={`${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Login/Signup Dashboard */}
                <div className="flex gap-x-4 items-center">
                    {user && user.accountType !== "Instructor" && (
                        <Link to="/dashboard/cart" className="relative">
                            <FaShoppingCart />
                            {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{totalItems}</span>}
                        </Link>
                    )}

                    {token === null && (
                        <>
                            <Link to="/login">
                                <button className="border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md">
                                    Log In
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md">
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}

                    {token !== null && <ProfileDropdown />}
                </div>
            </div>
        </div>
    );
};

export default Navbar;