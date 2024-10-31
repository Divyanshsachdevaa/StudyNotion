import React from 'react';
import IconButton from './IconButton';

const ConfirmationModal = ({modalData}) => {
    return (
        <div>
            <div>
                <p>{modalData.text1}</p>
                <p>{modalData.text2}</p>
                <div>
                    <IconButton 
                        onClick={modalData?.btnHandler} 
                        text={modalData?.btnText}
                    />
                    <button onClick={modalData?.btn2Handler}>
                        {modalData?.btn2Text}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal;