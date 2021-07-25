import React from 'react'
import Timer from '../../components/Timer'
import Footer from '../../components/Footer'
import StudentNav from '../../components/Navbar/StudentNav'

function StudentPage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <StudentNav />
                <br />
                <div className="col-12">
                    <Timer />
                </div>
                <div className="container">
                    <div className="text-center">Student Page</div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default StudentPage