import React from 'react'
import StudentNav from '../../components/Navbar/StudentNav'
import Timer from '../../components/Timer'
import ViewDetailTab from './ViewDetailTab'

function ViewDetails() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <StudentNav />
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
