import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useToast } from "../utils/ToastContext";

const LevinVerifySender = ({
  open,
  onClose,
  mobile,
  otpData,
  onSuccess,
  sender,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]); // Changed to 4 digits
  const inputRefs = useRef([]);
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) setOtp(["", "", "", ""]); // Reset OTP when modal is closed
  }, [open]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus to the next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      apiErrorToast("Please enter full 4-digit OTP");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        mobile_number: mobile,
        otp: enteredOtp,
        otp_ref: otpData?.otp_ref, // Use otp_ref from otpData
        id: otpData?.sender_id, // Use sender_id from otpData
        state: otpData?.state, // Include the state here
      };

      console.log("VERIFY_SENDER payload:", payload);

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.VERIFY_REMITTER_UPI,
        payload
      );

      if (response) {
        okSuccessToast(response?.message || "Sender verified successfully");
        onClose();
        onSuccess?.(mobile); // ✅ Always use the verified mobile number
      } else {
        showToast(error?.message || "Failed to verify sender", "error");
      }
    } catch (err) {
      showToast(err, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiPaper-root": { borderRadius: 3, p: 1 },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Verify Sender</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          {/* Label for OTP */}
          <Typography variant="subtitle1" sx={{ mb: 0, fontWeight: 500 }}>
            Enter OTP
          </Typography>

          {/* OTP Boxes */}
          <Box display="flex" justifyContent="center" gap={2}>
            {otp.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "1.5rem",
                    width: "2rem", // Adjust width
                    height: "2rem", // Adjust height
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions>
        <Button
          onClick={handleVerify}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? "Verifying..." : "Verify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LevinVerifySender;
