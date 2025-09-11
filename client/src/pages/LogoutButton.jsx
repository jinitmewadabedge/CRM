import React from 'react'
import { useNavigate } from 'react-router-dom'

const LogoutButton = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();

        navigate("/");
    }

    return (
        <button className={({ isActive }) =>
            `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
            }`
        } onClick={handleLogout}>
            Logout
        </button>
    )
}

export default LogoutButton