import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import Loading from "../components/Loading.jsx";

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false);

    const [image, setImage] = useState(false);

    const { backendUrl, userData, loadUserProfileData, token } = useContext(AppContext);
    // console.log(token);
    // console.log(userData);
   

    const [userData1, setUserData] = useState(userData);
    // console.log(userData);
    // useEffect(() => {
    //     loadUserProfileData();
    // }, []);

    useEffect(() => {
        setTimeout(() => {
            if (userData) {
                setUserData({ ...userData });
            }
        }, 1000);
    }, [userData]);

    // console.log(userData1);

    // Function to update user profile data using API
    const updateUserProfileData = async () => {

        try {

            const formData = new FormData();

            formData.append("name", userData1.name);
            formData.append("phone", userData1.phone);
            formData.append("address", JSON.stringify(userData1.address));
            formData.append("gender", userData1.gender);
            formData.append("dob", userData1.dob);

            image && formData.append("image", image);

            console.log(token);

            const { data } = await axios.post(backendUrl + "/api/user/update-profile", formData, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(false);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }

    }

    return userData1 ? (
        <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">

            {isEdit
                ? <label htmlFor="image" >
                    <div className="inline-block relative cursor-pointer">
                        <img className="w-36 rounded opacity-75" src={image ? URL.createObjectURL(image) : userData1.image} alt="" />
                        <img className="w-10 absolute bottom-12 right-12" src={image ? "" : assets.upload_icon} alt="" />
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>
                : <img className="w-36 rounded" src={userData.image} alt="" />
            }

            {isEdit
                ? <input className="bg-gray-50 text-3xl font-medium max-w-60" type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData1.name} />
                : <p className="font-medium text-3xl text-[#262626] mt-4">{userData1.name}</p>
            }

            <hr className="bg-[#ADADAD] h-[1px] border-none" />

            <div>
                <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
                    <p className="font-medium">Email id:</p>
                    <p className="text-blue-500">{userData1.email}</p>
                    <p className="font-medium">Phone:</p>

                    {isEdit
                        ? <input className="bg-gray-50 max-w-52" type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData1.phone} />
                        : <p className="text-blue-500">{userData1.phone}</p>
                    }

                    <p className="font-medium">Address:</p>

                    {isEdit
                        ? <p>
                            <input className="bg-gray-50" type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData1.address.line1} />
                            <br />
                            <input className="bg-gray-50" type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData1.address.line2} /></p>
                        : <p className="text-gray-500">{userData1.address.line1} <br /> {userData1.address.line2}</p>
                    }

                </div>
            </div>
            <div>
                <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
                    <p className="font-medium">Gender:</p>

                    {isEdit
                        ? <select className="max-w-20 bg-gray-50" onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData1.gender} >
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        : <p className="text-gray-500">{userData1.gender}</p>
                    }

                    <p className="font-medium">Birthday:</p>

                    {isEdit
                        ? <input className="max-w-28 bg-gray-50" type="date" onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData1.dob} />
                        : <p className="text-gray-500">{userData1.dob}</p>
                    }

                </div>
            </div>
            <div className="mt-10">

                {isEdit
                    ? <button onClick={updateUserProfileData} className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all">Save information</button>
                    : <button onClick={() => setIsEdit(true)} className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all">Edit</button>
                }

            </div>
        </div>
    ) : <Loading />
}

export default MyProfile;
