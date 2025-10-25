import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./MemberBills.css";

const MemberBills = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBills = async () => {
      try {
        const res = await axios.get(`http://localhost:8888/api/bills/user/${user.id}`);
        setBills(res.data);
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [user]);

  const handlePayNow = async (billId) => {
    try {
      // Update the bill status to PAID in backend
      await axios.put(`http://localhost:8888/api/bills/${billId}`, {
        status: "PAID",
        paymentMethod: "ONLINE",
        paymentDate: new Date().toISOString(),
      });

      // Update UI
      setBills((prev) =>
        prev.map((bill) =>
          bill._id === billId ? { ...bill, status: "PAID" } : bill
        )
      );

      alert("Payment recorded successfully!");
    } catch (err) {
      console.error("Error updating payment:", err);
      alert("Failed to record payment. Try again.");
    }
  };

  if (loading) {
    return <p>Loading bills...</p>;
  }

  return (
    <div className="member-bills-container">
      <h2>My Bills</h2>
      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <table className="bills-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id || bill._id}>
                <td>{bill.billMonth}</td>
                <td>{bill.amount}</td>
                <td>
                  <span
                    className={`status ${
                      bill.status.toLowerCase() === "paid" ? "paid" : "pending"
                    }`}
                  >
                    {bill.status}
                  </span>
                </td>
                <td>
                  {bill.dueDate
                    ? new Date(bill.dueDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  {bill.status === "UNPAID" || bill.status === "PENDING" ? (
                    <button
                      className="pay-btn"
                      onClick={() => handlePayNow(bill.id || bill._id)}
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="paid-label">Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberBills;
