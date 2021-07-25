import React, { useEffect, useState } from 'react'
import Footer from '../Footer'
import GuestNav from '../Navbar/GuestNav'
import { useHistory } from 'react-router'
import Timer from '../Timer'

function RedirectPage() {
    const history = useHistory()

    setTimeout(() => {
        history.push('/home')
    }, 2000)

    return (
        <div className="page-container">
            <div className="content-wrap">
                <GuestNav />
                <br />
                <div className="col-12">
                    <Timer />
                </div>
                <div className="container">
                    <div className="text-center">Redirect Page</div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default RedirectPage

