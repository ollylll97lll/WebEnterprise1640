import { RECOVER_PASS_FROM_EMAIL_FAIL, RECOVER_PASS_FROM_EMAIL_REQUEST, RECOVER_PASS_FROM_EMAIL_SUCCESS } from "../constants/recoverpasswordconstant";

export const recoverPassFromEmailReducer = (state = {}, action) => {
    switch (action.type) {
        case RECOVER_PASS_FROM_EMAIL_REQUEST:
            return { loading: true };
        case RECOVER_PASS_FROM_EMAIL_SUCCESS:
            return { loading: false, response: action.payload };
        case RECOVER_PASS_FROM_EMAIL_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}