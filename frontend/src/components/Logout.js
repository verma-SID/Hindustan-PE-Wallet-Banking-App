import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/logout.css";

const Logout = () => {
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleLogout = () => {
        localStorage.clear('userEmail');
        navigate('/login');
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    const showLogoutConfirmation = () => {
        setShowConfirmation(true);
    };

    return (
        <div className="logout-container">
            <button className="logout-button" onClick={showLogoutConfirmation}>Logout</button>
            
            {showConfirmation && (
                <div className="confirmation-dialog">
                    <p>Are you sure you want to logout?</p>
                    <button className="confirmation-button" onClick={handleLogout}>Logout</button>
                    <button className="confirmation-button" onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Logout;
