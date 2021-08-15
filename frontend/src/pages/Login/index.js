import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../../components/Return Boxes/LoadingBox';
import MessageBox from '../../components/Return Boxes/MessageBox';
import { login } from '../../redux folder/actions/useractions';
import './index.css'

function LoginPage(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch();
    const redirect = props.location.search ? props.location.search.split('=')[1] : '/home'

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo, loading, error } = userLogin;

    const SubmitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password))
    }

    useEffect(() => {
        if (userInfo) {
            props.history.push(redirect);
        }
    }, [props.history, redirect, userInfo]);
    return (
        <div className="container-fluid">
            <div className="row no-gutter">
                <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
                <div className="col-md-8 col-lg-6">
                    <div className="login d-flex align-items-center py-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-9 col-lg-8 mx-auto">
                                    <h3 className="login-heading mb-4">Welcome to Greenwich Magazine System!</h3>
                                    <form onSubmit={SubmitHandler}>

                                        <div className="form-label-group">
                                            <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required onChange={(e) => setEmail(e.target.value)} />
                                            <label htmlFor="inputEmail">Email address</label>
                                        </div>

                                        <div className="form-label-group">
                                            <input type="password" id="inputPassword" className="form-control" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                                            <label htmlFor="inputPassword">Password</label>
                                        </div>

                                        <div className="custom-control custom-checkbox mb-3">
                                            <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                            <label className="custom-control-label" htmlFor="customCheck1">Remember password</label>
                                        </div>
                                        <button className="btn btn-lg btn-signin btn-block btn-login text-uppercase font-weight-bold mb-2" type="submit">Sign in</button>
                                        {
                                            loading && <LoadingBox/>
                                        }
                                        {
                                            error && <MessageBox variant = 'danger'>{error}</MessageBox>
                                        }
                                        <div className="text-center">
                                            <a className="small" href="/forgot">Forgot password?</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
