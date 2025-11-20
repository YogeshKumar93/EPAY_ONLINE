import { Box } from "@mui/material";
import React from "react";
import biggpayLogo from "../../assets/Images/PPALogo.svg";

const CommonLoader = ({ loading, children }) => {
  return (
    <div>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(5px)",
            background: "rgba(0, 0, 0, 0.2)",
            zIndex: 9998,
            flexDirection: "column",
          }}
        >
          <div className="loader-container">
            <img
              src={biggpayLogo}
              style={{
                cursor: "pointer",
                width: 80,
                animation: "scaleAnimation 2s infinite",
              }}
              alt="Loading..."
            />
            <div className="circle1" />
            <div className="circle2" />
          </div>
          <div className="loader-text">
            Wait! While we are processing your request.....
          </div>
        </Box>
      )}
      {children}
      <style jsx>{`
        .loader-text {
          margin-top: 50px;
        }
        .loader-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .circle1,
        .circle2 {
          position: absolute;
          border-radius: 20%;
        }

        .circle1 {
          width: 120px;
          height: 120px;
          border: 5px solid #492077; /* Blue */
          animation: rotateAnimation1 3.2s linear infinite;
        }

        .circle2 {
          width: 150px;
          height: 150px;
          border: 5px solid #7b3fe3; /* Purple */
          animation: rotateAnimation2 3.2s linear infinite;
          opacity: 0.25;
        }

        @keyframes rotateAnimation1 {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateAnimation2 {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }

        @keyframes scaleAnimation {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};

export default CommonLoader;
