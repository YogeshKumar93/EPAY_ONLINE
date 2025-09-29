import React, { useRef } from "react";
import { Box } from "@mui/material";

const OtpInput = ({ otp, setOtp }) => {
  const inputRef = useRef(null);

  return (
    <Box
      display="flex"
      justifyContent="center"
      gap={1}
      onClick={() => inputRef.current.focus()}
    >
      {/* Hidden real input */}
      <input
        ref={inputRef}
        type="password"
        value={otp}
        maxLength={6}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ""); // digits only
          setOtp(value);
        }}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* Fake boxes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 40,
            height: 50,
            border: "2px solid #ccc",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "text",
          }}
        >
          {otp[i] || ""}
        </Box>
      ))}
    </Box>
  );
};

export default OtpInput;
