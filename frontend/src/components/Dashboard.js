import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiSend, FiList } from "react-icons/fi"; // Import icons
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbar from "./CustomNavbar";
import axios from "axios";
import "../css/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentBalance, setCurrentBalance] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const isLoggedIn = localStorage.getItem("userEmail") !== null;

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecentTransactions();
    }
  }, [isLoggedIn, recentTransactions]);

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const uniqueEmails = Array.from(
    new Set(recentTransactions.map((transaction) => transaction.userEmail))
  );

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/${localStorage.getItem(
          "userEmail"
        )}/transactions`
      );
      setRecentTransactions(response.data);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    }
  };

  const handleTransactionClick = (destinationEmail) => {
    navigate(`/transfer?destinationEmail=${destinationEmail}`);
  };

  const fetchCurrentBalance = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/${localStorage.getItem(
          "userEmail"
        )}/current-balance`
      );
      setCurrentBalance(response.data.amount);
    } catch (error) {
      console.error("Error fetching current balance:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <CustomNavbar />
      <div className="mt-4 row">
        <div className="col-md-4">
          <div
            className="dashboard-item text-center"
            onClick={() => navigate("/recharge")}
          >
            <FiCreditCard className="dashboard-item-icon" />
            <p className="dashboard-item-text" data-testid="rechargeItem">
              Recharge Wallet
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="dashboard-item text-center"
            onClick={() => navigate("/transfer")}
          >
            <FiSend className="dashboard-item-icon" />
            <p className="dashboard-item-text" data-testid="transferItem">
              Transfer Amount
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="dashboard-item text-center"
            onClick={() => navigate("/account-statement")}
          >
            <FiList className="dashboard-item-icon" />
            <p className="dashboard-item-text" data-testid="account-statement">
              View Account Statement
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            className="btn btn-primary my-button" // Add a custom class for styling
            onClick={fetchCurrentBalance} // Call fetchCurrentBalance when the button is clicked
          >
            Get Current Balance
          </button>
          {currentBalance !== null && (
            <p className="mt-2 my-paragraph">
              Current Balance: Rs{currentBalance}
            </p>
          )}
        </div>

        <div className="mt-4">
          <h3>Quick Transfer</h3>
          <div className="transaction-tiles">
            {uniqueEmails
              .filter((email) => email !== localStorage.getItem("userEmail")) // Filter out the current user's email
              .map((email, index) => (
                <div
                  key={index}
                  className="transaction-tile"
                  onClick={() => handleTransactionClick(email)}
                >
                  <p className="transaction-email">{email}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
