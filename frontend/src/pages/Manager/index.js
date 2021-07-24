import React from 'react'
import ManagerNav from '../../components/Navbar/ManagerNav'

function ManagerPage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <ManagerNav />
            </div>
            <Footer />
        </div>
    )
}

export default ManagerPage