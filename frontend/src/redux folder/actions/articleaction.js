import axios from "axios";
import { ADD_SEASON_TOPIC_FAIL, ADD_SEASON_TOPIC_REQUEST, ADD_SEASON_TOPIC_SUCCESS } from "../constants/articleconstant";

export const addseasontopic = (seasondata) => async (dispatch, getState) => {

    // get State return Redux store
    // from the store get userInfo
    // userInfo has token
    const {
        userLogin: { userInfo },
    } = getState();

    dispatch({
        type: ADD_SEASON_TOPIC_REQUEST,
        payload: {
            seasondata
        }
    });
    try {
        const { data } = await axios.post('http://localhost:5001/api/season/add_seasontopic',
            seasondata,
            {
                headers: { Authorization: `Bearer ${userInfo.accessToken}` },
            }

        )

        dispatch({
            type: ADD_SEASON_TOPIC_SUCCESS,
            payload: data
        });

    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: ADD_SEASON_TOPIC_FAIL,
            payload: message
        });
    }
}