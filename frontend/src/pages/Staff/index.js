import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StudentNav from '../../components/Navbar/StudentNav';
import Timer from '../../components/Timer';
import './index.css';
import StaffTab from './StaffTab';


function StaffPage(props) {
    const dispatch = useDispatch();
    const redirect = props.location.search ? props.location.search.split('=')[1] : '/home'

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;
    let userRole = userInfo.userInfo.role;

    useEffect(() => {
        if (userRole !== 'staff') {
            alert('You are not authorize to access this page.')
            props.history.push(redirect);
        }
    }, [props.history, userInfo])

    return (
        <div className="page-container">
            <div className="content-wrap">
                <StudentNav />
                <br />
                <div className="col-12 mb-4">
                    <Timer />
                </div>
                <h4 className="text-center">Staff Page</h4>
                <div className="col-12">
                    <StaffTab />
                </div>
            </div>
        </div>
    )
}

export default StaffPage