import Axios from 'axios'
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS } from '../constants/userconstants'

export const login = (email, password) => async (dispatch) => {
    dispatch({
        type: USER_LOGIN_REQUEST,
        payload: {
            email,
            password
        }
    });
    try {
        const { data } = await Axios.post(`http://localhost:5001/api/auth/login`, { email, password });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}

export const signout = () => (dispatch) => {
    // when user logout clear the local storage.
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
}

// REGISTER

export const register = ({email,password,faculty,role}) => async (dispatch) => {
    dispatch({
        type: USER_REGISTER_REQUEST,
        payload: {
            email,
            password,
            faculty,
            role
        }
    });

    try {
        const { data } = await Axios.post('http://localhost:5001/api/auth/register', { email, password, faculty, role });
        // create account & login w the account & redirect to the history page.
        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL, payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}