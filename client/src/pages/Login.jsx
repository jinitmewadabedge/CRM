import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/logo_webp.webp";
import "../App.css";
"use client";
import { TextAnimate } from "../registry/magicui/text-animate";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Lead_Hero from "../assets/lead_hero_image.jpg"
import lead_hero_img from "../assets/lead_img.jpg"
import lead_img_1 from "../assets/lead_img_1.png"
import lead_img_1_BR from "../assets/lead_img_1_BR.png"
import lead_img_2 from "../assets/lead_img_2.png"
import { ModeToggle } from "../components/mode-toggle";
import { useTheme } from "../components/themeProvider";
import { socket } from "../socket"

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const { setTheme } = useTheme();

  const roleRoutes = {
    Admin: "/admin-dashboard",
    Sales: "/leads",
    Marketing: "/leads",
    Technical: "/technical-dashboard",
    Lead_Gen_Manager: "/leads",
    Sr_Lead_Generator: "/leads",
    Lead_Gen_Team_Lead: "/leads",
    Lead_Generator: "/leads",
    Sales_Manager: "/leads",
    Resume: "/leads",
    Recruiter: "/leads"
  };

  useEffect(() => {
    setTheme("light");
  }, []);

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
      console.log("Login Response Data:", data);

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

      const loggedInUser = data.user;

      socket.connect();

      console.log("Socket Registration:", loggedInUser._id, loggedInUser.role);

      toast.success("Login Successfully!");

      socket.emit("register", {
        userId: loggedInUser._id,
        role: loggedInUser.role
      });

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
    <div className="container-fluid loginPage">
      <div className="row">

        <div className="col-12 col-md-12 col-lg-6 d-flex align-items-center justify-content-center flex-column vh-100 position-relative">
          <img src={Logo} className="img-fluid LogoImage logo-top" alt="Logo" />
          <h1 className="display-1 fw-bold">Hello!</h1>
          <p className="greenColor">Welcome back to the community</p>

          <form onSubmit={handleSubmit} className="w-75">

            <div className="form-floating mb-3">
              <select
                className="form-select loginPageForm"
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
                <option value="Recruiter">Recruiter</option>
              </select>
              <label htmlFor="role">Role</label>
            </div>

            <div className="form-floating mb-3 mt-3">
              <input
                type="email"
                className="form-control h-50 loginPageForm"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-floating mt-3 mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control loginPageForm pe-5"
                id="pwd"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="pwd">Password</label>

              <span
                role="button"
                aria-label={showPassword ? "Hide Password" : "Show Password"}
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{ cursor: "pointer", zIndex: 5 }}
              >
                {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/> }
              </span>
            </div>

            <div className="form-check mb-3 d-flex justify-content-between">
              <label className="form-check-label">
                <input
                  className="form-check-input loginCheckbox"
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
                  <h6 className="mb-0">{loading ? "" : "Login"}</h6>
                </div>
              </button>
            </div>
            {errorMessage && (
              <h6 className="alert alert-danger mt-3 forgot-password text-center"><strong><i class="bi-exclamation-octagon-fill"></i> {errorMessage}</strong></h6>
            )}
          </form>

        </div>

        <div className="col-12 col-md-12 col-lg-6 d-none d-lg-flex justify-content-start align-items-center flex-column vh-100 position-relative overflow-hidden secondDiv">

          <img
            src={lead_img_1}
            className="img-fluid lead-img-animate"
            alt="Lead Background"
            style={{
              width: "60%",
              height: "60%",
              objectFit: "cover",
              top: -50,
              left: 130,
              zIndex: 0,
              opacity: 0.9,
            }}
          />

          <div className="text-center text-white position-relative px-3 textHeading" style={{ zIndex: 1, marginTop: "0%" }}>
            <p className="lead display-3 text-animate-wrapper mb-3">
              <TextAnimate
                highlightWords={["Empowering", "Teams", "Driving", "Success"]}
                highlightStyle={{ fontWeight: 700, color: "#42602E" }}
                animation={["slideUp", "blurIn"]}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: (i) => ({
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.03, duration: 0.6 },
                  }),
                }}
                by="character">
                Empowering Teams, Driving Success.
              </TextAnimate>
            </p>

            <p className="lead fs-5">
              <TextAnimate
                animation={["slideUp", "blurIn"]}
                highlightWords={["Together", "is", "beginning", "progress", "Success"]}
                highlightStyle={{ fontWeight: 500, color: "#000000ff" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: (i) => ({
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.03, duration: 0.9 },
                  }),
                }}
                by="character">
                Together is beginning, Together is progress, Together is success.
              </TextAnimate>
            </p>

          </div>
        </div>

      </div>
    </div >
  );
};

export default Login;

{/* <div className="col-12 col-md-12 col-lg-7 d-flex justify-content-center align-items-center flex-column gap-4 vh-100">
          <img src={lead_img_1} className="img-fluid" style={{position: "absolate"}} alt="" />
          <p className="text-white lead display-3 text-center text-animate-wrapper" style={{position:"relative"}}>
            <TextAnimate
              highlightWords={["Empowering", "Success"]}
              highlightStyle={{ fontWeight: 700, color: "#6dc532ff" }}
              animation={["slideUp", "blurIn"]}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: (i) => ({
                  opacity: 1,
                  y: 0,
                  transition: { delay: i * 0.03, duration: 0.6 },
                }),
              }}
              by="character"
            >
              Empowering Teams, Driving Success.
            </TextAnimate>
          </p>

          <p className="text-white lead text-center">
            <TextAnimate
              animation={["slideUp", "blurIn"]}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: (i) => ({
                  opacity: 1,
                  y: 0,
                  transition: { delay: i * 0.03, duration: 0.9 },
                }),
              }}
              by="character"
            >
              Together is beginning, Together is progress, Together is success.
            </TextAnimate>
          </p>
        </div> */}