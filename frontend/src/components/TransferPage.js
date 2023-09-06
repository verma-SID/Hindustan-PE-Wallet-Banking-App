// TransferPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomNavbar from "./CustomNavbar";
import "../css/TransferPage.css";

const TransferPage = () => {
  const [destinationEmail, setDestinationEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const updateDestinationEmail = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailParam = queryParams.get("destinationEmail");
    if (emailParam) {
      setDestinationEmail(emailParam);
    }
  };

  useEffect(() => {
    updateDestinationEmail();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (amount <= 0) {
      setMessage("Amount must be greater than 0");
      return;
    }

    if (destinationEmail === localStorage.getItem("userEmail")) {
      setMessage("Uh oh! You cannot transfer money to yourself.");
      return;
    }

    const sourceEmail = localStorage.getItem("userEmail");

    try {
      const response = await axios.post(
        `http://localhost:8080/money-transfer`,
        {
          sourceEmail,
          destinationEmail,
          amount,
        }
      );
      if (response.status === 200) {
        setDestinationEmail("");
        setAmount("");
        setMessage("Transfer successful!");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setMessage("Oops! Not enough balance.");
      } else {
        setMessage("Destination Email is incorrect.");
      }
    }
  };

  return (
    <div>
      <CustomNavbar />
      <div className="transfer-page-container">
        <div className="transfer-form">
          <h2 className="transfer-title" data-testid="transfer">
            Transfer Funds
          </h2>
          <form onSubmit={handleTransfer}>
            <div className="mb-3">
              <label className="form-label">Destination Email:</label>
              <input
                type="email"
                value={destinationEmail}
                className="form-control"
                onChange={(e) => setDestinationEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Amount:</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block transfer-button"
            >
              Transfer
            </button>
          </form>
          <p className="mt-3 error-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
