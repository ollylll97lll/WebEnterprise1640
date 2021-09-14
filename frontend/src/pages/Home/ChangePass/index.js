import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../../../components/Return Boxes/LoadingBox';
import MessageBox from '../../../components/Return Boxes/MessageBox';
import { recoverpassfromemailaction } from '../../../redux folder/actions/recoverpassactions';
import jwt_decode from 'jwt-decode';

function ChangePassword(props) {
    const [newPassword, setNewPassword] = useState('');
    const [reEnterNewPassword, setReEnterNewPassword] = useState('');

    const userRecoverpassfromemail = useSelector(state => state.userRecoverpassfromemail);
    const { response, loading, error } = userRecoverpassfromemail;
    const dispatch = useDispatch();
    let token = window.location.href.split('recoverpass/')[1] ? window.location.href.split('recoverpass/')[1] : null;

    const submitRecover = (e) => {
        e.preventDefault();
        // console.log('token:', token)
        if (newPassword !== reEnterNewPassword) {
            alert('Re-enter password. They are not match !!!')
            return;
        }
        else if (token == null && token == undefined) {
            alert('token cannot be founded ? please try again')
            props.history.push('/forgot')
            return;
        }
        else {
            // lay userid ra tu token
            let userId = jwt_decode(token)._id;
            console.log('userId:', userId);
            dispatch(recoverpassfromemailaction({newPassword,userId},token));
            return;
        }
    }

    useEffect(() => {
        if (response) {
            alert(response.message);
            props.history.push('/home')
        }
    }, [response, loading, props.history])

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
                                    <h4 class="login-heading mb-4">Set your new password</h4>
                                    <form onSubmit={(e) => submitRecover(e)} >
                                        <div class="form-label-group">
                                            <input type="password" id="newPassword" class="form-control" placeholder="Insert your new password" required autofocus onChange={(e) => setNewPassword(e.target.value)} />
                                            <label for="newPassword" style={{ color: 'lightgray' }} >Insert your new password</label>
                                        </div>

                                        <div class="form-label-group">
                                            <input type="password" id="reEnterNewPassword" class="form-control" placeholder="Confirm your new password" required onChange={(e) => setReEnterNewPassword(e.target.value)} />
                                            <label for="reEnterNewPassword" style={{ color: 'lightgray' }} >Confirm your new password</label>
                                        </div>

                                        {
                                            loading && <LoadingBox />
                                        }
                                        {
                                            error && <MessageBox variant='danger'>{error}</MessageBox>
                                        }

                                        <button class="btn btn-lg btn-signin btn-block btn-login text-uppercase font-weight-bold mb-2" type="submit">Update your Password</button>
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

export default ChangePassword
