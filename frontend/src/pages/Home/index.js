import React from 'react'
import GuestNav from '../../components/Navbar/GuestNav'
import Timer from '../../components/Timer'
import Footer from '../../components/Footer'

function HomePage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <GuestNav />
                <br />
                <div className="col-12">
                    <Timer />
                </div>
                <h4 className="text-center">Home Page</h4>
                <div className="col-12">

                </div>
            </div>
            <Footer />
        </div>
    )
}

export default HomePage
