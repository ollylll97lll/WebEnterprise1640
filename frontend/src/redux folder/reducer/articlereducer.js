import { ADD_SEASON_TOPIC_FAIL, ADD_SEASON_TOPIC_REQUEST, ADD_SEASON_TOPIC_SUCCESS } from "../constants/articleconstant";

export const addSeasonTopicReducer = (state = {}, action) =>{
 switch(action.type){
    case ADD_SEASON_TOPIC_REQUEST:
        return { loading: true };
    case ADD_SEASON_TOPIC_SUCCESS:
        return { loading: false, response: action.payload };
    case ADD_SEASON_TOPIC_FAIL:
        return { loading: false, error: action.payload };
    default:
        return state;
 }
}