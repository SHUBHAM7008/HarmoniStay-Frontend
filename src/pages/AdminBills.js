// src/pages/AdminBills.js
import React, { useEffect, useState } from "react";
import "./AdminBills.css";

const AdminBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8888/api/bills")
      .then((res) => res.json())
      .then((data) => {
        setBills(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching bills:", err));
  }, []);

  const markAsPaid = async (billId) => {
    try {
      await fetch(`http://localhost:8888/api/bills/${billId}/pay`, {
        method: "PUT",
      });
      alert("Bill marked as paid!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };

  if (loading) return <div className="loading">Loading bills...</div>;

  return (
    <div className="admin-bills-container">
      <h2>Bill Management</h2>
      <table className="bills-table">
        <thead>
          <tr>
            <th>Flat</th>
            <th>Member</th>
            <th>Month</th>
            <th>Amount (₹)</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill._id}>
              <td>{bill.flatId?.flatNumber || "—"}</td>
              <td>{bill.userId?.firstName || "—"}</td>
              <td>{bill.month}</td>
              <td>{bill.amount}</td>
              <td>
                <span className={`status ${bill.status.toLowerCase()}`}>
                  {bill.status}
                </span>
              </td>
              <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
              <td>
                {bill.status === "PENDING" ? (
                  <button
                    className="pay-btn"
                    onClick={() => markAsPaid(bill._id)}
                  >
                    Mark Paid
                  </button>
                ) : (
                  <span className="paid-label">Paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBills;
