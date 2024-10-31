import React from 'react';
import ContactUsForm from "../../ContactForm/ContactUsForm.jsx";

const ContactFormSection = () => {
    return (
        <div className='mx-auto'>
            <h1>Get in Touch</h1> 
            <p>
                We'd love to here for you, please fill out this form
            </p>
            <div  className="mt-12 mx-auto flex justify-center">
                <ContactUsForm />
            </div>
        </div>   
    )
}

export default ContactFormSection;