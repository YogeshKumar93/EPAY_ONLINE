import React from "react";
import { Link } from "react-router-dom"; // ✅ import Link

const NavBar = () => {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        background: "#292730ff",
        color: "#96db15ff",
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(75, 214, 20, 0.1)",
      }}
    >
      <div
        style={{
         
          margin: "0 auto",
          padding: "1.2rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
          IMPS GURU
        </div>

        {/* Links + Login Button */}
        <nav
          style={{
            display: "flex",
            gap: "1.5rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
            alignItems: "center",
          }}
        >
          <Link to="" style={linkStyle}>
            Home
          </Link>
          <Link to="/landingaboutus" style={linkStyle}>
            About
          </Link>
          <Link to="/landingservices" style={linkStyle}>
            Services
          </Link>
          <Link to="/landingcontactus" style={linkStyle}>
            Contact
          </Link>

          {/* Login Button */}
          <Link
            to="/login"
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: "8px",
              backgroundColor: "#1CA895",
              color: "white",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#148d78")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1CA895")}
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

const linkStyle = {
  textDecoration: "none",
  color: "white",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  padding: "0.3rem 0.6rem",
  borderRadius: "6px",
};

// hover effect via inline style doesn’t work with pseudo-classes like :hover
// Instead, use CSS or inline onMouseEnter/onMouseLeave.
// Example with inline hover workaround:
// const hoverStyle = {
//   backgroundColor: "#5530b0",
//   color: "#ffd700",
// };

export default NavBar;
