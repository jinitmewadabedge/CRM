import { Navbar, Nav } from "react-bootstrap";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import axios from "axios";
import Logo from "../../assets/logo.png";
import { useEffect } from "react";
import { ModeToggle } from "../../components/mode-toggle";
import { FaMoon } from "react-icons/fa";

const LeadNavbar = () => {

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const BASE_URL = import.meta.env.VITE_BACKEND_URL;
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");

            if (token) {
                await axios.post(
                    `${BASE_URL}/api/auth/logout`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }
        } catch (error) {
            console.error("Logout error:", error.response?.data || error.message);
        } finally {

            localStorage.clear();
            sessionStorage.clear();

            navigate("/");
        }
    };


    return (
        <Navbar expand="lg" className="d-flex flex-column vh-100 align-items-start">
            <img src={Logo} alt="Logo" rel="preload" className="img-fluid mt-3 mx-auto adminDashboardLogo" fetchPriority="high" />
            <Navbar.Toggle aria-controls="leadNavbar" className="ms-2 mt-2" />
            <Navbar.Collapse id="leadNavbar">
                <Nav className="flex-column d-flex align-items-start justify-content-between pt-3 w-100 h-100">
                    <div>
                        <Nav.Link as={NavLink} to="/leads/" className="d-flex align-items-center px-2">
                            <FiUser className="me-2" />  Leads
                        </Nav.Link>

                        <button
                            onClick={handleLogout}
                            className="nav-link d-flex align-items-center px-2 btn btn-link text-danger"
                        >
                            <FiLogOut className="me-2" /> Logout
                        </button>
                    </div>

                    <div className="w-100 d-flex justify-content-end mb-5">
                        <div className="card rounded-4 cardBG">
                            <div className="d-flex justify-content-center align-items-center flex-column m-3">
                                <FaMoon size={30} color="white" className="mt-3"/>
                                <h5 className="text-center mt-3 text-white fw-bold">Dark Experience</h5>
                                <p className="text-center text-white mb-5">
                                    Switch to a distraction-free, eye-friendly interface
                                </p>
                                <ModeToggle variant="button"/>
                            </div>
                        </div>
                    </div>

                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
export default LeadNavbar;