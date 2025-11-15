import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { useToast } from "../../utils/ToastContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import SearchIcon from "@mui/icons-material/Search";
import RegisterRemitter from "./LevinRegisterRem";
import LevinDmtRemitter2Fa from "./LevinDmtRemitter2Fa.jsx";
export const LevinDmt = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [senderData, setSenderData] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const { showToast } = useToast();

  const handleFetchSender = async (number = mobileNumber) => {
    if (!number || number.length !== 10) {
      showToast("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    setLoading(true);
    setSenderData(null);
    setShowRegistration(false);
    setShowOtpModal(false);

    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_DMT_SENDER,
        {
          mobile_number: number,
        }
      );

      if (response) {
        const data = response?.data || response?.response?.data;
        const message = response?.message || "";

        console.log("Sender API Response:", response); // Debug log

        if (
          response?.status === "success" ||
          response?.message === "Remitter Found"
        ) {
          setSenderData(data);
          showToast("Sender found successfully!", "success");
        } else if (message === "Sender Not Found") {
          setRegistrationData({
            mobileNumber: number,
            data: data,
          });
          setShowRegistration(true);
          showToast("Sender not found. Please register.", "info");
        } else if (message === "Please do remitter e-kyc.") {
          showToast("Please complete e-KYC verification", "warning");
          setSenderData(null);
        } else if (
          message ===
          "OTP has successfully sent on your registered mobile number"
        ) {
          // Handle OTP case - open OTP modal
          setOtpData({
            mobileNumber: number,
            token: data, // This is your "aff667d3-0d96-4f80-bd1f-c85d3d6832ac"
            encrypted_data: response.encrypted_data,
          });
          setShowOtpModal(true);
          showToast("OTP sent to your registered mobile number", "success");
        } else {
          showToast(message || "Unexpected response", "error");
          setSenderData(null);
        }
      } else if (error) {
        if (error?.message === "Kindly Register the remitter.") {
          setRegistrationData({
            mobileNumber: number,
            data: null,
            encrypted_data: null,
          });
          setShowRegistration(true);
          showToast("Please register as a remitter first", "info");
        } else {
          showToast(error?.message || "Something went wrong", "error");
          setSenderData(null);
        }
      }
    } catch (err) {
      console.error("API call failed:", err);
      showToast("Failed to fetch sender details", "error");
      setSenderData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = (token) => {
    setShowOtpModal(false);
    setOtpData(null);
    // After OTP verification, refetch sender data
    handleFetchSender(mobileNumber);
    showToast(
      "OTP verified successfully! Fetching sender details...",
      "success"
    );
  };

  const handleOtpClose = () => {
    setShowOtpModal(false);
    setOtpData(null);
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setRegistrationData(null);
    // Optionally refetch sender data after successful registration
    handleFetchSender(mobileNumber);
  };

  const handleBackFromRegistration = () => {
    setShowRegistration(false);
    setRegistrationData(null);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(value);
    if (value.length === 10) {
      handleFetchSender(value);
    }
  };

  const handleManualSearch = () => {
    if (mobileNumber.length === 10) {
      handleFetchSender();
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", p: 2 }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        alignItems={{ sm: "flex-end" }}
      >
        <TextField
          label="Mobile Number"
          variant="outlined"
          value={mobileNumber}
          onChange={handleMobileChange}
          placeholder="Enter 10-digit mobile number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleManualSearch}
                  disabled={loading || mobileNumber.length !== 10}
                  edge="end"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            maxLength: 10,
            inputMode: "numeric",
          }}
          sx={{ flex: 1 }}
          autoComplete="tel"
          error={mobileNumber.length > 0 && mobileNumber.length !== 10}
          helperText={
            mobileNumber.length > 0 && mobileNumber.length !== 10
              ? "Mobile number must be 10 digits"
              : "Enter 10-digit mobile number to search automatically"
          }
        />
        {loading && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: { xs: 2, sm: 1 },
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Searching...
            </Typography>
          </Box>
        )}
      </Box>

      {showRegistration && registrationData && (
        <RegisterRemitter
          mobileNumber={registrationData.mobileNumber}
          encryptedData={registrationData}
          onRegistrationSuccess={handleRegistrationSuccess}
          onBack={handleBackFromRegistration}
        />
      )}

      {showOtpModal && otpData && (
        <LevinDmtRemitter2Fa
          open={showOtpModal}
          onClose={handleOtpClose}
          mobileNumber={otpData.mobileNumber}
          registrationData={{
            data: otpData.token, // Pass the token
            encrypted_data: otpData.encrypted_data,
          }}
          onSuccess={handleOtpSuccess}
        />
      )}
    </Box>
  );
};
