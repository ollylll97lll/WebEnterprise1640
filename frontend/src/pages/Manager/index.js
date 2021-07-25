import React from 'react';
import ManagerNav from '../../components/Navbar/ManagerNav';
import Timer from '../../components/Timer';
import ManagerTab from './ManageTab';

function ManagerPage() {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <ManagerNav />
                <br />
                <div className="col-12 mb-4">
                    <Timer />
                </div>
                <h4 className="text-center">Manager Page</h4>
                <div className="col-12">
                    <ManagerTab />
                </div>
            </div>
        </div>
    )
}

export default ManagerPage