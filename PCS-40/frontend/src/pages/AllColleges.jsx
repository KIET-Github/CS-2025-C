import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Colleges = () => {
  const { speciality } = useParams();
  const [filterCollege, setFilterCollege] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { colleges } = useContext(AppContext);

  // console.log(colleges, "colleges");

  const applyFilter = () => {
    if (speciality) {
      setFilterCollege(colleges.filter(col => col.speciality === speciality));
    } else {
      setFilterCollege(colleges);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [colleges, speciality]);

  console.log(filterCollege, "filterCollege");

  const filters = [
    "Engineering",
    "Medical",
    "Business & Management",
    "Law",
    "Arts & Humanities",
    "Science & Technology",
    "Design & Architecture"
  ];
  

  return (
    <div>
      <p className="text-gray-600">Find Colleges with Custom Filters</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : "black"
          }`}
        >
          Filters
        </button>

        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          {filters.map((filterName, idx) => (
            <p
              key={idx}
              onClick={() =>
                speciality === filterName
                  ? navigate("/College")
                  : navigate(`/College/${filterName}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === filterName ? "bg-[#E2E5FF] text-black" : ""
              }`}
            >
              {filterName}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterCollege.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/CollegeDetails/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img className="bg-[#EAEFFF]" src={item.image} alt="" />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {/* <p
                    className={`w-2 h-2 rounded-full ${
                      item.available ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></p> */}
                  {/* <p>{item.available ? "Available" : "Not Available"}</p> */}
                </div>
                <p className="text-[#262626] text-lg font-medium">{item.name}</p>
                <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Colleges;
