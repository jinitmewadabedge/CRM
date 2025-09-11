// import React from 'react'
// import { NavLink, useNavigate } from 'react-router-dom'

// const LogoutButton = () => {

//     const navigate = useNavigate();

//     const handleLogout = () => {

//         console.log("Before clear:", {
//             local: localStorage.getItem("token"),
//             session: localStorage.getItem("token"),
//         });

//         localStorage.removeItem("role");
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         sessionStorage.removeItem("role");
//         sessionStorage.removeItem("token");
//         sessionStorage.removeItem("user");

//         console.log("After clear:", {
//             local: localStorage.getItem("token"),
//             session: sessionStorage.getItem("token"),
//         });

//         navigate("/");
//     }

//     return (
//         <NavLink className={({ isActive }) =>
//             `nav-link d-flex align-items-center px-2 ${isActive ? "fw-bold text-color" : ""
//             }`
//         } onClick={handleLogout}>
//             Logout
//         </NavLink>
//     )
// }

// export default LogoutButton