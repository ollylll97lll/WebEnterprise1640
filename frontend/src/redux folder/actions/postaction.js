import axios from "axios";
import { GET_POST_FAIL, GET_POST_REQUEST, GET_POST_SUCCESS, POST_LIKES_FAIL, POST_LIKES_REQUEST, POST_LIKES_SUCCESS } from "../constants/postconstants";
export const getAllPosts = ({ categoryId = '', title = '', department = '', shownby = '', pageNumber = '' }) => async (dispatch) => {
    dispatch({
        type: GET_POST_REQUEST
    });

    try {
        const { data } = await axios.get(
            `http://localhost:5001/api/post/getall?pageNumber=${pageNumber}&categoryId=${categoryId}&title=${title}&department=${department}&shownby=${shownby}`);
        dispatch({
            type: GET_POST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: GET_POST_FAIL,
            payload: error.message
        })
    }
}


export const postLikey = ({ islike, isdislike, reaction, postId }) => async (dispatch, getState) => {

    // get State return Redux store
    // from the store get userInfo
    // userInfo has token
    const {
        userLogin: { userInfo },
    } = getState();

    dispatch({
        type: POST_LIKES_REQUEST,
        payload: { islike, isdislike, reaction, postId }
    });

    try {
        const { data } = await axios.post(
            `http://localhost:5001/api/post/likey/${postId}`,
            { islike, isdislike, reaction }
            , { headers: { Authorization: `Bearer ${userInfo.accessToken}` } }
        );

        dispatch({
            type: POST_LIKES_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: POST_LIKES_FAIL,
            payload: error.message
        })
    }

}