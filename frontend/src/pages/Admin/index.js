import React from 'react'
import Footer from '../../components/Footer'
import AdminNav from '../../components/Navbar/AdminNav'
import Timer from '../../components/Timer'

function AdminPage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <AdminNav />
                <br />
                <div className="col-12">
                    <Timer />
                </div>
                <div className="text-center">AdminPage</div>
            </div>
        </div>
    )
}

export default AdminPage
