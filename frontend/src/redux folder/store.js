import {createStore} from 'redux';

const initialState = {};
// reducer nhận state đang có và action gửi về (đăng nhập, đăng xuất...)
const reducer = (state, action) => {
    return {user: ""};
}

// tạo redux storage bằng cách sử dụng reducer function để lấy state mới và
// initialState để lấy state rỗng.
const store = createStore(reducer , initialState);

export default store;