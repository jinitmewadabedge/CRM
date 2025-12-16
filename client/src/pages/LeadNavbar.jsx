import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from "../../assets/logo.png"
import { FaHome, FaUser, FaUserShield, FaChartBar, FaFileAlt, FaBullhorn, FaCog } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { ModeToggle } from '../components/mode-toggle'

const LeadNavbar = ({notificationCount, setNotificationCount}) => {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("role");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("role");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/");
    }
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
                                onClick={() => setNotificationCount?.(0)}
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
                                    }`
                                }>
                                <FaHome className="icon-color me-2" />
                                Leads</NavLink>
                        </li>
                        <li className="nav-item w-100">
                            <button onClick={handleLogout}
                                className="nav-link d-flex align-items-center px-2 btn btn-link text-danger">
                                <FiLogOut className="me-2" />
                                Logout
                            </button>
                        </li>
                     
                    </ul>
                </div>
            </nav >
        </ >
    )
}

export default LeadNavbar;
