import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedMentors from "../components/RelatedMentors"; // You can rename this if needed
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const CollegeDetails = () => {
  const { colId } = useParams();

  const { colleges, currencySymbol } = useContext(AppContext); 
  const [collegeInfo, setCollegeInfo] = useState(null);

  console.log(collegeInfo);

  const fetchCollegeInfo = async () => {
    const college = colleges.find((item) => item._id === colId); 
    setCollegeInfo(college);
  };

  useEffect(() => {
    if (colleges.length > 0) {
      fetchCollegeInfo();
    }
  }, [colleges, colId]);

  return collegeInfo ? (
    <div>
      {/* ---------- College Details ----------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={collegeInfo.image} alt="" />
        </div>

        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {collegeInfo.name} <img className="w-5" src={assets.verified_icon} alt="" />
          </p>

          <div className="flex flex-wrap gap-2 mt-2 text-gray-600">
            <p>{collegeInfo.speciality}</p>
            <p className="px-2 py-0.5 border rounded-full text-xs">{collegeInfo.experience}</p>
            <p className="px-2 py-0.5 border rounded-full text-xs">{collegeInfo.star}</p>
          </div>

          <div className="mt-3">
            <p className="text-sm font-medium text-[#262626]">About</p>
            <p className="text-sm text-gray-600 mt-1">{collegeInfo.about}</p>
          </div>

          <div className="mt-4 text-gray-700 text-sm">
            <p><strong>Address:</strong> {collegeInfo.address?.line1}, {collegeInfo.address?.line2}</p>
            <p><strong>City:</strong> {collegeInfo.city}</p>
            <p><strong>State:</strong> {collegeInfo.state}</p>
            <p><strong>Student-Faculty Ratio:</strong> {collegeInfo.studentFacultyRatio}</p>
            <p><strong>Annual Fee:</strong> ₹{collegeInfo.fees}</p>
            <p><strong>Application Fee:</strong> ₹{collegeInfo.appFees}</p>
          </div>
        </div>
      </div>

      {/* Optional: Related Colleges */}
      {/* <RelatedMentors speciality={collegeInfo.speciality} menId={menId} /> */}
    </div>
  ) : <Loading />; 
};

export default CollegeDetails;
