import { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { MentorContext } from "../context/MentorContext";
import { AdminContext } from "../context/AdminContext";

const Sidebar = () => {

  const { dToken } = useContext(MentorContext);
  const { aToken } = useContext(AdminContext);

  return (
    <div className="min-h-screen bg-white border-r">
      {aToken && <ul className="text-[#515151] mt-5">

        <NavLink to={"/admin-dashboard"} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
          <img className="min-w-5" src={assets.home_icon} alt="" />
          <p className="hidden md:block">Dashboard</p>
        </NavLink>
        <NavLink to={"/all-Meetings"} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
          <img className="w-6" src={assets.Meeting_icon} alt="" />
          <p className="hidden md:block">Meetings</p>
        </NavLink>
        <NavLink to={"/add-Mentor"} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
          <img className="w-6" src={assets.add_icon} alt="" />
          <p className="hidden md:block">Add Mentor</p>
        </NavLink>
        <NavLink to={"/add-College"} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
          <img className="w-6" src={assets.add_icon} alt="" />
          <p className="hidden md:block">Add College</p>
        </NavLink>
        <NavLink to={"/Mentor-list"} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
          <img className="min-w-5" src={assets.people_icon} alt="" />
          <p className="hidden md:block">Mentors List</p>
        </NavLink>
      </ul>}

      {dToken && <ul className="text-[#515151] mt-5">
        <NavLink to={"/Mentor-dashboard"} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
          <img className="min-w-5" src={assets.home_icon} alt="" />
          <p className="hidden md:block">Dashboard</p>
        </NavLink>
        <NavLink to={"/Mentor-Meetings"} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
          <img className="w-6" src={assets.Meeting_icon} alt="" />
          <p className="hidden md:block">Meetings</p>
        </NavLink>
        <NavLink to={"/Mentor-profile"} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
          <img className="min-w-5" src={assets.people_icon} alt="" />
          <p className="hidden md:block">Profile</p>
        </NavLink>
      </ul>}
    </div>
  )
}

export default Sidebar;
