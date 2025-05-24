import { useContext } from "react";
import { assets } from "../assets/assets";
import { MentorContext } from "../context/MentorContext";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const { dToken, setDToken } = useContext(MentorContext);
  const { aToken, setAToken } = useContext(AdminContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
  }

  return (
    <div className="flex justify-between items-center px-4 sm:px-10  border-b bg-white">
      <div className="flex items-center text-xs">
        <img onClick={() => navigate("/")} className=" w-16 sm:w-20 h-20 cursor-pointer" src={assets.navIcon} alt="" />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">{aToken ? "Admin" : "Mentor"}</p>
      </div>
      <button  type="button" onClick={() => logout()} className="bg-primary text-white text-sm px-10 py-2 rounded-full">Logout</button>
    </div>
  )
}

export default Navbar;
