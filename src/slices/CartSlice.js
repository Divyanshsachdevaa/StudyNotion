import {createSlice} from '@reduxjs/toolkit';
import {toast} from 'react-hot-toast'

const initialState = {
    totalItems: localStorage.getItem('totalItems') ? JSON.parse(localStorage.getItem('totalItems')) : 0,
    totalPrice: localStorage.getItem('totalPrice') ? JSON.parse(localStorage.getItem('totalPrice')) : 0,
    cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('totalPrice')): []
}
// cart contains courses that's why taken as array
// totalItems contains total number of items
// totalPrice contains total price of items

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        setTotalItems (state, value) {
            state.token = value.payload
        },
        // add to cart
        // remove from cart
        // resetCart
        addToCart(state, action){
            const course = action.payload;
            const index = state.cart.findIndex((item) => item._id === course._id );

            if(index >= 0){
                // if the course already exists then return
                toast.error("course is already present in the Cart")
                return ;
            }
            // if the course is not in the cart, then add it
            state.cart.push(course);
            state.totalItems++;
            state.cart.totalPrice += course.price;

            // update to localStorage
            localStorage.setItem('cart', JSON.stringify(state.cart));
            localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice));
            localStorage.setItem('totalItems', JSON.stringify(state.totalItems));
            
            // show toast
            toast.success("Course added to cart");
        },
        removeFromCart(state, action){
            const courseId = action.payload
            const index = state.cart.findIndex((item) => item._id === courseId)

            if (index >= 0) {
                // If the course is found in the cart, remove it
                state.totalItems--
                state.total -= state.cart[index].price
                state.cart.splice(index, 1)
                // Update to localstorage
                localStorage.setItem("cart", JSON.stringify(state.cart))
                localStorage.setItem("total", JSON.stringify(state.total))
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
                // show toast
                toast.success("Course removed from cart")
            }
        },
        resetCart: (state) => {
            state.cart = []
            state.total = 0
            state.totalItems = 0
            // Update to localstorage
            localStorage.removeItem("cart")
            localStorage.removeItem("total")
            localStorage.removeItem("totalItems")
        },
    }    
});

export const {addToCart, removeFromCart, resetCart, setTotalItems} = cartSlice.actions;
export default cartSlice.reducer;
