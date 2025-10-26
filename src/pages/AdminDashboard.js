import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getNotices, addNotice, deleteNotice } from "../service/noticeService";
import AdminNotices from "./AdminNotices.js";

import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaUsers,
  FaFileInvoiceDollar,
  FaBell,
  FaWrench,
  FaCar,
} from "react-icons/fa";
import AdminMembers from "./AdminMembers";
import CreateFlat from "./CreateFlat"; // ✅ Import your Flats component
import AdminBills from "./AdminBills.js";
import "./AdminDashboard.css";
import AssignFlat from "./AssignFlat.js";
import AssignMonthlyBill from "./AssignMonthlyBill.js";
import AdminParking from "./AdminParking.js";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return <div className="text-center p-6 text-gray-500">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>HarmonyStay</h2>
        </div>

        <ul className="menu-list">
          <li
            className={activeMenu === "dashboard" ? "active" : ""}
            onClick={() => setActiveMenu("dashboard")}
          >
            <FaHome /> Dashboard
          </li>
          <li
            className={activeMenu === "members" ? "active" : ""}
            onClick={() => setActiveMenu("members")}
          >
            <FaUsers /> Members
          </li>
          <li
            className={activeMenu === "flats" ? "active" : ""}
            onClick={() => setActiveMenu("flats")}
          >
            <FaWrench /> Flats
          </li>
          <li
            className={activeMenu === "maintenance" ? "active" : ""}
            onClick={() => setActiveMenu("maintenance")}
          >
            <FaFileInvoiceDollar /> Maintenance
          </li>
           <li
            className={activeMenu === "parking" ? "active" : ""}
            onClick={() => setActiveMenu("parking")}
          >
            <FaCar /> Parking
          </li>
          <li
            className={activeMenu === "notice" ? "active" : ""}
            onClick={() => setActiveMenu("notice")}
          >
            <FaBell /> Notices
          </li>
          <li
            className={activeMenu === "profile" ? "active" : ""}
            onClick={() => setActiveMenu("profile")}
          >
            <FaUserCircle /> Profile
          </li>
        </ul>

        <button className="logout-btn-sidebar" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Section */}
      <main className="main-content">
        <header className="main-header">
          <h1>
            {activeMenu === "dashboard"
              ? "Admin Dashboard"
              : activeMenu === "members"
              ? "Member Management"
              : activeMenu === "flats"
              ? "Flats Management"
              : activeMenu === "maintenance"
              ? "Maintenance Summary"
              : activeMenu === "parking"
              ? "Parking Slots"
              : activeMenu === "notice"
              ? "Notices"
              : "Profile Information"}
          </h1>
        </header>

        <section className="content-section">
          {activeMenu === "dashboard" && (
            <div className="dashboard-card">
              <h2>Welcome, {user.firstName || "Admin"} 👋</h2>
              <p>Here’s an overview of your HarmonyStay admin account.</p>
            </div>
          )}

          {activeMenu === "members" && (
            <div className="dashboard-card">
              <AdminMembers /> {/* ✅ Members opens in center */}
            </div>
          )}
          {activeMenu === "parking" && (
            <div className="dashboard-card">
              <AdminParking /> {/* ✅ Members opens in center */}
            </div>
          )}
          {activeMenu === "flats" && (
            <div className="dashboard-card">
              <CreateFlat /> {/* ✅ Flats form opens here in center */}
            </div>
          )}

          {activeMenu === "maintenance" && (
            <div className="dashboard-card">
              <AssignMonthlyBill/>
            </div>
          )}


        {activeMenu === "notice" && (
            <div className="dashboard-card">
              <AdminNotices />
            </div>
          )}



          {activeMenu === "profile" && (
            <div className="profile-card">
              <FaUserCircle className="profile-avatar" size={80} />
              <h3>{user.firstName}</h3>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
