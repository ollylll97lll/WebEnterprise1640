import React from 'react';
import './index.css';

function Footer() {
    return (
        <div className="main-footer">
            <div className="col-12">
                <div className="row align-items-start">
                    <div className="col-sm text-left mx-auto">
                        <h4>HÀ NỘI</h4>
                        <hr />
                        <ul className="list-unstyled">
                            <li>ĐẠI HỌC GREENWICH </li>
                            <li>Tòa nhà DETECH - Số 8 Tôn Thất Thuyết-P.Mỹ Đình 2-Q.Nam Từ Liêm</li>
                            <li>Điện thoại: 024.7300.2266</li>
                            <li>Hotline: 0981.558.080 | 0971.274.545</li>
                        </ul>
                    </div>
                    <div className="col-sm text-left mx-auto">
                        <h4>HỒ CHÍ MINH</h4>
                        <hr />
                        <ul className="list-unstyled">
                            <li>ĐẠI HỌC GREENWICH </li>
                            <li>CS1: Số 142-146 Phạm Phú Thứ - Phường 4 - Quận 6 (Cuối đường 3/2)</li>
                            <li>CS2: 205 Nguyễn Xí, Phường 26, Bình Thạnh.</li>
                            <li>Điện thoại: 028.7300.2266</li>
                            <li>Hotline: 0933.108.554 | 0971.294.545</li>
                        </ul>
                    </div>
                    <div className="col-sm text-left mx-auto">
                        <h4>ĐÀ NẴNG</h4>
                        <hr />
                        <ul className="list-unstyled">
                            <li>ĐẠI HỌC GREENWICH </li>
                            <li>658 Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà, Tp. Đà Nẵng</li>
                            <li>Điện thoại: 0236.730.2266</li>
                            <li>Hotline: 0934.892.687</li>
                        </ul>
                    </div>
                    <div className="col-sm text-left mx-auto">
                        <h4>CẦN THƠ</h4>
                        <hr />
                        <ul className="list-unstyled">
                            <li>ĐẠI HỌC GREENWICH </li>
                            <li>Số 160 đường 30/4, phường An phú, quận Ninh Kiều - TP. Cần Thơ</li>
                            <li>Điện thoại: 0292.3512.369</li>
                            <li>Hotline: 0968.670.804 | 0936.600.861</li>
                        </ul>
                    </div>
                </div>
                <hr />
                <div>
                    &copy;{new Date().getFullYear()} CMS Greenwich Magazine System - All Rights Reserved
                </div>
            </div>
        </div>
    )
}

export default Footer