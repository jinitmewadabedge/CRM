import React from 'react'
import { NavLink } from 'react-router-dom'
import Logo from "../../assets/logo.png"
import { FaHome, FaUser, FaUserShield, FaChartBar, FaFileAlt, FaBullhorn, FaCog } from 'react-icons/fa'

const LeadNavbar = () => {
    return (
        <>
            <img src={Logo} alt="" className='img-fluid mt-3 mx-auto adminDashboardLogo' />
            <nav className="navbar navbar-expand-lg w-100">
                <button
                    className="navbar-toggler ms-2 mt-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsibleLeadNavbar"
                    aria-controls="collapsibleLeadNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="collapsibleLeadNavbar">

                    <ul className="navbar-nav d-flex flex-column justify-content-center align-items-center pt-3 mx-2 w-100">

                        <li className="nav-item w-100">
                            <NavLink
                                to="/leads/"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
                                    }`
                                }
                            >
                                <FaHome className="icon-color me-2" />
                                Leads</NavLink>
                        </li>

                        {/* <li className="nav-item w-100">
                            <div className="d-flex align-items-center justify-content-start">
                                <FaUser className="icon-color me-2" />
                                <NavLink to="/leads/all-leads" className={({ isActive }) => `nav-link ${isActive ? "fw-bold text-color" : ""}`}>All Leads</NavLink>
                            </div>
                        </li> */}
                    </ul>
                </div>
            </nav >
        </ >
    )
}

export default LeadNavbar;
