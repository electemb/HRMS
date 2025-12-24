import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
  return (
    <div style={{ maxWidth: 640, margin: "80px auto", textAlign: "center" }}>
      <h2>Access denied</h2>
      <p>You don't have permission to view this page.</p>
      <p>
        <Link className="primary-btn" to="/">
          Go to home
        </Link>
      </p>
    </div>
  );
};

export default Unauthorized;
