import React from 'react'
import LeadNavbar from '../../components/Lead/LeadNavbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'

const LeadDashboard = () => {
    return (
        <div className='container-fluid LeadBGColor p-4'>
            <div className='row h-100'>
                <div className="col-12 col-md-4 col-lg-2 adminDashboardBG bg-white shadow-sm">
                    <div className="rounded-3 h-100">
                        <div className="d-flex justify-content-center align-items-center flex-column mt-2">
                            {/* <LeadNavbar /> */}
                            <LeadNavbar/>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-8 col-lg-10">
                    <Outlet />
                </div>
                <div className='mt-3 p-0 bg-light rounded-3'>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default LeadDashboard