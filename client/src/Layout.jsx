import React from 'react'
import { useLocation } from 'react-router-dom'
import AdminNavbar from './pages/AdminNavbar'
import LeadNavbar from './components/Lead/LeadNavbar'

const Layout = ({ children }) => {

    const location = useLocation();

    const renderNavbar = () => {

        if (location.pathname.startsWith("/admin-dashboard")) {
            return <AdminNavbar />
        }

        if (location.pathname.startsWith("/leads")) {
            return <LeadNavbar />
        }
        return null;
    }
    return (
        <div className='app-layout'>
            {renderNavbar()}
            {children}
        </div>
    )
}

export default Layout