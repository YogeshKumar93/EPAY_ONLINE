// import React, { useState, useEffect, useContext } from "react";
import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Modal,
  Fade,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import AEPS2FAModal from "../../components/AEPS/AEPS2FAModal";
import OtpInput from "../OtpInput";

const LevinDmtRemitter2Fa = ({
  open,
  onClose,
  mobileNumber,
  registrationData,
  onSuccess,
}) => {
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [token, setToken] = useState("");
  const [registrationEncryptedData, setRegistrationEncryptedData] =
    useState("");
  const [hasSentOtp, setHasSentOtp] = useState(false);
  const [finalToken, setFinalToken] = useState("");
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricData, setBiometricData] = useState(null);
  const [aadhaar, setAadhaar] = useState("");
  const { showToast } = useToast();

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const payload = {
        mobile_number: mobileNumber,
      };

      if (registrationData?.data) {
        payload.token = registrationData.data;
      }

      console.log("Sending OTP with payload:", payload);

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_DMT_SEND_OTP,
        payload
      );

      if (response) {
        // Check for error status in response
        if (response?.status_id === 400 || response?.status === false) {
          showToast(
            response?.message || "Invalid request. Please try again.",
            "error"
          );
          setHasSentOtp(false); // Reset so OTP can be sent again if modal reopens
          onClose(); // Close modal on error
          return;
        }

        let receivedToken = "";

        if (typeof response?.data === "string") {
          receivedToken = response.data;
        } else if (response?.data?.token) {
          receivedToken = response.data.token;
        } else if (response?.token) {
          receivedToken = response.token;
        } else if (Array.isArray(response?.data) && response.data.length > 0) {
          receivedToken = response.data[0];
        }

        const receivedEncryptedData = response?.encrypted_data;

        if (receivedToken) {
          setToken(receivedToken);
        } else {
          setToken(registrationData?.data || "");
        }

        setRegistrationEncryptedData(receivedEncryptedData);
        showToast(response?.message || "OTP sent successfully!", "success");

        console.log("OTP Response - Token:", receivedToken);
        console.log("OTP Response - Encrypted Data:", receivedEncryptedData);
      } else if (error) {
        // Handle API error
        showToast(error?.message || "Failed to send OTP", "error");
        setHasSentOtp(false); // Reset so OTP can be sent again
        onClose(); // Close modal on error
      }
    } catch (err) {
      console.error("Send OTP failed:", err);
      showToast("Failed to send OTP", "error");
      setHasSentOtp(false); // Reset so OTP can be sent again
      onClose(); // Close modal on error
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      showToast("Please enter a valid 6-digit OTP", "error");
      return;
    }

    if (!token) {
      showToast("Token not available. Please try again.", "error");
      return;
    }

    setOtpLoading(true);
    try {
      const payload = {
        mobile_number: mobileNumber,
        otp: otp,
        token: token,
      };

      if (registrationEncryptedData) {
        payload.encrypted_data = registrationEncryptedData;
      }

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_DMT_VALIDATE_SEND_OTP,
        payload
      );

      if (response) {
        // Check for error status in validation response too
        if (response?.status_id === 400 || response?.status === false) {
          showToast(response?.message || "Invalid OTP or request", "error");
          return;
        }

        showToast(response?.message || "OTP verified successfully!", "success");

        // Store final token from OTP validation response
        const validatedToken =
          response?.data?.token || response?.token || token;
        setFinalToken(validatedToken);

        // Show biometric modal for 2FA
        setShowBiometricModal(true);
      } else if (error) {
        showToast(error?.message || "OTP verification failed", "error");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      showToast("OTP verification failed", "error");
    } finally {
      setOtpLoading(false);
    }
  };
  const handleBiometricSuccess = async (scanData) => {
    try {
      // Extract all the required fields with fallbacks
      const pidData = scanData.pidData || scanData.pid;
      const pidDataType = scanData.pidDataType || scanData.type;
      const ci = scanData.ci || scanData.cI;
      const dc = scanData.dc || scanData.dC;
      const dpId = scanData.dpId || scanData.dpID;
      const fCount = scanData.fCount;
      const hmac = scanData.hmac || scanData.hMac;
      const mc = scanData.mc || scanData.mC;
      const errInfo = scanData.errInfo;
      const mi = scanData.mi || scanData.mI;
      const nmPoints = scanData.nmPoints;
      const qScore = scanData.qScore;
      const rdsId = scanData.rdsId;
      const rdsVer = scanData.rdsVer;
      const sessionKey = scanData.sessionKey;
      const srno = scanData.srno;

      const payload = {
        token: finalToken,
        mobile_number: mobileNumber,
        pidData: pidData || "",
        piData: pidData || "",
        pidDataType: pidDataType || "",
        ci: ci || "",
        dc: dc || "",
        dpId: dpId || "",
        fCount: fCount || "",
        hmac: hmac || "",
        mc: mc || "",
        errInfo: errInfo || "",
        mi: mi || "",
        nmPoints: nmPoints || "",
        qScore: qScore || "",
        rdsId: rdsId || "",
        rdsVer: rdsVer || "",
        sessionKey: sessionKey || "",
        srno: srno || "",
        pf: "web",
        operator: 16,
      };

      console.log("Calling Biometric 2FA with payload:", payload);

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_DMT_REGISTER_2FA,
        payload
      );

      if (response) {
        // Check for error in biometric response
        if (response?.status_id === 400 || response?.status === false) {
          showToast(
            response?.message || "Biometric verification failed",
            "error"
          );
          return;
        }

        showToast(
          response?.message || "Biometric verification successful!",
          "success"
        );

        // Call success callback with the final response data
        onSuccess({
          token: finalToken,
          data: response.data,
          encrypted_data: response.encrypted_data,
          message: response.message,
          biometricVerified: true,
        });

        // setShowBiometricModal(false);
        // onClose();
      } else if (error) {
        showToast(error?.message || "Biometric verification failed", "error");
      }
    } catch (err) {
      console.error("Biometric 2FA failed:", err);
      showToast("Biometric verification failed", "error");
    }
  };

  const handleBiometricClose = () => {
    setShowBiometricModal(false);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <>
      {/* OTP Modal */}
      <Modal
        open={open && !showBiometricModal}
        onClose={() => {
          if (!otpLoading) {
            setHasSentOtp(false); // Reset when manually closed
            onClose();
          }
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open && !showBiometricModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Enter OTP
            </Typography>

            <TextField
              fullWidth
              label="OTP"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              inputProps={{
                maxLength: 6,
                inputMode: "numeric",
              }}
              sx={{ mb: 2 }}
            />

            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  onClick={() => {
                    setHasSentOtp(false);
                    onClose();
                  }}
                  disabled={otpLoading}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleOtpSubmit}
                  disabled={otpLoading || otp.length !== 6}
                  variant="contained"
                >
                  {otpLoading ? <CircularProgress size={24} /> : "Verify OTP"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Biometric 2FA Modal */}
      {showBiometricModal && (
        <AEPS2FAModal
          open={showBiometricModal}
          onClose={handleBiometricClose}
          title="Biometric Verification"
          formData={{
            mobile_number: mobileNumber,
          }}
          setFormData={() => {}}
          banks={[]}
          fingerData={handleBiometricSuccess}
          aadhaar={registrationData?.aadhar_number || aadhaar}
          setAadhaar={setAadhaar}
          onFingerSuccess={handleBiometricSuccess}
          type="registerRemitter"
        />
      )}
    </>
  );
};
export default LevinDmtRemitter2Fa;
