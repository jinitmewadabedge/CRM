import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/logo_webp.webp";
import "../App.css";
import { toast } from "react-toastify";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const roleRoutes = {
    Admin: "/admin-dashboard",
    Sales: "/leads",
    Marketing: "/marketing-dashboard",
    Technical: "/technical-dashboard",
    Lead_Gen_Manager: "/leads",
    Sr_Lead_Generator: "/leads",
    Lead_Gen_Team_Lead: "/leads",
    Lead_Generator: "/leads",
    Sales_Manager: "/leads",
    Resume: "/leads"
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const userRole = sessionStorage.getItem("role") || localStorage.getItem("role");

    if (token && userRole) {
      const route = roleRoutes[userRole] || "/";
      navigate(route);
    }
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
        role,
      }, { withCredentials: true });

      const data = res.data;

      sessionStorage.removeItem("token");
      localStorage.removeItem("token");

      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.user.role);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success("Login Successfully!");
      const route = roleRoutes[data.user.role] || "/";
      navigate(route);
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login failed - please check credentials.";
      // alert(message);
      toast.error(message, {
        position: "top-right",
        autoClose: 5000
      });
      // setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        <div className="col-12 col-md-12 col-lg-6 d-flex align-items-center justify-content-center flex-column vh-100 border">
          <img src={Logo} className="img-fluid LogoImage" alt="Logo" />
          <h1 className="display-1 fw-bold">Hello!</h1>
          <p>Welcome back to the community</p>

          <form onSubmit={handleSubmit} className="w-75">

            <div className="form-floating mb-3">
              <select
                className="form-select"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Technical">Technical</option>
                <option value="Lead_Gen_Manager">Lead Gen Manager</option>
                <option value="Lead_Gen_Team_Lead">Lead Gen Team Lead</option>
                <option value="Sr_Lead_Generator">Sr Lead Generator</option>
                <option value="Lead_Generator">Lead Generator</option>
                <option value="Sales_Manager">Sales Manager</option>
                <option value="Resume">Resume</option>
              </select>
              <label htmlFor="role">Role</label>
            </div>

            <div className="form-floating mb-3 mt-3">
              <input
                type="email"
                className="form-control h-50"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="form-floating mt-3 mb-3">
              <input
                type="password"
                className="form-control"
                id="pwd"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="pwd">Password</label>
            </div>

            <div className="form-check mb-3 d-flex justify-content-between">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={(e) => setRememberMe(e.target.checked)}
                />{" "}
                Remember me
              </label>
              <NavLink
                to="/forgot-password"
                className="text-decoration-none forgot-password"
              >
                Forgot Password?
              </NavLink>
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <button
                type="submit"
                className="btn loginButton rounded-5 w-100 d-flex justify-content-center align-items-center"
                disabled={loading}
                style={{ height: "45px" }}
              >

                <div className="d-flex align-items-center">
                  {loading && <span className="loader"></span>}
                  {/* <span class="loader">Load&nbsp;ng</span> */}
                  <h6 className="mb-0">{loading ? "" : "Login"}</h6>
                </div>
              </button>
            </div>
            {errorMessage && (
              <h6 className="alert alert-danger mt-3 forgot-password text-center"><strong><i class="bi-exclamation-octagon-fill"></i> {errorMessage}</strong></h6>
            )}
          </form>
        </div>

        <div className="col-12 col-md-12 col-lg-6 d-flex justify-content-center align-items-center flex-column gap-4 vh-100 border secondBox">
          <h1 className="text-white text-center display-3">
            <span className="fw-bold Empowering">Empowering </span> Teams, <br /> Driving{" "}
            <span className="fw-bold Success">Success</span>.
          </h1>
          <p className="text-white">
            Together is beginning, Together is progress, Together is success.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
