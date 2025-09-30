import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";

const OtpInput = ({ open, onClose, onSubmit, submitting }) => {
  const [otp, setOtp] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);

  const handleSubmit = () => {
    if (otp.length !== 6) {
      alert("Please enter 6-digit OTP");
      return;
    }
    onSubmit(otp);
    setOtp("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" align="center">
          Enter OTP
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={2} align="center">
          Please enter the OTP sent to your mobile
        </Typography>

        {/* OTP Input Boxes */}
        <Box
          display="flex"
          justifyContent="center"
          gap={1}
          onClick={() => inputRef.current.focus()}
        >
          {/* hidden input */}
          <input
            ref={inputRef}
            type="tel"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
          />

          {Array.from({ length: 6 }).map((_, i) => {
            const isActive = i === otp.length; // highlight current position
            return (
              <Box
                key={i}
                sx={{
                  width: 40,
                  height: 50,
                  border: "2px solid",
                  borderColor: isActive ? "#1976d2" : "#ccc", // blue for active
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  cursor: "text",
                  transition: "border-color 0.2s",
                }}
              >
                {otp[i] || ""}
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Validating..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpInput;
