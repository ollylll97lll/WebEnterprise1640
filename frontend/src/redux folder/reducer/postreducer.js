import { GET_POST_FAIL, GET_POST_REQUEST, GET_POST_SUCCESS, POST_LIKES_FAIL, POST_LIKES_REQUEST, POST_LIKES_SUCCESS } from "../constants/postconstants";

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


export const postLikeyReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_LIKES_REQUEST:
            return { loading: true };
        case POST_LIKES_SUCCESS:
            return { loading: false, data: action.payload };
        case POST_LIKES_FAIL:
            return { loading: false, error: action.payload };
        default: return state;
    }
}