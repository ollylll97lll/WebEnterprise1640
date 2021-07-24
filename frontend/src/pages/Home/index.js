import React from 'react'
import GuestNav from '../../components/Navbar/GuestNav'

function HomePage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <GuestNav />
            </div>
            <Footer />
        </div>
    )
}

export default HomePage
