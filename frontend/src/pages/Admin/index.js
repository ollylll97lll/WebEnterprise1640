import React from 'react'
import AdminNav from '../../components/Navbar/AdminNav'
import Timer from '../../components/Timer'
import AdminTab from './AdminTab'

function AdminPage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <AdminNav />
                <br />
                <div className="col-12 mb-4">
                    <Timer />
                </div>
                <h4 className="text-center">Admin Page</h4>
                <div className="col-12">
                    <AdminTab />
                </div>
            </div>
        </div>
    )
}

export default AdminPage
