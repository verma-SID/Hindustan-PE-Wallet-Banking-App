import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomNavbar from "./CustomNavbar";
import "../css/ViewAccountStatement.css"

const ViewAccountStatement = () => {
  const [transactions, setTransactions] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail"));
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchAccountStatement();
    }
  }, [userEmail]);

  const fetchAccountStatement = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/${userEmail}/transactions`
      );

      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching account statement:", error);
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

  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(b.localDateTime) - new Date(a.localDateTime)
  );

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
      </div>
    </div>
  );
};

export default ViewAccountStatement;