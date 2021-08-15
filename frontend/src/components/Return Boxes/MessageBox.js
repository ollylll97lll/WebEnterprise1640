import React from 'react'
import './box.css';
export default function MessageBox(props) {
    return (
        <div style={{display:"block !important"}}>
        <div className= {`alert alert-${props.variant || 'info'}`}>
            {props.children}
        </div></div>
    )
}
