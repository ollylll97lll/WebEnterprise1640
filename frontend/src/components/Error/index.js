import React from 'react'
import Footer from '../Footer'
import GuestNav from '../Navbar/GuestNav'
import Timer from '../Timer'
function Error() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <GuestNav />
                <br />
                <div className="col-12">
                    <Timer />
                </div>
                <div className="container">
                    <div className="text-center">Error Page</div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default Error