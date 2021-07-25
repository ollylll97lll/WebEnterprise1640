import React from 'react'
import ManagerNav from '../../components/Navbar/ManagerNav'
import Timer from '../../components/Timer'
import Footer from '../../components/Footer'

function ManagerPage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <ManagerNav />
                <br />
                <div className="col-12">
                    <Timer />
                </div>
                <div className="container">
                    <div className="text-center">ManagerPage</div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ManagerPage