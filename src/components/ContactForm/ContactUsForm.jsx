import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import countryCode from "../../data/countrycode.json";
import { contactusEndpoint } from '../../services/apis'
import { apiConnector } from '../../services/apiConnector';
import toast from 'react-hot-toast';
const ContactUsForm = () => {

    const [loading, setLoading] = useState(false);
    
    const {
        register, 
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) => {
        console.log("logging data => " , data);
        try{
            setLoading(true);
            const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
            toast.success("Email Sent successfully");
            console.log("Logging response => ", response);
            setLoading(false);
           
        } catch(err){
            console.log("Error in fetching data from API ", err.message);
        }
    }

    useEffect( () => {
        if(isSubmitSuccessful){
            reset({
                email: "",
                firstName: "",
                lastName: "",
                message: "",
                phoneNo: "",
            })
        }
    }, [isSubmitSuccessful, reset]);

    return (
        <form className="flex flex-col gap-7"
        onSubmit={handleSubmit(submitContactForm)}>
            {/* First And Last Name */}
            <div className="flex flex-col gap-5 lg:flex-row">
                {/* firstName  */}
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor='firstName' >First Name</label>
                    <input type='text' name='firstName' id='firstName' placeholder='Enter First Name' {...register("firstName", {required:true})} 
                    className="text-black" />
                    {
                        errors.firstName && (
                            <span>Please enter your name</span>
                        )
                    }
                </div>
                
                {/* lastName */}
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor='lastName' >First Name</label>
                    <input type='text' name='lastName' id='lastName' placeholder='Enter Last Name' {...register("lastName")} className="text-black" />
                </div>
            </div>    

                {/* email */}
                <div className="flex flex-col gap-2">
                    <label htmlfor='email' >Email Address</label>
                    <input type="email" name="email" id='email' placeholder="Enter your email address" 
                        {...register("email", {required:true})} className="text-black"
                    />
                    {
                        errors.email && (
                            <span>Please enter your email address</span>
                        )
                    }
                </div>

                {/* Phone no. */}
                <div className="flex flex-col gap-2">
                    <label htmlfor='phoneNumber' >Phone Number</label>
                    <div className="flex flex-row gap-5">
                        {/* dropDown */}  
                        <select name="dropdown" id="dropdown" {...register("countrycode", {required: true})} className="w-[80px]">
                            {
                                countryCode.map( (element, index) => <option key={index} value={element.code}>
                                    {element.code} - {element.country}</option>)
                            }
                        </select>

                        <input 
                            type="number"
                            name="phoneNumber" 
                            id="phoneNumber" 
                            placeholder="12345 67890"
                            {...register("phoneNumber", 
                                {
                                    required: {value: true, message: "Please enter Phone Number"}, 
                                    maxLength: {value: 10, message:"Invalid Phone Number"},
                                    minLength: {value: 8, message: "Invalid Phone Number"}
                                })}
                            className="text-black w-[calc(100%-90px)]"
                        />    
                    </div>

                    {
                        errors.phoneNo && (
                            <span>{errors.phoneNo.message}</span>
                        )
                    }

                </div>

                {/* Msg box */}
                <div className="flex flex-col gap-2">
                    <label htmlfor='message'>Message</label>
                    <textarea name='message' id="message" cols="30" rows="7" placeholder="Enter your message"
                    {...register("message", {required: true})} className="text-black"/>
                    {
                        errors.message && (
                            <span>Please enter your message</span>
                        )
                    }
                </div>

                <button type="submit" 
                    className="rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black"
                >Send Message
                </button> 
        </form>
    )
}

export default ContactUsForm;