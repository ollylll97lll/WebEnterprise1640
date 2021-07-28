import React from 'react'
import CoordinatorNav from '../../components/Navbar/CoordinatorNav'
import Timer from '../../components/Timer'
import CoordinatorTab from './CoordinatorTab'

function CoordinatorPage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <CoordinatorNav />
                <br />
                <div className="col-12 mb-4">
                    <Timer />
                </div>
                <h4 className="text-center">Coordinator Page</h4>
                <div className="col-12">
                    <CoordinatorTab />
                </div>
            </div>
        </div>
    )
}

export default CoordinatorPage
