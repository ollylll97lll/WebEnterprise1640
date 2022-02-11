import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect, useHistory } from 'react-router';
import { signout } from '../../redux folder/actions/useractions'

function RedirectPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        dispatch(signout());
        setTimeout( () => {
            history.push('/');
        },2000)
    }, [])

    return (
        <div className="page-container">
            <h1>...You are being redirect to login page. Please hold tight</h1>
        </div>
    )
}

export default RedirectPage

