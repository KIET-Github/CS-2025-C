import { createContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_OTP_REQUEST,
    USER_REGISTER_FAIL,
    USER_REGISTER_OTP_SUCCESS,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
} from "../constants/userConstants.js";

export const AppContext = createContext();


const initialState = {
    userData: JSON.parse(localStorage.getItem('userInfo')) || null,
    token: JSON.parse(localStorage.getItem('token')) || null,
    loged: JSON.parse(localStorage.getItem('loged')) || false,
    mentors: [],
    colleges: [],
    loading: false,
    otpSent: JSON.parse(localStorage.getItem('otpSent')) || false,
    verfied: JSON.parse(localStorage.getItem('verfied')) || false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
        case USER_REGISTER_REQUEST:
            return { ...state, loading: true };

        case USER_LOGIN_SUCCESS:
            // localStorage.setItem("userInfo", JSON.stringify(action.payload));
            localStorage.setItem("token", JSON.stringify(action.payload.token));
            localStorage.setItem('verfied', JSON.stringify(true));
            localStorage.setItem('loged', JSON.stringify(true));
            return { ...state, loading: false, verfied: true, otpSent: false, token: action.payload.token, loged: true };

        case USER_REGISTER_SUCCESS:
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
            localStorage.setItem("token", JSON.stringify(action.payload.token));
            localStorage.setItem('loged', JSON.stringify(true));
            return { ...state, loading: false, token: action.payload.token, userData: action.payload, loged: true };

        case USER_LOGIN_FAIL:
        case USER_REGISTER_FAIL:
            return { ...state, loading: false };

        case USER_LOGOUT:
            localStorage.removeItem('userInfo');
            localStorage.removeItem('verfied');
            localStorage.removeItem('otpSent');
            localStorage.removeItem('loged');
            localStorage.removeItem('token');
            return { ...state, userData: null, verfied: false, otpSent: false, token: null };

        case "SET_MENTORS":
            return { ...state, mentors: action.payload };

        case "SET_COLLEGE":
            return { ...state, colleges: action.payload };

        case "SET_USER":
            return { ...state, userData: action.payload };

        case USER_OTP_REQUEST:
            localStorage.setItem('otpSent', JSON.stringify(true));
            return { ...state, otpSent: true };

        case USER_REGISTER_OTP_SUCCESS:
            localStorage.setItem('verfied', JSON.stringify(true));
            return { ...state, verfied: true, otpSent: false };

        default:
            return state;
    }
};

const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [state, dispatch] = useReducer(reducer, initialState);
    const currencySymbol = '₹';
    const navigate = useNavigate();
    // console.log(state.token);

    // Getting Mentors using API
    const getMentorData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/Mentor/list');
            // console.log(data);
            if (data.success) {
                dispatch({ type: "SET_MENTORS", payload: data.Mentors });
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }

    }

       // Getting Colleges using API
       const getCollegeData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/Mentor/CollegeList');
            // console.log(data);
            if (data.success) {
                dispatch({ type: "SET_COLLEGE", payload: data.Colleges });
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {
        // console.log("fuction called");
        // console.log(state.userData.token);
        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token: state.token } });
            // console.log(data);

            if (data.success) {
                dispatch({ type: "SET_USER", payload: data.userData });
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }

    };

    const login = async (email, password) => {
        dispatch({ type: USER_LOGIN_REQUEST });
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
            if (data.success) {
                dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
                toast.success("Login successful!");
            } else {
                dispatch({ type: USER_LOGIN_FAIL });
                toast.error(data.message);
            }
        } catch (error) {
            dispatch({ type: USER_LOGIN_FAIL });
            toast.error(error.message);
        }
    };

    const verifyOtp = async (userId, otp) => {
        // console.log("funtion called ");

        dispatch({ type: USER_LOGIN_REQUEST });
        try {
            const { data } = await axios.post(backendUrl + "/api/user/verifyEmail", { userId, otp });
            if (data.success) {
                // dispatch({ type: USER_LOGIN_SUCCESS, payload: data.userData });
                dispatch({ type: USER_REGISTER_OTP_SUCCESS });
                toast.success("Login successful!");
            } else {
                dispatch({ type: USER_LOGIN_FAIL });
                toast.error(data.message);
            }
        } catch (error) {
            dispatch({ type: USER_LOGIN_FAIL });
            toast.error(error.message);
        }
    };

    const register = async (name, email, password) => {
        dispatch({ type: USER_REGISTER_REQUEST });
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });

            if (data.success) {
                dispatch({ type: USER_OTP_REQUEST });
                dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
                toast.success("OTP sent for verification!");

            } else {
                dispatch({ type: USER_REGISTER_FAIL });
                toast.error(data.message);
            }

        } catch (error) {
            dispatch({ type: USER_REGISTER_FAIL });
            toast.error(error.message);
        }
    };

    const logout = () => {
        dispatch({ type: USER_LOGOUT });
        toast.success("Logged out successfully!");
    };

    useEffect(() => {
        getMentorData();
        getCollegeData();
        if (state.verfied) {
            loadUserProfileData();
        }
    }, [state.verfied]);

    useEffect(() => {
        if (state.loged) {
            setTimeout(() => {
                logout();
                navigate("/");
            }, 2 * 60 * 60 * 1000);
        }
    }, [state.loged]);

    return (
        <AppContext.Provider value={{ ...state, login, register, logout, getMentorData, loadUserProfileData, verifyOtp, currencySymbol, backendUrl }}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider;