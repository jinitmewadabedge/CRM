import React from "react";
import Logo from '../assets/logo.png'
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaUser,
    FaUserShield,
    FaChartBar,
    FaFileAlt,
    FaBullhorn,
    FaCog,
} from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';


const AdminNavbar = () => {
    return (
        <>
            <img src={Logo} className='img-fluid mt-3 mx-auto adminDashboardLogo' alt="" />
            <nav className="navbar navbar-expand-lg w-100">

                <button
                    className="navbar-toggler ms-2 mt-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsibleAdminNavbar"
                    aria-controls="collapsibleAdminNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse w-100"
                    id="collapsibleAdminNavbar"
                >
                    <ul className="navbar-nav d-flex flex-column justify-content-center align-items-center pt-3 mx-2 w-100">
                        <li className="nav-item w-100">
                            <NavLink
                                to="/admin-dashboard/"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
                                    }`
                                }
                            >
                                <FaHome className="me-2" />
                                Home
                            </NavLink>
                        </li>

                        <li className="nav-item w-100">
                            <NavLink
                                to="/admin-dashboard/manage-users"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
                                    }`
                                }
                            >
                                <FaUser className="me-2" />
                                Manage Users
                            </NavLink>
                        </li>

                        <li className="nav-item w-100">
                            <NavLink
                                to="/admin-dashboard/roles-permission"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
                                    }`
                                }
                            >
                                <FaUserShield className="me-2" />
                                Roles & Permission
                            </NavLink>
                        </li>

                        <li className="nav-item w-100">
                            <NavLink
                                to="/admin-dashboard/department-report"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
                                    }`
                                }
                            >
                                <FaChartBar className="me-2" />
                                Department Reports
                            </NavLink>
                        </li>

                        <li className="nav-item w-100">
                            <NavLink
                                to="/admin-dashboard/company-polices"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
                                    }`
                                }
                            >
                                <FaFileAlt className="me-2" />
                                Company Policies
                            </NavLink>
                        </li>

                        <li className="nav-item w-100">
                            <NavLink
                                to="/admin-dashboard/announcements"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
                                    }`
                                }
                            >
                                <FaBullhorn className="me-2" />
                                Announcements
                            </NavLink>
                        </li>

                        <li className="nav-item w-100">
                            <NavLink
                                to="/admin-dashboard/settings"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
                                    }`
                                }
                            >
                                <FaCog className="me-2" />
                                Settings
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default AdminNavbar;
