import React from 'react'
import CoordinatorNav from '../../components/Navbar/CoordinatorNav'
import Timer from '../../components/Timer'
import Footer from '../../components/Footer'

function CoordinatorPage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <CoordinatorNav />
                <br />
                <div className="col-12">
                    <Timer />
                </div>
                <div className="container">
                    <div className="text-center">CoordinatorPage</div>
                </div>
            </div>
        </div>
    )
}

export default CoordinatorPage
