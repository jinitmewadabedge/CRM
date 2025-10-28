import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import SalesDashboard from "./pages/SalesDashboard";
import MarketingDashboard from "./pages/MarketingDashboard";
import TechnicalDashboard from "./pages/TechnicalDashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ForgotPassword from "./pages/ForgotPassword";
import ManageUsers from "./pages/ManageUsers";
import RolesPermission from "./pages/RolePermission";
import DepartmentReports from "./pages/DepartmentReports";
import CompanyPolicies from "./pages/CompanyPolicies";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import ResetPassword from "./pages/ResetPassword";
import Leads from "./pages/Lead/Leads";
import LeadDetails from "./pages/Lead/LeadDetails";
import LeadForm from "./pages/Lead/LeadForm";
import LeadDashboard from './pages/Lead/LeadDashboard'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import useHeartbeat from "./hooks/useHeartbeat";

function App() {

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useHeartbeat(BASE_URL);

  useEffect(() => {

    let logoutSent = false;

    const logoutOnClose = (event) => {
      if (logoutSent) return;
      if (event.persisted) return;
      if (performance.getEntriesByType("navigation")[0]?.type === "reload") return;

      console.log("pagehide or beforeunload triggered — checking logout condition...");

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const blob = new Blob([JSON.stringify({ token })], { type: "application/json" });
      const success = navigator.sendBeacon(`${BASE_URL}/api/auth/logout`, blob);
      console.log("Beacon sent:", success);
    };

    window.addEventListener("pagehide", logoutOnClose);
    window.addEventListener("beforeunload", logoutOnClose);

    console.log("pagehide + beforeunload listeners added");

    return () => {
      window.removeEventListener("pagehide", logoutOnClose);
      window.removeEventListener("beforeunload", logoutOnClose);
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Admin */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoutes allowedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoutes>
            }>
            <Route path="" element={<ManageUsers />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="roles-permission" element={<RolesPermission />} />
            <Route path="department-report" element={<DepartmentReports />} />
            <Route path="company-polices" element={<CompanyPolicies />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/leads/*"
            element={
              // <ProtectedRoutes>
              <LeadDashboard />
              // </ProtectedRoutes>
            }>
            <Route index element={<Leads />} />

          </Route>

          {/* Sales route */}
          <Route
            path="/sales-dashboard"
            element={
              <ProtectedRoutes allowedRoles={["Sales"]}>
                <SalesDashboard />
              </ProtectedRoutes>
            }
          />

          {/* Marketing route */}
          <Route
            path="/marketing-dashboard"
            element={
              <ProtectedRoutes allowedRoles={["Marketing"]}>
                <MarketingDashboard />
              </ProtectedRoutes>
            }
          />

          {/* Technical route */}
          <Route
            path="/technical-dashboard"
            element={
              <ProtectedRoutes allowedRoles={["Technical"]}>
                <TechnicalDashboard />
              </ProtectedRoutes>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover theme="colored" />
    </>
  );
}

export default App;
