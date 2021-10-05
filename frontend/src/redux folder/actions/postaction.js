import axios from "axios";
import {GET_POST_FAIL, GET_POST_REQUEST, GET_POST_SUCCESS} from "../constants/postconstants"
export const getAllPosts = ({categoryId = '', title = '', department = '', shownby = '', pageNumber = ''}) => async(dispatch) => {
    dispatch({
        type: GET_POST_REQUEST
    });

    try {
        const {data} = await axios.get(
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