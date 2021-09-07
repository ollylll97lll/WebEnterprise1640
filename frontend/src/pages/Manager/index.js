import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ManagerNav from '../../components/Navbar/ManagerNav';
import Timer from '../../components/Timer';
import ManagerTab from './ManageTab';

function ManagerPage(props) {
    const redirect = props.location.search ? props.location.search.split('=')[1] : '/home'
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;
    let userRole = userInfo.userInfo.role;
    useEffect(() => {
        if (userRole !== 'manager') {
            alert('You are not authorize to access this page.')
            props.history.push(redirect);
        }
    }, [props.history, userInfo])
    return (
        <div className="page-container">
            <div className="content-wrap">
                <ManagerNav />
                <br />
                <div className="col-12 mb-4">
                    <Timer />
                </div>
                <h4 className="text-center">Manager Page</h4>
                <div className="col-12">
                    <ManagerTab />
                </div>
            </div>
        </div>
    )
}

export default ManagerPage