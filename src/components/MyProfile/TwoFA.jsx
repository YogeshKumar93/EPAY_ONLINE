import React, { useContext, useState } from "react";
import { Typography, Button, Box, useTheme } from "@mui/material";
import OTPInput from "react-otp-input";
import AuthContext from "../../contexts/AuthContext";
import CommonModal from "../common/CommonModal";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";

const TwoFA = ({ open, onClose }) => {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);
  const loadUserProfile = authCtx.loadUserProfile;
  const user = authCtx?.user;
  const { showToast } = useToast();

  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTwoFA = async () => {
    if (!mpin || mpin.length < 6) {
      showToast("Please enter your 6-digit MPIN", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await apiCall("POST", ApiEndpoints.CHANGE_TWO_FA, {
        mpin,
      });

      showToast(response?.message || "2FA changed successfully", "success");
       loadUserProfile();
      onClose();
    } catch (error) {
      showToast(error?.message || "Something went wrong", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Change Two-Factor Authentication"
      iconType="help"
      showCloseButton
      footerButtons={[]}
      size="small"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        width="100%"
        maxWidth="360px"
        mx="auto"
        mt={1}
      >
        <Typography variant="body1" align="center">
          {user?.two_fa === "MPIN"
            ? "Are you sure you want to change from MPIN to OTP?"
            : "Are you sure you want to change from OTP to MPIN?"}
        </Typography>

        {/* MPIN Input Section */}
        <Box textAlign="center">
          <Typography
            variant="subtitle2"
            fontWeight="600"
            gutterBottom
            color="text.primary"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
          >
            Enter M-PIN
          </Typography>

          <OTPInput
            value={mpin}
            onChange={setMpin}
            numInputs={6}
            inputType="password"
            shouldAutoFocus
            renderInput={(props) => (
              <input
                {...props}
                style={{
                  width: 50,
                  height: 50,
                  margin: "0 5px",
                  fontSize: "20px",
                  borderRadius: "8px",
                  border: "1.8px solid #E0E0E0",
                  textAlign: "center",
                  fontWeight: "600",
                  color: "#333",
                  backgroundColor: "#fff",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6C4BC7";
                  e.target.style.boxShadow = "0 0 5px rgba(108,75,199,0.3)";
                  e.target.style.background = "#f9f7ff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E0E0E0";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "#fff";
                }}
              />
            )}
          />
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleTwoFA}
          disabled={loading}
          sx={{
            bgcolor: "#EA5E5A",
            py: 1.25,
            fontWeight: "bold",
            borderRadius: 2,
            fontSize: "0.95rem",
            "&:hover": { bgcolor: "#d45552" },
          }}
        >
          {loading
            ? "Processing..."
            : user?.two_fa === "MPIN"
            ? "Change to OTP"
            : "Change to MPIN"}
        </Button>
      </Box>
    </CommonModal>
  );
};

export default TwoFA;
