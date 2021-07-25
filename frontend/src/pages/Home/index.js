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
                <br />
                <div className="container">
                    <div className="text-center">HomePage</div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default HomePage
