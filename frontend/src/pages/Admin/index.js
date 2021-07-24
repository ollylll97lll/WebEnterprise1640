import React from 'react'
import AdminNav from '../../components/Navbar/AdminNav'
import Timer from '../../components/Timer'

function AdminPage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <AdminNav />
                <br />
                <Timer />
            </div>
            <Footer />
        </div>
    )
}

export default AdminPage
