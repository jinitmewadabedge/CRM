import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/logo.png";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const roleRoutes = {
    Admin: "/admin-dashboard",
    Sales: "/sales-dashboard",
    Marketing: "/marketing-dashboard",
    Technical: "/technical-dashboard",
    Lead_Gen_Manager: "/leads",
    Sr_Lead_Generator: "/leads",
    Lead_Gen_Team_Lead: "/leads",
    Lead_Generator: "/leads"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
        role,
      });

      const data = res.data;

      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.user.role);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      const route = roleRoutes[data.user.role] || "/";
      navigate(route);
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      alert(message);
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

            <button
              type="submit"
              className="btn btn-dark rounded-5 w-100"
            >
              Login
            </button>
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
