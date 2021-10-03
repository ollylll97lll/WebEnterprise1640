import axios from "axios";
import { RECOVER_PASS_FROM_EMAIL_FAIL, RECOVER_PASS_FROM_EMAIL_REQUEST, RECOVER_PASS_FROM_EMAIL_SUCCESS } from "../constants/recoverpasswordconstant"

export const recoverpassfromemailaction = (user,token) => async (dispatch) => {
    dispatch({
        type: RECOVER_PASS_FROM_EMAIL_REQUEST,
        payload: {
            user
        }
    });
    try {
        const { data } = await axios.put('http://localhost:5001/api/user/sendemailforgotpassword',
            user,
            {
                headers: { Authorization: `Bearer ${token}` },
            }

        )

        dispatch({
            type: RECOVER_PASS_FROM_EMAIL_SUCCESS,
            payload: data
        });

    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: RECOVER_PASS_FROM_EMAIL_FAIL,
            payload: message
        });
    }
}