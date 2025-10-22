import React, { useContext, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Grid,
} from "@mui/material";
import { Verified, ErrorOutline } from "@mui/icons-material";
import CommonModal from "./CommonModal";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import AuthContext from "../../contexts/AuthContext";
import { apiCall } from "../../api/apiClient";
const NumberVerificationComponent = ({ open, onClose, username }) => {
  const [step, setStep] = useState(1); // 1 = initiate, 2 = verify
  const [formData, setFormData] = useState({
    oldNumber: username,
    newNumber: "",
    oldOtp: "",
    newOtp: "",
  });
  const [otpRefs, setOtpRefs] = useState({ old_otp_ref: "", new_otp_ref: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.oldNumber) newErrors.oldNumber = "Old number is required";
    if (!formData.newNumber) newErrors.newNumber = "New number is required";
    if (formData.oldNumber === formData.newNumber) {
      newErrors.newNumber = "New number must be different";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitiate = async () => {
    if (!validateStep1()) return;

    const payload = {
      old_number: formData.oldNumber,
      new_number: formData.newNumber,
    };

    const { response, error } = await apiCall(
      "post",
      ApiEndpoints.INITIATE_NUMBER,
      payload
    );

    if (response) {
      setOtpRefs({
        old_otp_ref: response?.data?.old_otp_ref,
        new_otp_ref: response?.data?.new_otp_ref,
      });
      okSuccessToast(response?.message || "OTP sent to both numbers");
      setMessage("OTP sent to old and new numbers");
      setStep(2); // go to verification step
    } else {
      apiErrorToast(error?.message || "Failed to send OTPs");
    }
  };

  const handleVerify = async () => {
    if (!formData.oldOtp || !formData.newOtp) {
      setErrors({
        oldOtp: !formData.oldOtp ? "Old OTP required" : "",
        newOtp: !formData.newOtp ? "New OTP required" : "",
      });
      return;
    }

    const payload = {
      old_number: formData.oldNumber,
      new_number: formData.newNumber,
      old_mobile_otp: formData.oldOtp,
      new_mobile_otp: formData.newOtp,
      old_otp_ref: otpRefs.old_otp_ref,
      new_otp_ref: otpRefs.new_otp_ref,
    };

    const { response, error } = await apiCall(
      "post",
      ApiEndpoints.VERIFY_CHAGNE_NUMBER,
      payload
    );

    if (response) {
      okSuccessToast(response?.message || "Number changed successfully");
      setMessage("Mobile Number Changed Successfully!");
      setIsVerified(true);
      logout(); // force re-login after number change
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      apiErrorToast(error?.message || "OTP verification failed");
      setMessage(error?.message || "OTP verification failed");
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Change Mobile Number"
      footerButtons={[]}
    >
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
          {step === 1 ? "Initiate Number Change" : "Verify OTPs"}
        </Typography>

        <Box>
          <Grid container spacing={2}>
            {step === 1 ? (
              <>
                {/* Old Number */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Old Number"
                    name="oldNumber"
                    value={formData.oldNumber}
                    onChange={handleInputChange}
                    error={!!errors.oldNumber}
                    helperText={errors.oldNumber}
                    placeholder="Enter your old number"
                  />
                </Grid>

                {/* New Number */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Number"
                    name="newNumber"
                    value={formData.newNumber}
                    onChange={handleInputChange}
                    error={!!errors.newNumber}
                    helperText={errors.newNumber}
                    placeholder="Enter your new number"
                  />
                </Grid>

                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Button variant="contained" onClick={handleInitiate}>
                    Send OTP's
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                {/* Old OTP */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="OTP sent to Old Number"
                    name="oldOtp"
                    value={formData.oldOtp}
                    onChange={handleInputChange}
                    error={!!errors.oldOtp}
                    helperText={errors.oldOtp}
                    placeholder="Enter OTP"
                  />
                </Grid>

                {/* New OTP */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="OTP sent to New Number"
                    name="newOtp"
                    value={formData.newOtp}
                    onChange={handleInputChange}
                    error={!!errors.newOtp}
                    helperText={errors.newOtp}
                    placeholder="Enter OTP"
                  />
                </Grid>

                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Button variant="contained" onClick={handleVerify}>
                    Verify & Change Number
                  </Button>
                </Grid>
              </>
            )}

            {message && (
              <Grid item xs={12}>
                <Alert
                  severity={isVerified ? "success" : "info"}
                  icon={isVerified ? <Verified /> : <ErrorOutline />}
                >
                  {message}
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </CommonModal>
  );
};

export default NumberVerificationComponent;
