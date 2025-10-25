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

  const handlePayNow = async (billId, amount) => {
    try {
      // Step 1: Create order via backend
      const orderRes = await axios.post("http://localhost:8888/api/payments/create-order", {
        amount: amount * 100, // in paise
      });

      const { orderId } = orderRes.data;

      // Step 2: Configure Razorpay options
      const options = {
        key: "rzp_test_RXjylnpmWsTC8v", // Your Razorpay test key
        amount: amount * 100,
        currency: "INR",
        name: "HarmonyStay",
        description: "Monthly Maintenance Payment",
        order_id: orderId,
        handler: async function (response) {
          // Payment successful, update bill in backend
          await axios.put(`http://localhost:8888/api/bills/${billId}`, {
            status: "PAID",
            paymentMethod: "ONLINE",
            paymentDate: new Date().toISOString(),
            transactionId: response.razorpay_payment_id,
          });

          // Update UI
          setBills((prev) =>
            prev.map((bill) =>
              bill.id === billId || bill._id === billId
                ? { ...bill, status: "PAID" }
                : bill
            )
          );

          alert("Payment successful!");
        },
        prefill: {
          name: user.firstName,
          email: user.email,
          contact: user.phone || "9999999999",
        },
        theme: { color: "#197de2" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Try again.");
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
                      onClick={() =>
                        handlePayNow(bill.id || bill._id, bill.amount)
                      }
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
