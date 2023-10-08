import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CustomNavbar from "./CustomNavbar";
import "../css/ViewAccountStatement.css";

const ViewAccountStatement = () => {
  const [transactions, setTransactions] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAccountStatement = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/${userEmail}/transactions`
      );

      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching account statement:", error);
    }
  }, [userEmail]);

  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail"));
  }, [userEmail, fetchAccountStatement]);

  useEffect(() => {
    if (userEmail) {
      fetchAccountStatement();
    }
  }, [fetchAccountStatement, userEmail]);

  const handleSendStatementClick = async () => {
    try {
      console.log("Clicked");
      const response = await axios.post(
        `http://localhost:8080/${userEmail}/send-account-statement`
      );
      console.log("Successfully email sent");
      setSuccessMessage("Account statement sent successfully.");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to send account statement.");
      setSuccessMessage("");
    }
  };

  // Function to format a date string
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.localDateTime) - new Date(a.localDateTime)
  );

  const renderSendStatementButton = () => {
    if (transactions.length > 0) {
      return (
        <button className="btn btn-primary" onClick={handleSendStatementClick}>
          Send Account Statement on Mail
        </button>
      );
    }
    return null;
  };

  return (
    <div>
      <CustomNavbar />
      <div className="container mt-5" data-testid="View">
        <h2>Account Statement</h2>
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Send/Recieved By</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.type}</td>
                <td>{formatDateTime(transaction.localDateTime)}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.userEmail}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {renderSendStatementButton()}

        {successMessage && (
          <div className="alert alert-success" style={{ marginTop: "20px" }}>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger" style={{ marginTop: "20px" }}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAccountStatement;
