import React from 'react';
import {useSelector} from 'react-redux';
import IconButton from '../../../common/IconButton';

const RenderTotalAmount = () => {
    const {total, cart} = useSelector((state) => state.cart)

    const handleBuyCourse = () => {
        const courses = cart.map((course, index) => {
            console.log("Bought these courses: ", courses);
            // TODO API INTEGRATION -> Payment gateway tak leke jayegi
        })
    }

    return (
        <div>
            <p>Total:</p>
            <p>Rs {total} </p>

            <IconButton
                text={"Buy Now"}
                onClick={handleBuyCourse}
                customClasses={"w-full justify-center"}
            />
        </div>
    )
}

export default RenderTotalAmount;