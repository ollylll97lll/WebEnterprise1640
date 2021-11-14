import React from 'react'
import { useLocation } from 'react-router'
import CoordinatorNav from '../../components/Navbar/CoordinatorNav'
import ManagerNav from '../../components/Navbar/ManagerNav'
import StudentNav from '../../components/Navbar/StudentNav'
import Timer from '../../components/Timer'
import ViewDetailTab from './ViewDetailTab'

function ViewDetails() {
    const location = useLocation()
    return (
        <div className="page-container">
            <div className="content-wrap">
                {location.state.role.toLowerCase() !== "staff" ?
                    location.state.role.toLowerCase() !== "coordinator" ? <ManagerNav /> : <CoordinatorNav /> : <StudentNav />
                }
                <br />
                <div className="col-12 mb-4">
                    <Timer />
                </div>
                <h4 className="text-center">View Details Page</h4>
                <div className="col-12">
                    <ViewDetailTab />
                </div>
            </div>
        </div>
    )
}

export default ViewDetails
