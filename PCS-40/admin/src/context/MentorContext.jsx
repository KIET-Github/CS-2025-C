import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';


export const MentorContext = createContext();

const MentorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [Meetings, setMeetings] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [profileData, setProfileData] = useState(false);

    // Getting Mentor Meeting data from Database using API
    const getMeetings = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/Mentor/Meetings', { headers: { dToken } });
            // console.log(data.Meetings);
            if (data.success) {
                setMeetings(data.Meetings.reverse());
            } else {
                toast.error(data.message);
            };

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // Getting Mentor profile data from Database using API;
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/Mentor/profile', { headers: { dToken } });
            console.log(data.profileData);
            setProfileData(data.profileData);

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // Function to cancel Mentor Meeting using API
    const cancelMeeting = async (MeetingId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/Mentor/cancel-Meeting', { MeetingId }, { headers: { dToken } });

            if (data.success) {
                toast.success(data.message);
                getMeetings();
                // after creating dashboard
                getDashData();
            } else {
                toast.error(data.message);
            }
            ;
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }

    }

    // Function to Mark Meeting completed using API
    const completeMeeting = async (MeetingId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/Mentor/complete-Meeting', { MeetingId }, { headers: { dToken } });;

            if (data.success) {
                toast.success(data.message);
                getMeetings();
                // Later after creating getDashData Function
                getDashData();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }

    }

    // Getting Mentor dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/Mentor/dashboard', { headers: { dToken } });

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
        dToken, setDToken, backendUrl,
        Meetings,
        getMeetings,
        cancelMeeting,
        completeMeeting,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    }

    return (
        <MentorContext.Provider value={value}>
            {props.children}
        </MentorContext.Provider>
    )


}

export default MentorContextProvider;
