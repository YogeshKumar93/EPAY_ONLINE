import { Box } from "@mui/material";
import React from "react";
import styled, { keyframes } from "styled-components";
import { smLogo } from "../../iconsImports";


// Orbit animation
const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
`;

// Loader Overlay
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

// Loader Container
const LoaderWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

// Center Text
const CenterText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(90deg, #6BCBFF, #FFB142);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

// Orbiting Dot
const Dot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 15px;
  margin: -7.5px;
  border-radius: 50%;
  background: ${(props) => props.color || "#6BCBFF"};
  animation: ${orbit} 0.6s linear infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`;
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
              src={smLogo}
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
          border: 5px solid #1877f2;
          animation: rotateAnimation1 3.2s linear infinite;
        }

        .circle2 {
          width: 150px;
          height: 150px;
          border: 5px solid #f18d18;
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
