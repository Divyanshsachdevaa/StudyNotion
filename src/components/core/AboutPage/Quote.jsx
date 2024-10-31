import React from 'react';
import HighlightText from '../HomePage/HighlightText';

const Quote = () => {
    return (
        <div>
            We are passionate about revolutionizing the way we learn. Our innovative platform 
            <HighlightText text={"Combines technology"} />
            <span className="text-brown-500 ">
                {" "}
                experties
            </span>
            , and Community to create an 
            <span>unpralled educational Experiecnce</span>
        </div>
    )
}

export default Quote;
