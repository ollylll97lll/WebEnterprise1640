import React from 'react';
import StudentNav from '../../components/Navbar/StudentNav';
import Timer from '../../components/Timer';
import StudentTab from './StudentTab';
import './index.css'


function StudentPage() {
    
    return (
        <div className="page-container">
            <div className="content-wrap">
                <StudentNav />
                <br />
                <div className="col-12 mb-4">
                    <Timer />
                </div>
                <h4 className="text-center">Student Page</h4>
                <div className="col-12">
                    <StudentTab />
                </div>
            </div>
        </div>
    )
}

export default StudentPage