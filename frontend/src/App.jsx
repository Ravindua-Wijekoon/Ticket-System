import React ,{ useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import VendorDashboard from "./pages/VendorDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import SignUpPage from "./pages/SignUpPage";
import AdminDashboard from "./pages/AdminDashboard"
import { checkTokenExpiration } from "./utils/authUtils";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/" />;
};

function App() {
  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Protected routes for Vendor and Customer Dashboards */}
        <Route path="/vendor-dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
        <Route path="/customer-dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
