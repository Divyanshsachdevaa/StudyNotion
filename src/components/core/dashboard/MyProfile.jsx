import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconButton from '../../common/IconButton';

const MyProfile = () => {
    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate();
    return (
        <div>
            <h1>My Profile</h1>

            {/* Section 1 */}
            <div>
                <div>
                    <img src={user?.image} alt={'profile-${user?.firstName}'} 
                    className="aspect-square w-[78px] rounded-full object-cover"/>
                    <div>
                        <p>{user?.firstName} + " " + {user?.lastName}</p>
                        <p>{user?.email}</p>
                    </div>
                </div>
                <IconButton 
                    text="Edit"
                    onClick={() => navigate("/dashboard/settings")}
                />
                {/* Add an icon in this button */}
            </div>

            {/* Section 2 */}
            <div>
                <div>
                    <p>About</p>
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
            <div>
                <div>
                    <p>Personal Details</p>
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