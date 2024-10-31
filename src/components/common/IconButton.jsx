import React from 'react';

const IconButton = ({
    text, 
    button, 
    children, 
    disabled, 
    outlinefalse,
    customClasses,
    type, 
}) => {

    return (
        <button 
            disabled = {disabled}
            onClick={onclick}
            type={type}
        >
            {
                children ? (
                    <>
                        <span>
                            {text}
                        </span>
                        {children}
                    </>
                ) : (text)
            }
            {/* Add a icon here  */}
        </button>
    )
}

export default IconButton;