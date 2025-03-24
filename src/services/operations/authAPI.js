import {setLoading, setToken} from "../../slices/authSlice";
import { toast } from "react-hot-toast"

import { resetCart } from "../../slices/CartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSWORD_TOKEN,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    console.log("Before entering try block -> " + email);
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      console.log("Inside authApi => " , firstName, lastName, email, password, confirmPassword, accountType, otp);
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    console.log("Before try");

    try {
      console.log("Before fetching response");
      console.log(LOGIN_API);
      console.log("email", email, " ", password);
      const response = await apiConnector("POST", LOGIN_API, { email, password });

      console.log("After fetching response");
      console.log("LOGIN API RESPONSE............", response.data.message);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);

      // Check if error response exists
      if (error.response) {
        const { status, data } = error.response;
        console.log("Error Data:", data);
        console.log("Error Status:", status);

        if (status === 401) {
          // Show proper error message
          toast.error(data.message || "Invalid credentials, please check your details.");
        } 
        else if(status === 404){
          toast.error(data.message || "User not found, please signup first.");
        }
        else {
          toast.error("Something went wrong, please try again later.");
        }
      } else {
        console.log("Error Message:", error.message);
        toast.error("Network error, please check your connection.");
      }
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}

export function getPasswordResetToken(email, setEmailSent){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            // call backend api
            // console response
            // check response successfull or not
            // add success toast
            // setEmailSent as true

            const result = await apiConnector("POST",RESETPASSWORD_TOKEN, {email});
            console.log("RESULT CHECK -> ", result);
            if(!result.data.success){
                throw new Error(result.data.message);
            }
            
            toast.success("Reset Email Sent");
            setEmailSent(true);
        } catch(err){
            console.log("RESET PASSWORD TOKEN Error",err);
            toast.error("Failed to send email resetting password");
        }
        dispatch(setLoading(false));
    }
}

export function resetPassword(password, confirmPassword, token){
    return async (dispatch) => {
        dispatch(setLoading(true));

        try{
            // api call
            // check res valid or not
            // add success toast

            const result = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});
            console.log("RESULT CHECK -> ", result);
            if(!result.data.success){
              throw new Error(result.data.message);
            }
            
            toast.success("Password has been reset successfully");
        } catch(err){
            console.log("RESET PASSWORD TOKEN Error", err);
            toast.error("Failed to reset password");
        }
        dispatch(setLoading(false));
    }    
}