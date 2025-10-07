import { Navbar, Nav } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import Logo from "../../assets/logo.png";

const LeadNavbar = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <Navbar expand="lg" className="d-flex flex-column justify-content-start align-items-start">
            <img src={Logo} alt="Logo" className="img-fluid mt-3 mx-auto adminDashboardLogo" />
            <Navbar.Toggle aria-controls="leadNavbar" className="ms-2 mt-2" />
            <Navbar.Collapse id="leadNavbar">
                <Nav className="flex-column d-flex align-items-start justify-content-start pt-3 w-100">
                    <Nav.Link as={NavLink} to="/leads/" className="d-flex align-items-center px-2">
                        <FiUser className="me-2" />  Leads
                    </Nav.Link>
                    <button
                        onClick={handleLogout}
                        className="nav-link d-flex align-items-center px-2 btn btn-link text-danger"
                    >
                        <FiLogOut className="me-2" /> Logout
                    </button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
export default LeadNavbar;