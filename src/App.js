import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar.jsx";
import Signup from "./pages/Signup";
import Login from './pages/Login';
import ResetPassword from "./pages/ResetPassword"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail.jsx";
import OpenRoute from "./components/core/Auth/OpenRoute.jsx";
import PrivateRoute from "./components/core/Auth/PrivateRoute.jsx";
import About from './pages/About';
import Dashboard from "./pages/Dashboard.jsx";
import MyProfile from './components/core/dashboard/MyProfile.jsx';
import EnrolledCourses from './components/core/dashboard/EnrolledCourses.jsx';
import Cart from "./components/core/dashboard/Cart/index.jsx";
import AddCourse from "./components/core/AddCourse/index.jsx";




function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />

      <Routes>
        <Route path="/" element = {<Home/>} />
        <Route path='signup' element={<OpenRoute> <Signup /></OpenRoute>} />
        <Route path='login' element={<OpenRoute> <Login /> </OpenRoute>} />
        <Route path='forgot-password' element={<OpenRoute> <ResetPassword /> </OpenRoute>} />
        <Route path='update-password/:id' element={<OpenRoute> <UpdatePassword /> </OpenRoute>} />
        <Route path='verify-email' element={<OpenRoute> <VerifyEmail /> </OpenRoute>} />
        <Route path='about' element={<OpenRoute> <About /> </OpenRoute>} />

        <Route element={<PrivateRoute> <Dashboard /> </PrivateRoute>} >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="dashboard/add-course" element={<AddCourse/>}/>
        </Route>
        
      </Routes>
    </div>
  );
}

export default App;

{/* <Route element={ <Dashboard /> } > 
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/cart" element={<Cart/>} />
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="/dashboard/cart" element={<Cart/>} />
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
              </>
            )
          }

</Route> */}
