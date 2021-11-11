import { USER_DELETE_DEPARTMENT_FAIL, USER_DELETE_DEPARTMENT_REQUEST, USER_DELETE_DEPARTMENT_SUCCESS, USER_GETALL_FAIL, USER_GETALL_REQUEST, USER_GETALL_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_RECOVER_EMAIL_FAIL, USER_RECOVER_EMAIL_REQUEST, USER_RECOVER_EMAIL_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS } from "../constants/userconstants";

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true };
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
}

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true };
        case USER_REGISTER_SUCCESS:
            return { loading: false, registerUser: action.payload };
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export const userRecoverReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_RECOVER_EMAIL_REQUEST:
            return { loading: true };
        case USER_RECOVER_EMAIL_SUCCESS:
            return { loading: false, recoverData: action.payload };
        case USER_RECOVER_EMAIL_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export const userGetAllReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_GETALL_REQUEST:
            return { loading: true };
        case USER_GETALL_SUCCESS:
            return { loading: false, allUser: action.payload };
        case USER_GETALL_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
export const userDelDeptReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DELETE_DEPARTMENT_REQUEST:
            return { loading: true };
        case USER_DELETE_DEPARTMENT_SUCCESS:
            return { loading: false, response: action.payload };
        case USER_DELETE_DEPARTMENT_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

