import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";

const OtpModal = ({ open, onClose, remitterRef }) => {
  const { showToast } = useToast();
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      showToast("Please enter 4-digit OTP", "error");
      return;
    }

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.VERIFY_REMITTER_DMT2,
        {
          mobile_number: remitterRef?.mobile,
          ekyc_id: remitterRef?.ekyc_id,
          stateresp: remitterRef?.stateresp,
          otp,
        }
      );

      if (response?.data?.status) {
        showToast("Remitter verified successfully", "success");
        onClose(true); // pass success flag to parent if needed
      } else {
        showToast(
          error?.message ||
            response?.data?.message ||
            "OTP verification failed",
          "error"
        );
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="4-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            inputProps={{ maxLength: 4 }}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          disabled={submitting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleVerifyOtp}
          disabled={submitting || otp.length !== 4}
          variant="contained"
          sx={{
            backgroundColor: "#2275b7",
            "&:hover": { backgroundColor: "#1b5e94" },
          }}
        >
          {submitting ? "Verifying..." : "Submit OTP"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpModal;
