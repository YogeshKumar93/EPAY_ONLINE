import React from "react";
import styled, { keyframes } from "styled-components";
import biggpayLogo from "../assets/Images/PPALogo6.png";
// Spinner rotation animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Modal Overlay (inside modal)
const Overlay = styled.div`
  position: absolute; // modal ke andar cover kare
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  flex-direction: column;
`;

// Logo + Spinner Container
const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

// Logo Animation
const scaleAnimation = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.9); }
`;

const Logo = styled.img`
  width: 60px;
  animation: ${scaleAnimation} 2s infinite;
`;

// Small Spinner
const SpinnerWrapper = styled.div`
  width: ${(props) => props.size || "40px"};
  height: ${(props) => props.size || "40px"};
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: ${(props) => props.color || "#6C4BC7"};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Spinner = ({ loading, size, color, text }) => {
  if (!loading) return null;
  return (
    <Overlay>
      <LoaderWrapper>
        <Logo src={biggpayLogo} alt="Loading..." />
        <SpinnerWrapper size={size} color={color} />
        {text && (
          <div style={{ marginTop: 10, color: "#000", textAlign: "center" }}>
            {text}
          </div>
        )}
      </LoaderWrapper>
    </Overlay>
  );
};

export default Spinner;
