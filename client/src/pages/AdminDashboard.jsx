import React from 'react'
import AdminNavbar from './AdminNavbar'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
    return (
        <div className='container-fluid LeadBGColor p-4'>
            <div className="row h-100">
                <div className="col-12 col-md-4 col-lg-2 BGColor shadow-sm">
                    <div className="rounded-3 h-100">
                        <div className="d-flex justify-content-center align-items-center flex-column mt-2">
                            <AdminNavbar />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-8 col-lg-10">
                    <Outlet />
                </div>
            </div>
        </div >
    )
}

export default AdminDashboard