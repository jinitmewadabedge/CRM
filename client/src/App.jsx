import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "./../public/bedge_logo.png";
import "./index.css";
import "./App.css";
import useHeartbeat from "./hooks/useHeartbeat";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { socket } from "../src/socket"
import { toast } from "react-toastify"

const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ManageUsers = lazy(() => import("./pages/ManageUsers"));
const RolesPermission = lazy(() => import("./pages/RolePermission"));
const DepartmentReports = lazy(() => import("./pages/DepartmentReports"));
const CompanyPolicies = lazy(() => import("./pages/CompanyPolicies"));
const Announcements = lazy(() => import("./pages/Announcements"));
const Settings = lazy(() => import("./pages/Settings"));

const SalesDashboard = lazy(() => import("./pages/SalesDashboard"));
const MarketingDashboard = lazy(() => import("./pages/MarketingDashboard"));
const TechnicalDashboard = lazy(() => import("./pages/TechnicalDashboard"));

const LeadDashboard = lazy(() => import("./pages/Lead/LeadDashboard"));
const Leads = lazy(() => import("./pages/Lead/Leads"));
const LeadForm = lazy(() => import("./pages/Lead/LeadForm"));
const LeadDetails = lazy(() => import("./pages/Lead/LeadDetails"));

const Loading = () => {

  const [notificationCount, setNotificationCount] = useState(0);

  const loadingMessages = [
    "Generating qualified leads... hang tight!",
    "Your next big client might be loading right now...",
    "Crunching KPIs and brewing opportunities ☕",
    "Polishing leads until they shine ✨",
    "Please hold… convincing the leads to cooperate 🕵️‍♂️",
    "Fetching leads... please don’t hit refresh again 😅",
    "Loading faster than your Monday motivation 🏃‍♂️💨",
    "Optimizing your conversion dreams...",
    "Leads loading... patience is the real sales skill 😅",
    "Aligning your leads with destiny 💼",
  ];

  const [messageIndex, setMessageIndex] = useState(() =>
    Math.floor(Math.random() * loadingMessages.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    
    socket.on("new_notification", (data) => {
      console.log("Global Notification:", data);
      
      toast.info(`${data.title}: ${data.message}`);

      setNotificationCount((prev) => prev + 1);
    });

    return () => socket.off("new_notification");

  },[]);

  return (
    <div className="loading-glass-container">
      <div
        className="d-flex justify-content-center align-items-center vh-100 loadingDashboard text-center"
        style={{ flexDirection: "column" }}
      >
        <img
          src={Logo}
          alt="Loading..."
          className="logo-loader mb-1"
        />
        <h6
          key={messageIndex}
          className="text-muted mt-3 fade-text"
          style={{ transition: "opacity 0.5s ease-in-out", fontSize: "15px" }}
        >
          {loadingMessages[messageIndex]}
        </h6>
      </div>
    </div>
  );
};

function App() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  useHeartbeat(BASE_URL);

  useEffect(() => {
    let logoutSent = false;

    const logoutOnClose = (event) => {
      if (logoutSent) return;
      if (event.persisted) return;
      if (performance.getEntriesByType("navigation")[0]?.type === "reload") return;

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const blob = new Blob([JSON.stringify({ token })], { type: "application/json" });
      navigator.sendBeacon(`${BASE_URL}/api/auth/logout`, blob);
    };

    window.addEventListener("pagehide", logoutOnClose);
    window.addEventListener("beforeunload", logoutOnClose);

    return () => {
      window.removeEventListener("pagehide", logoutOnClose);
      window.removeEventListener("beforeunload", logoutOnClose);
    };
  }, []);

  return (
    <>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />

            {/* Admin dashboard with nested routes */}
            <Route
              path="/admin-dashboard/*"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoutes>
              }
            >
              <Route index element={<ManageUsers />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="roles-permission" element={<RolesPermission />} />
              <Route path="department-report" element={<DepartmentReports />} />
              <Route path="company-polices" element={<CompanyPolicies />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Lead routes (restore old UI behavior) */}
            <Route
              path="/leads/*"
              element={
                // <ProtectedRoutes allowedRoles={["Sales", "Admin", "Marketing", "Technical"]}>
                <LeadDashboard />
                // </ProtectedRoutes>
              }
            >
              <Route index element={<Leads />} />
              <Route path="new" element={<LeadForm />} />
              <Route path=":id" element={<LeadDetails />} />
            </Route>

            {/* Role-based dashboards */}
            <Route
              path="/sales-dashboard"
              element={
                <ProtectedRoutes allowedRoles={["Sales"]}>
                  <SalesDashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/marketing-dashboard"
              element={
                <ProtectedRoutes allowedRoles={["Marketing"]}>
                  <MarketingDashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/technical-dashboard"
              element={
                <ProtectedRoutes allowedRoles={["Technical"]}>
                  <TechnicalDashboard />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </Suspense>
      </Router>

      <ToastContainer position="top-right" autoClose={5000} pauseOnHover theme="colored" />
    </>
  );
}

export default App;
