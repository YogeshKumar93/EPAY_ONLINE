import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { useToast } from "../../utils/ToastContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
const LevinDmtRemitterRegister = ({
  mobileNumber,
  encryptedData,
  onRegistrationSuccess,
  onBack,
}) => {
  console.log("Encrypted Data in RegisterRemitter:", encryptedData);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showOtpModal, setShowOtpModal] = useState(false); // Add this state
  const [registrationResponse, setRegistrationResponse] = useState(null); // Store API response
  const [formData, setFormData] = useState({
    mobile_number: mobileNumber,
    aadhar_number: "",
    first_name: "",
    last_name: "",
  });
  const { showToast } = useToast();

  const steps = ["Aadhar Verification", "OTP Verification", "Confirmation"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAadharSubmit = async (e) => {
    e.preventDefault();

    if (!formData.aadhar_number || formData.aadhar_number.length !== 12) {
      showToast("Please enter a valid 12-digit Aadhar number", "error");
      return;
    }

    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_DMT_REGISTER_REM,
        {
          mobile_number: formData?.mobile_number,
          aadhar_number: formData?.aadhar_number,
          first_name: formData?.first_name,
          last_name: formData?.last_name,
          token: encryptedData?.data,
        }
      );

      if (response) {
        showToast(
          response?.message || "Aadhar verified! Please enter OTP",
          "success"
        );

        // Store the API response
        setRegistrationResponse(response);
        
        // Move to OTP step
        setActiveStep(1);
        
        // AUTO OPEN OTP MODAL when API response is received
        setShowOtpModal(true);
        
        // Pass the registration data to parent for 2FA component
        onRegistrationSuccess({
          type: 'aadhar_verified',
          data: response.data, // This contains your token "aff667d3-0d96-4f80-bd1f-c85d3d6832ac"
          encrypted_data: response.encrypted_data, // This contains your encrypted data
          mobileNumber: mobileNumber,
          formData: formData,
          message: response.message
        });
      } else {
        showToast(error?.message || "Aadhar verification failed", "error");
      }
    } catch (err) {
      console.error("Registration API call failed:", err);
      showToast("Aadhar verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpModalClose = () => {
    setShowOtpModal(false);
  };

  const handleOtpSuccess = (token) => {
    setShowOtpModal(false);
    setActiveStep(2); // Move to confirmation step
    showToast("Registration completed successfully!", "success");
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleAadharSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Aadhar Number"
              name="aadhar_number"
              value={formData.aadhar_number}
              onChange={handleInputChange}
              placeholder="Enter 12-digit Aadhar number"
              inputProps={{
                maxLength: 12,
                inputMode: "numeric",
              }}
              sx={{ mb: 3 }}
              error={
                formData.aadhar_number.length > 0 &&
                formData.aadhar_number.length !== 12
              }
              helperText={
                formData.aadhar_number.length > 0 &&
                formData.aadhar_number.length !== 12
                  ? "Aadhar number must be 12 digits"
                  : "Enter your 12-digit Aadhar number for registration"
              }
            />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button onClick={onBack} variant="outlined">
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || formData.aadhar_number.length !== 12}
              >
                {loading ? <CircularProgress size={24} /> : "Verify Aadhar"}
              </Button>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Aadhar verified successfully! OTP has been sent to your mobile.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please check the OTP modal to enter the verification code.
            </Typography>
            <Button 
              onClick={() => setShowOtpModal(true)} 
              variant="outlined"
            >
              Open OTP Modal
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              Registration Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your remitter registration has been completed successfully.
            </Typography>
            <Button 
              onClick={onRegistrationSuccess} 
              variant="contained"
            >
              Continue to DMT
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Register Remitter
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Mobile Number: {mobileNumber}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </CardContent>
      </Card>

      {/* OTP Modal that opens automatically when API response is received */}
      {registrationResponse && (
        <LevinDmtRemitter2Fa
          open={showOtpModal}
          onClose={handleOtpModalClose}
          mobileNumber={mobileNumber}
          registrationData={{
            type: 'aadhar_verified',
            data: registrationResponse.data, // Your token "aff667d3-0d96-4f80-bd1f-c85d3d6832ac"
            encrypted_data: registrationResponse.encrypted_data, // Your encrypted data
            mobileNumber: mobileNumber,
            formData: formData,
            aadhar_number: formData.aadhar_number
          }}
          onSuccess={handleOtpSuccess}
        />
      )}
    </>
  );
};
export default LevinDmtRemitterRegister;
