import React from 'react';

const RenderTotalAmount = () => {
    const {total} = useSelector((state) => state.cart)

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

            <IconBtn 
                text={"Buy Now"}
                onClick={handleBuyCourse}
                customClasses={"w-full justify-center"}
            />
        </div>
    )
}

export default RenderTotalAmount;