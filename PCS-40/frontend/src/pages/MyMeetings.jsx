import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyMeetings = () => {

    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();

    const [Meetings, setMeetings] = useState([]);
    const [payment, setPayment] = useState("");

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split("_");
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    }

    // Getting User Meetings Data Using API
    const getUserMeetings = async () => {
        try {

            const { data } = await axios.get(backendUrl + "/api/user/Meetings", { headers: { token } });
            console.log(data);
            setMeetings(data.Meetings.reverse());

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // Function to cancel Meeting Using API
    const cancelMeeting = async (MeetingId) => {

        try {

            const { data } = await axios.post(backendUrl + "/api/user/cancel-Meeting", { MeetingId }, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                getUserMeetings();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }

    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Meeting Payment",
            description: "Meeting Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {

                console.log(response)

                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate("/my-Meetings");
                        getUserMeetings();
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const MeetingRazorpay = async (MeetingId) => {
        try {
            const { data } = await axios.post(backendUrl + "/api/user/payment-razorpay", { MeetingId }, { headers: { token } });
            if (data.success) {
                initPay(data.order);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // Function to make payment using stripe;
    const MeetingStripe = async (MeetingId) => {
        try {
            const { data } = await axios.post(backendUrl + "/api/user/payment-stripe", { MeetingId }, { headers: { token } });
            if (data.success) {
                const { session_url } = data;
                window.location.replace(session_url);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getUserMeetings();
        }
    }, [token])

    return (
        <div>
            <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">My Meetings</p>
            <div className="">
                {Meetings.map((item, index) => (
                    <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b">
                        <div>
                            <img className="w-36 bg-[#EAEFFF]" src={item.menData.image} alt="" />
                        </div>
                        <div className="flex-1 text-sm text-[#5E5E5E]">
                            <p className="text-[#262626] text-base font-semibold">{item.menData.name}</p>
                            <p>{item.menData.speciality}</p>
                            <p className="text-[#464646] font-medium mt-1">Address:</p>
                            <p className="">{item.menData.address.line1}</p>
                            <p className="">{item.menData.address.line2}</p>
                            <p className=" mt-1"><span className="text-sm text-[#3C3C3C] font-medium">Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className="flex flex-col gap-2 justify-end text-sm text-center">
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => setPayment(item._id)} className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">Pay Online</button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => MeetingStripe(item._id)} className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"><img className="max-w-20 max-h-5" src={assets.stripe_logo} alt="" /></button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => MeetingRazorpay(item._id)} className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"><img className="max-w-20 max-h-5" src={assets.razorpay_logo} alt="" /></button>}
                            {!item.cancelled && item.payment && !item.isCompleted && <button className="sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]">Paid</button>}

                            {item.isCompleted && <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">Completed</button>}

                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelMeeting(item._id)} className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">Cancel Meeting</button>}
                            {item.cancelled && !item.isCompleted && <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Meeting cancelled</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyMeetings;