import { useContext } from "react";
import { MentorContext } from "./context/MentorContext";
import { AdminContext } from "./context/AdminContext";
import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Admin/Dashboard";
import AllMeetings from "./pages/Admin/AllMeetings";
import AddMentor from "./pages/Admin/AddMentor";
import MentorsList from "./pages/Admin/MentorsList";
import Login from "./pages/Login";
import MentorMeetings from "./pages/Mentor/MentorMeetings";
import MentorDashboard from "./pages/Mentor/MentorDashboard";
import MentorProfile from "./pages/Mentor/MentorProfile";
import AddCollege from "./pages/Admin/AddColleges";

const App = () => {

  const { dToken } = useContext(MentorContext);
  const { aToken } = useContext(AdminContext);

  return dToken || aToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <Routes>
          {aToken ? <Route path="/" element={<Dashboard />} /> : <Route path="/" element={<MentorDashboard />} />}
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-Meetings" element={<AllMeetings />} />
          <Route path="/add-Mentor" element={<AddMentor />} />
          <Route path="/add-College" element={<AddCollege />} />
          <Route path="/Mentor-list" element={<MentorsList />} />
          <Route path="/Mentor-dashboard" element={<MentorDashboard />} />
          <Route path="/Mentor-Meetings" element={<MentorMeetings />} />
          <Route path="/Mentor-profile" element={<MentorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App;
