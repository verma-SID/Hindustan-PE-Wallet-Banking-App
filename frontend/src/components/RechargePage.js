import React, { useState } from "react";
import axios from "axios";
import CustomNavbar from "./CustomNavbar";
import "../css/RechargePage.css";

const RechargePage = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [cashbackMessage, setCashbackMessage] = useState(""); // State for cashback message
  const userEmail = localStorage.getItem("userEmail");

  const handleRecharge = async (e) => {
    e.preventDefault();

    if (amount <= 0) {
      setMessage("Amount must be greater than 0");
      return;
    }

    try {
      // Step 1: Recharge the wallet
      const response = await axios.post(
        `http://localhost:8080/wallet-recharge`,
        {
          email: userEmail,
          amount: amount,
        }
      );

      setMessage(response.data);

      // Step 2: Handle cashback message
      if (response.data === "Wallet recharged successfully") {
        setCashbackMessage("Congratulations! You received a 10% cashback.");
      }
    } catch (error) {
      setMessage("Error occurred during recharge");
    }
  };

  return (
    <div>
      <CustomNavbar />
      <div className="recharge-page-container">
        <div className="recharge-form">
          <h2 className="recharge-title">Recharge Wallet</h2>
          <form onSubmit={handleRecharge}>
            <div className="mb-3">
              <label className="form-label" htmlFor="amountInput">
                Amount:
              </label>
              <input
                type="number"
                id="amountInput" // Add an id to the input element
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Recharge
            </button>
          </form>
          <p className="mt-3">{message}</p>
          {cashbackMessage && (
            <div className="cashback-message">
              <p>{cashbackMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RechargePage;
