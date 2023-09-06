import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../css/CustomNavbar.css"

const CustomNavbar = () => {
  const isLoggedIn = localStorage.getItem("userEmail") !== null;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPassword");

    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Wallet Banking App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/recharge">
                Recharge
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/transfer">
                Transfer
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/account-statement">
                Account Statement
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/earn">
                Cashback List
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <Nav.Link onClick={handleLogout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
