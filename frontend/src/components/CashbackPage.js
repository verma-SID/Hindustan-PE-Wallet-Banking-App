import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CashbackPage.css";
import CustomNavbar from "./CustomNavbar";

const CashbackPage = () => {
  const [cashbacks, setCashbacks] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/${userEmail}/cashbacks`)
      .then((response) => {
        // Sort cashbacks by date in descending order
        const sortedCashbacks = response.data.sort((a, b) => {
          return new Date(b.localDateTime) - new Date(a.localDateTime);
        });
        setCashbacks(sortedCashbacks);
      })
      .catch((error) => {
        console.error("Error fetching cashbacks:", error);
      });
  }, [userEmail]);

  // Function to format a date as a readable string
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
    <CustomNavbar />
    <div className="cashback-container">
      <h2 className="cashback-heading">Cashbacks</h2>
      <ul className="cashback-list">
        {cashbacks.map((cashback) => (
          <li key={cashback.id} className="cashback-item">
            Earned Rs{cashback.amount} cashback on{" "}
            {formatDate(cashback.localDateTime)}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default CashbackPage;
