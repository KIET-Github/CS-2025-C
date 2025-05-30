import Navbar from "./components/Navbar"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Mentors from "./pages/Mentors"
import Login from "./pages/Login"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Meeting from "./pages/Meeting"
import MyMeetings from "./pages/MyMeetings"
import MyProfile from "./pages/MyProfile"
import Footer from "./components/Footer"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify"
import AllColleges from "./pages/AllColleges";
import ErrorPage from "./components/ErrorPage.jsx";
import OtpInput from "./components/OtpInput.jsx";
import CollegeDetails from "./pages/College.jsx"

const App = () => {
  return (
    <div className="mx-4 sm:mx-[6%]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Mentors" element={<Mentors />} />
        <Route path="/College" element={<AllColleges />} />
        <Route path="/Mentors/:speciality" element={<Mentors />} />
        <Route path="/College/:speciality" element={<AllColleges />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verifyOtp" element={<OtpInput />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Meeting/:menId" element={<Meeting />} />
        <Route path="/CollegeDetails/:colId" element={<CollegeDetails />} />
        <Route path="/my-Meetings" element={<MyMeetings />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App