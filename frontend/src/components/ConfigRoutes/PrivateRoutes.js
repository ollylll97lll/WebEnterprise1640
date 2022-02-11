import jwtDecode from 'jwt-decode';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { signout } from '../../redux folder/actions/useractions';

export default function PrivateRoute({ component: Component, ...rest }) {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const accessToken = userInfo ? userInfo.accessToken : null;
  const decoded = accessToken ? jwtDecode(accessToken) : null;
  const dispatch = useDispatch();
  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo && moment(decoded?.exp * 1000) > moment() ?
          (
            <Component {...props}></Component>
          )
          :
          (
            <Redirect to="/7265646972656374746f6c6f676f7574"></Redirect>
          )
      }
    ></Route >
  );
}