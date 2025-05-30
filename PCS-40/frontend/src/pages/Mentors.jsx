import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Mentors = () => {

  const { speciality } = useParams();

  const [filterMen, setFilterMen] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const { mentors } = useContext(AppContext);
  // console.log(mentors);

  const applyFilter = () => {
    if (speciality) {
      setFilterMen(mentors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterMen(mentors);
    }
  }

  useEffect(() => {
    applyFilter()
  }, [mentors, speciality]);

  // console.log(filterMen);
  return (
    <>
      <p className="text-gray-600">Browse through the Mentors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? "bg-primary text-white" : "black"}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? "flex" : "hidden sm:flex"}`}>
          <p onClick={() => speciality === "General Mentor" ? navigate("/Mentors") : navigate("/Mentors/General Mentor")} className={` w-[96vw] md:w-48 sm:w-auto pl-3 py-1.5 pr-8 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General Mentor" ? "bg-[#E2E5FF] text-black " : ""}`}>General Mentor</p>
          <p onClick={() => speciality === "Engineering" ? navigate("/Mentors") : navigate("/Mentors/Engineering")} className={`w-[94vw] md:w-48 sm:w-auto pl-3 py-1.5 pr-8 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Engineering" ? "bg-[#E2E5FF] text-black " : ""}`}>Engineering</p>
          <p onClick={() => speciality === "Doctor" ? navigate("/Mentors") : navigate("/Mentors/Doctor")} className={`w-[94vw] md:w-48 sm:w-auto pl-3 py-1.5 pr-8 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Doctor" ? "bg-[#E2E5FF] text-black " : ""}`}>Doctor</p>
          <p onClick={() => speciality === "Fashion Design" ? navigate("/Mentors") : navigate("/Mentors/Fashion Design")} className={`w-[94vw] md:w-48 sm:w-auto pl-3 py-1.5 pr-8 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Fashion Design" ? "bg-[#E2E5FF] text-black " : ""}`}>Fashion Design</p>
          <p onClick={() => speciality === "MNC" ? navigate("/Mentors") : navigate(`/Mentors/MNC`)} className={`w-[94vw] md:w-48 sm:w-auto pl-3 py-1.5 pr-8 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "MNC" ? "bg-[#E2E5FF] text-black " : ""}`}>MNC</p>
          <p onClick={() => speciality === "MBA" ? navigate("/Mentors") : navigate("/Mentors/MBA")} className={`w-[94vw] md:w-48 sm:w-auto pl-3 py-1.5 pr-8 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "MBA" ? "bg-[#E2E5FF] text-black " : ""}`}>MBA</p>
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterMen.map((item, index) => (
            <div onClick={() => { navigate(`/Meeting/${item._id}`); scrollTo(0, 0) }} className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500" key={index}>
              <img className="bg-[#EAEFFF]" src={item.image} alt="" />
              <div className="p-4">
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? "text-green-500" : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-gray-500"}`}></p><p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-[#262626] text-lg font-medium">{item.name}</p>
                <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Mentors;