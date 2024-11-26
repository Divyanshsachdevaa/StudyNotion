import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconButton from '../../common/IconButton';

const MyProfile = () => {
    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate();
    return (
        <div>
            <h1 className="mb-14 text-3xl font-medium text-richblack-5" >My Profile</h1>

            {/* Section 1 */}
            <div className="flex flex-items justify-center justify-between rounded-md  border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex items-center gap-x-4">
                    <img src={user?.image} alt={'profile-${user?.firstName}'} 
                    className="aspect-square w-[78px] rounded-full object-cover"/>
                    <div className="space-y-1">
                        <p className='text-lg font-semibold text-richblack-5'>
                            {user?.firstName}  {user?.lastName}</p>
                        <p className='text-sm text-richblack-300'>{user?.email}</p>
                    </div>
                </div>
                <IconButton 
                    text="Edit"
                    onClick={() => navigate("/dashboard/settings")}
                />
                {/* Add an icon in this button */}
            </div>

            {/* Section 2 */}
            <div className='my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>
                <div className='flex w-full items-center justify-between'>
                    <p className='text-lg font-semibold text-richblack-5'>About</p>
                    <IconButton 
                        text="Edit"
                        onClick = { () => {
                            navigate("/dashboard/settings")
                        }}
                    />
                </div>    
                <p>{user?.additionalDetails?.about ?? "Write something about Yourself"} </p>
            </div>
            
            {/* Section 3 */}
            <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex w-full items-center justify-between">
                    <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
                    <IconButton 
                        text="Edit"
                        onClick = { () => {
                            navigate("/dashboard/settings")
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default MyProfile;