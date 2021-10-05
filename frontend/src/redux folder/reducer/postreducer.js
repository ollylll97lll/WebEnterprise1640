import { GET_POST_FAIL, GET_POST_REQUEST, GET_POST_SUCCESS } from "../constants/postconstants";

export const getPostReducer = (state = { loading: true, posts: [] }, action) => {
    switch (action.type) {
        case GET_POST_REQUEST:
            return { loading: true };
        case GET_POST_SUCCESS:
            return { loading: false, posts: action.payload.posts, page: action.payload.page, pages: action.payload.pages };
        case GET_POST_FAIL:
            return { loading: false, error: action.payload };
        default: return state;
    }
}