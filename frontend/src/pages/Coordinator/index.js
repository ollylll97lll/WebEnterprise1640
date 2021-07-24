import React from 'react'
import CoordinatorNav from '../../components/Navbar/CoordinatorNav'

function CoordinatorPage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <CoordinatorNav />
            </div>
            <Footer />
        </div>
    )
}

export default CoordinatorPage
