import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { recover } from '../../../redux folder/actions/useractions';
import '../index.css'
import LoadingBox from '../../../components/Return Boxes/LoadingBox';
import MessageBox from '../../../components/Return Boxes/MessageBox';


function ForgotPassword(props) {
    const dispatch = useDispatch();
    const [recoverEmail, setRecoverEmail] = useState('');
    const userRecoverEmail = useSelector(state => state.userRecoverEmail);
    const { recoverData, loading, error } = userRecoverEmail;

    const submitRecover = (e) => {
        e.preventDefault();
        dispatch(recover(recoverEmail))
    }
    useEffect(() => {
        if (recoverData) {
            alert('Email xác nhận đã gửi đi thành công. Đang chuyển hướng về trang chủ...')
            props.history.push('/home');
        }
    }, [props.history, recoverData])
    return (
        <div class="container-fluid">
            <div class="row no-gutter">
                <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
                <div class="col-md-8 col-lg-6">
                    <div class="login d-flex align-items-center py-5">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-9 col-lg-8 mx-auto">
                                    <h3 class="login-heading mb-4">Welcome to Greenwich Contribution Forum!</h3>
                                    <h5 class="login-heading mb-4">Recover your account</h5>
                                    <form onSubmit={(e) => submitRecover(e)} >
                                        <div class="form-label-group">
                                            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus onChange={(e) => setRecoverEmail(e.target.value)} />
                                            <label for="inputEmail" style={{ color: 'lightgray' }} >Please enter your email address</label>
                                        </div>

                                        {
                                            loading && <LoadingBox />
                                        }
                                        {
                                            error && <MessageBox variant='danger'>{error}</MessageBox>
                                        }

                                        <button class="btn btn-lg btn-signin btn-block btn-login text-uppercase font-weight-bold mb-2" type="submit">Send Email</button>
                                        <div class="text-center">
                                            <span class="medium"> Remember your password ? <a href="/">Sign In</a></span>
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

export default ForgotPassword
