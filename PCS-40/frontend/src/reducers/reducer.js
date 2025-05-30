import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_OTP_REQUEST,
    USER_REGISTER_FAIL,
    USER_REGISTER_OTP_FAIL,
    USER_REGISTER_OTP_SUCCESS,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
} from "../constants/userConstants";
// Import action types/constants from userConstants.js file

// Reducer for handling user login actions
export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        // When user login request is initiated, set loading to true
        case USER_LOGIN_REQUEST:
            return { loading: true };

        // When user login is successful, set loading to false and update user information
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };

        // When user login fails, set loading to false and update error message
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };

        // When user logs out, clear user information
        case USER_LOGOUT:
            return {};

        // Return current state by default
        default:
            return state;
    }
}

// Reducer for handling user registration actions
export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        // When user registration request is initiated, set loading to true
        case USER_REGISTER_REQUEST:
            return { loading: true };

        // When user registration is successful, set loading to false and update user information
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload };

        // When user registration fails, set loading to false and update error message
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };

        // Return current state by default
        default:
            return state;
    }
}

export const userOtpReducer = (state = {}, action) => {
    switch (action.type) {
        // When user login request is initiated, set loading to true
        case USER_OTP_REQUEST:
            return { loading: true };

        // When user login is successful, set loading to false and update user information
        case USER_REGISTER_OTP_SUCCESS:
            return { loading: false, userInfo: action.payload };

        // When user login fails, set loading to false and update error message
        case USER_REGISTER_OTP_FAIL:
            return { loading: false, error: action.payload };

        // Return current state by default
        default:
            return state;
    }
}
