import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { addSeasonTopicReducer } from './reducer/articlereducer';
import { recoverPassFromEmailReducer } from './reducer/recoverpasswordreducer';
import { userLoginReducer, userRecoverReducer, userRegisterReducer } from './reducer/userreducer';

const initialState = {
    userLogin: {
        userInfo: localStorage.getItem('userInfo')
            ?
            JSON.parse(localStorage.getItem('userInfo'))
            : null,
    },
};
// reducer nhận state đang có và action gửi về (đăng nhập, đăng xuất...)
const reducer =  combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userRecoverEmail: userRecoverReducer,
    userRecoverpassfromemail: recoverPassFromEmailReducer,
    addSeasonTopic: addSeasonTopicReducer,
});

// send to the extension to view
const composeEnhance = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// tạo redux storage bằng cách sử dụng reducer function để lấy state mới và
// initialState để lấy state rỗng.
const store = createStore(reducer , initialState, composeEnhance(applyMiddleware(thunk)));

export default store;