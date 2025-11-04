// components/UpiVerificationModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const UpiVerificationModal = ({
  open,
  onClose,
  onVerify,
  mpinDigits,
  setMpinDigits,
  submitting,
}) => {
  const handleMpinChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const updated = [...mpinDigits];
      updated[index] = value;
      setMpinDigits(updated);
      if (value && index < 5)
        document.getElementById(`verify-mpin-${index + 1}`)?.focus();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 600,
          backgroundColor: "#f7f7f9",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Verify Beneficiary
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Typography
          variant="body2"
          align="center"
          sx={{ mb: 2, color: "text.secondary" }}
        >
          Please enter your 6-digit MPIN to verify this beneficiary.
        </Typography>

        <Grid container spacing={1} justifyContent="center">
          {mpinDigits.map((digit, idx) => (
            <Grid item key={idx}>
              <TextField
                id={`verify-mpin-${idx}`}
                value={digit}
                type="password"
                onChange={(e) => handleMpinChange(idx, e.target.value)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "1.2rem",
                    width: "45px",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onVerify}
          variant="contained"
          sx={{ backgroundColor: "#5c3ac8", textTransform: "none" }}
          disabled={submitting}
        >
          {submitting ? "Verifying..." : "Verify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpiVerificationModal;
