import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext();


const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const [Meetings, setMeetings] = useState([])
    const [Mentors, setMentors] = useState([])
    const [dashData, setDashData] = useState(false)

    // Getting all Mentors data from Database using API
    const getAllMentors = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/all-Mentors', { headers: { aToken } });
            if (data.success) {
                setMentors(data.Mentors);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }

    }

    // Function to change Mentor availablity using API
    const changeAvailability = async (menId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { menId }, { headers: { aToken } });
            if (data.success) {
                toast.success(data.message);
                getAllMentors();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }


    // Getting all Meeting data from Database using API
    const getAllMeetings = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/Meetings', { headers: { aToken } });
            if (data.success) {
                setMeetings(data.Meetings.reverse());
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }

    }

    // Function to cancel Meeting using API
    const cancelMeeting = async (MeetingId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-Meeting', { MeetingId }, { headers: { aToken } });

            if (data.success) {
                toast.success(data.message);
                getAllMeetings();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }

    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } });

            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }

    }

    const value = {
        aToken, setAToken,
        Mentors,
        getAllMentors,
        changeAvailability,
        Meetings,
        getAllMeetings,
        getDashData,
        cancelMeeting,
        dashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider;
