import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk'
import { userLoginReducer } from './reducer/userreducer';

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
});

// send to the extension to view
const composeEnhance = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;
// tạo redux storage bằng cách sử dụng reducer function để lấy state mới và
// initialState để lấy state rỗng.
const store = createStore(reducer , initialState, composeEnhance(applyMiddleware(thunk)));

export default store;