import React from "react";
import styled, { keyframes } from "styled-components";

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
  animation: ${orbit} 2s linear infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const CommonLoader = ({ loading }) => {
  if (!loading) return null;

  return (
    <Overlay>
      <LoaderWrapper>
        <CenterText>IMPS GURU</CenterText>
        <Dot color="#6BCBFF" delay="0s" />
        <Dot color="#FFB142" delay="0.3s" />
        <Dot color="#7BED9F" delay="0.6s" />
      </LoaderWrapper>
    </Overlay>
  );
};

export default CommonLoader;
