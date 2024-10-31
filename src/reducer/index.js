import {combineReducers} from '@reduxjs/toolkit'
import authReducer from "../slices/authSlice"
import cartReducer from '../slices/CartSlice';
import profileReducer from '../slices/profileSlice'
import courseReducer from '../slices/CourseSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
    course: courseReducer,
})

export default rootReducer;