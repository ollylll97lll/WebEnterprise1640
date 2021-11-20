import React, { useState } from 'react'
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../../components/Return Boxes/LoadingBox';
import MessageBox from '../../components/Return Boxes/MessageBox';
import { login } from '../../redux folder/actions/useractions';
import './index.css'

function LoginPage(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [checkbox, setCheckBox] = useState(false)

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

    useEffect(() => {
        setEmail(localStorage.getItem('email'));
        setPassword(localStorage.getItem('password'));
        setCheckBox(localStorage.getItem('checkbox'))
        console.log('setdata')
    }, [window.onload])

    function rememberMe(e) {
        const checkbox = document.getElementById('rememberMe');
        if (checkbox.checked == true) {
            setCheckBox(true);
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            localStorage.setItem('checkbox',true);
        }
        else {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            localStorage.removeItem('checkbox');
            setCheckBox(false)
        }
    }
    return (
        <div className="container-fluid">
            <div className="row no-gutter">
                <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
                <div className="col-md-8 col-lg-6">
                    <div className="login d-flex align-items-center py-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-9 col-lg-8 mx-auto">
                                    <h3 className="login-heading mb-4" style={{ userSelect: 'none' }}>Welcome to Greenwich Contribution Forum!</h3>
                                    <form onSubmit={SubmitHandler}>

                                        <div className="form-label-group">
                                            <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                            <label htmlFor="inputEmail">Email address</label>
                                        </div>

                                        <div className="form-label-group">
                                            <input type="password" id="inputPassword" className="form-control" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <label htmlFor="inputPassword">Password</label>
                                        </div>

                                        <div className="custom-control custom-checkbox mb-3" style={{ userSelect: 'none' }}>
                                            <input type="checkbox" className="custom-control-input" id="rememberMe" checked={checkbox} onClick={(e) => rememberMe(e)} />
                                            <label className="custom-control-label" htmlFor="rememberMe" >Remember password</label>
                                        </div>
                                        <Button className="btn btn-lg btn-signin btn-block btn-login text-uppercase font-weight-bold mb-2" type="submit">Sign in</Button>
                                        {
                                            loading && <LoadingBox />
                                        }
                                        {
                                            error && <MessageBox variant='danger'>{error}</MessageBox>
                                        }
                                        <div className="text-center">
                                            <a className="small" href="/forgot" style={{ userSelect: 'none' }}>Forgot password?</a>
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
