import React from 'react'
import './box.css';
export default function LoadingBox() {
    return (
        <div style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <i className="fa fa-spinner fa-spin"></i>
            <span>Loading...</span>
        </div>
    )
}
