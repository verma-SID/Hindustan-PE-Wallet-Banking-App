import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const DashboardItem = ({ title, description, path }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Link to={path} className="btn btn-primary">
          Go
        </Link>
      </Card.Body>
    </Card>
  );
};

export default DashboardItem;
