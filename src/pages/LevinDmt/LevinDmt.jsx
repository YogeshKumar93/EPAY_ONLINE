import React, { useState, useEffect } from "react";
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
  Autocomplete,
} from "@mui/material";
import { useToast } from "../../utils/ToastContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import SearchIcon from "@mui/icons-material/Search";
import RegisterRemitter from "./LevinRegisterRem";
import LevinDmtRemitter2Fa from "./LevinDmtRemitter2Fa.jsx";
import LevinDmtBeneficiaryList from "./LevinDmtBeneficiaryList.jsx";
import LevinDmtSenderDetails from "./LevinDmtSenderDetails.jsx";
import CommonLoader from "../../components/common/CommonLoader.jsx";

export const LevinDmt = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [senderData, setSenderData] = useState(null);
  const [sender, setSender] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [history, setHistory] = useState([]);
  const { showToast } = useToast();

  // 🧠 Load saved mobile numbers on mount
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("levinMobileNumbers") || "[]"
    );
    setHistory(saved);
  }, []);

  // 🧩 Save a number to history if new
  const saveMobileToHistory = (number) => {
    if (!history.includes(number)) {
      const updated = [...history, number];
      setHistory(updated);
      localStorage.setItem("levinMobileNumbers", JSON.stringify(updated));
    }
  };

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

        console.log("Sender API Response:", response);

        if (
          response?.status === "success" ||
          response?.message === "Remitter Found" ||
          message === "Success"
        ) {
          const beneficiaryData = data?.beneficiary_dmt || data;
          const senderDatas = response?.data;
          setSenderData(beneficiaryData);
          setSender(senderDatas);
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
          setOtpData({
            mobileNumber: number,
            token: data,
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
    handleFetchSender(mobileNumber);
  };

  const handleBackFromRegistration = () => {
    setShowRegistration(false);
    setRegistrationData(null);
  };

  const handleBeneficiarySuccess = (mobileNumber) => {
    handleFetchSender(mobileNumber);
    showToast("Operation completed successfully!", "success");
  };

  const handlePayoutSuccess = () => {
    showToast("Payout completed successfully!", "success");
  };

  const handleMobileInputChange = (event, newValue) => {
    const value = (newValue || "").replace(/\D/g, "").slice(0, 10);
    setMobileNumber(value);
    if (value.length === 10) {
      saveMobileToHistory(value);
      handleFetchSender(value);
    } else {
      // Clear data if mobile number is incomplete
      setSenderData(null);
      setShowRegistration(false);
      setShowOtpModal(false);
    }
  };

  const handleMobileSelect = (event, newValue) => {
    if (newValue && newValue.length === 10) {
      setMobileNumber(newValue);
      saveMobileToHistory(newValue);
      handleFetchSender(newValue);
    }
  };

  const handleManualSearch = () => {
    if (mobileNumber.length === 10) {
      saveMobileToHistory(mobileNumber);
      handleFetchSender();
    }
  };

  return (
    <>
      <CommonLoader loading={loading} />

      <Box sx={{ width: "100%", margin: "auto", p: 2 }}>
        {/* Search Section with Autocomplete */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          alignItems={{ sm: "flex-end" }}
          sx={{ mb: 2 }}
        >
          <Autocomplete
            freeSolo
            options={history}
            value={mobileNumber}
            onInputChange={handleMobileInputChange}
            onChange={handleMobileSelect}
            sx={{ flex: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Mobile Number"
                variant="outlined"
                placeholder="Enter 10-digit mobile number"
                inputProps={{
                  ...params.inputProps,
                  maxLength: 10,
                  inputMode: "numeric",
                }}
                error={mobileNumber.length > 0 && mobileNumber.length !== 10}
                InputProps={{
                  ...params.InputProps,
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
              />
            )}
          />

          {/* {loading && (
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
        )} */}
        </Box>

        {/* Registration Modal */}
        {showRegistration && registrationData && (
          <RegisterRemitter
            mobileNumber={registrationData.mobileNumber}
            encryptedData={registrationData}
            onRegistrationSuccess={handleRegistrationSuccess}
            onBack={handleBackFromRegistration}
          />
        )}

        {/* OTP Modal */}
        {showOtpModal && otpData && (
          <LevinDmtRemitter2Fa
            open={showOtpModal}
            onClose={handleOtpClose}
            mobileNumber={otpData.mobileNumber}
            registrationData={{
              data: otpData.token,
              encrypted_data: otpData.encrypted_data,
            }}
            onSuccess={handleOtpSuccess}
          />
        )}

        {/* Beneficiary List - This will now use full width */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Box width="100%">
            <LevinDmtSenderDetails sender={sender} />
          </Box>
          {senderData && (
            <Box sx={{ width: "100%" }}>
              <LevinDmtBeneficiaryList
                sender={senderData}
                onSuccess={handleBeneficiarySuccess}
                onPayoutSuccess={handlePayoutSuccess}
                mobileNumber={mobileNumber}
              />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
