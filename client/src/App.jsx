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

function App() {

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const handleBeforeUnload = () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (token) {

        const url = `${BASE_URL}/auth/logout`;
        const body = JSON.stringify({ token });
        navigator.sendBeacon(url, body);

        localStorage.clear();
        sessionStorage.clear();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
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
  );
}

export default App;
