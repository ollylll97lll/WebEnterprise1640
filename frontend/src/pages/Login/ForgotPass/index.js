import React from 'react'
import '../index.css'

function ForgotPassword() {
    return (
        <div class="container-fluid">
            <div class="row no-gutter">
                <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
                <div class="col-md-8 col-lg-6">
                    <div class="login d-flex align-items-center py-5">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-9 col-lg-8 mx-auto">
                                    <h3 class="login-heading mb-4">Welcome to Greenwich Magazine System!</h3>
                                    <h4 class="login-heading mb-4">Recovery your password</h4>
                                    <form>
                                        <div class="form-label-group">
                                            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus />
                                            <label for="inputEmail">Email address</label>
                                        </div>
                                        <button class="btn btn-lg btn-signin btn-block btn-login text-uppercase font-weight-bold mb-2" type="submit">Send Email</button>
                                        <div class="text-center">
                                            <a class="small" href="/">Return to Sign In</a></div>
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
