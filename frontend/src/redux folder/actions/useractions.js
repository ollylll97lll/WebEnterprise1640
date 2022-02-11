import Axios from 'axios'
import { USER_DELETE_DEPARTMENT_FAIL, USER_DELETE_DEPARTMENT_REQUEST, USER_DELETE_DEPARTMENT_SUCCESS, USER_GETALL_FAIL, USER_GETALL_REQUEST, USER_GETALL_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_RECOVER_EMAIL_FAIL, USER_RECOVER_EMAIL_REQUEST, USER_RECOVER_EMAIL_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS } from '../constants/userconstants'

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

export const register = ({ email, password, department, departmentId, role }) => async (dispatch) => {
    dispatch({
        type: USER_REGISTER_REQUEST,
        payload: {
            email,
            password,
            department,
            departmentId,
            role
        }
    });

    try {
        const { data } = await Axios.post('http://localhost:5001/api/auth/register', { email, password, department, departmentId, role });
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

// RECOVER-PASSWORD

export const recover = (email) => async (dispatch) => {
    dispatch({
        type: USER_RECOVER_EMAIL_REQUEST,
        payload: {
            email,
        }
    });

    try {
        const { data } = await Axios.post('http://localhost:5001/api/user/sendemailforgotpassword', { email });
        dispatch({ type: USER_RECOVER_EMAIL_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: USER_RECOVER_EMAIL_FAIL, payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

//  GETALL

export const getallUser = ({ department = '', role = '', pageNumber = '' }) => async (dispatch) => {
    dispatch({
        type: USER_GETALL_REQUEST
    });

    try {
        const { data } = await Axios.get(`http://localhost:5001/api/user/getall?department=${department}&role=${role}&pageNumber=${pageNumber}`);
        dispatch({ type: USER_GETALL_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: USER_GETALL_FAIL, payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

export const deleteDepartment = ({ departmentId, token }) => async (dispatch) => {
    dispatch({
        type: USER_DELETE_DEPARTMENT_REQUEST,
        payload: { departmentId, token }
    });

    try {
        const { data } = await Axios.delete(`http://localhost:5001/api/post/delDepartment`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    departmentId: departmentId
                }
            }
        );
        dispatch({ type: USER_DELETE_DEPARTMENT_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: USER_DELETE_DEPARTMENT_FAIL, payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}