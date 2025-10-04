import { Button, FormControl, Grid, Modal, Typography } from "@mui/material";
import { Box, useMediaQuery, useTheme } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import PinInput from "react-pin-input";

import { useContext } from "react";
import CommonModal from "./CommonModal";
import AuthContext from "../../contexts/AuthContext";
import ResetMpin from "./ResetMpin";
import OtpInput from "react-otp-input";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};
const CommonMpinModal = ({
  open,
  setOpen,
  hooksetterfunc,
  radioPrevValue,
  mPinCallBack,
  title = "Enter MPIN",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [err, setErr] = useState("");
  const [otp, setOtp] = useState("");
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const username = user && user.username;

  // State to track which input is focused
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Ref for first input field
  const firstInputRef = useRef(null);

  // Direct focus on first input when modal opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
          firstInputRef.current.select();
          setFocusedIndex(0); // Set first input as focused
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    if (hooksetterfunc) hooksetterfunc(radioPrevValue);
    setErr("");
    setOtp("");
    setFocusedIndex(0);
  };

  const handleMpinCB = (value) => {
    if (mPinCallBack) mPinCallBack(value);
    setOpen(false);
  };

  const handleChange = (value) => {
    setOtp(value);
    if (err !== "") {
      setErr("");
    }
  };

  // Handle focus on any input
  const handleInputFocus = (index) => {
    setFocusedIndex(index);
  };

  // Handle blur
  const handleInputBlur = () => {
    setFocusedIndex(-1);
  };

  const handleSubmit = () => {
    if (otp.length < 6) {
      setErr("Please enter a 6-digit MPIN");
      return;
    }
    handleMpinCB(otp);
  };
  const renderInput = (inputProps, index) => {
    const isFocused = focusedIndex === index;

    const inputStyle = {
      width: isMobile ? "40px" : "48px",
      height: isMobile ? "40px" : "48px",
      fontSize: isMobile ? "18px" : "20px",
      borderRadius: "8px",
      border: isFocused ? "3px solid #4045A1" : "2px solid #e0e0e0",
      background: isFocused ? "#e3f2fd" : "#f8f9fa",
      fontWeight: "600",
      transition: "all 0.3s ease",
      outline: "none",
      textAlign: "center",
      boxShadow: isFocused ? "0 0 10px rgba(64, 69, 161, 0.4)" : "none",
      transform: isFocused ? "scale(1.05)" : "scale(1)",
    };

    return (
      <input
        {...inputProps}
        style={inputStyle}
        onFocus={() => handleInputFocus(index)}
        onBlur={handleInputBlur}
      />
    );
  };

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title={title}
      footerButtons={[]}
      size="small"
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          px: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            textAlign: "center",
            mb: 3,
            px: 1,
          }}
        >
          Please enter your 6-digit MPIN to continue
        </Typography>

        {/* OTP Input */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            mb: 2,
            position: "relative",
          }}
        >
          <OtpInput
            value={otp}
            onChange={handleChange}
            numInputs={6}
            inputType="password"
            renderSeparator={<span style={{ width: "8px" }}></span>}
            renderInput={renderInput}
          />
        </Box>

        {/* Error Message */}
        {err && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              py: 1,
              px: 2,
              mb: 2,
              backgroundColor: "#ffebee",
              borderRadius: "6px",
              border: "1px solid #ffcdd2",
            }}
          >
            <ErrorOutline
              sx={{
                color: "#d32f2f",
                fontSize: "18px",
                mr: 1,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#d32f2f",
                fontSize: "0.85rem",
                fontWeight: "500",
              }}
            >
              {err}
            </Typography>
          </Box>
        )}

        {/* Submit Button */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{
            background: "linear-gradient(135deg, #4045A1, #6065C9)",
            py: 1.5,
            fontSize: isMobile ? "14px" : "15px",
            fontWeight: "bold",
            borderRadius: "10px",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(64, 69, 161, 0.25)",
            "&:hover": {
              background: "linear-gradient(135deg, #30347a, #5055b5)",
              boxShadow: "0 6px 15px rgba(64, 69, 161, 0.35)",
            },
          }}
        >
          Verify MPIN
        </Button>
      </Box>
    </CommonModal>
  );
};

export default CommonMpinModal;
