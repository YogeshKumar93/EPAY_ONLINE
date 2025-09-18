import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MpinInput = ({
  open,
  onClose,
  title = "Enter MPIN",
  length = 6,
  onSubmit,
  submitting = false,
  errorMsg = "",
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [mpin, setMpin] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!open) {
      setMpin(Array(length).fill(""));
    }
  }, [open, length]);

  const handleChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    const newMpin = [...mpin];
    newMpin[index] = val;
    setMpin(newMpin);

    if (val && index < length - 1) inputRefs.current[index + 1].focus();
    if (!val && index > 0) inputRefs.current[index - 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !mpin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1].focus();
    if (e.key === "ArrowRight" && index < length - 1)
      inputRefs.current[index + 1].focus();
  };

  const handleSubmit = () => {
    const pin = mpin.join("");
    if (pin.length !== length) return;
    onSubmit?.(pin);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, p: 0, overflow: "hidden" } }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f1f5f9",
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box display="flex" gap={1.5}>
          {mpin.map((digit, i) => (
            <input
              key={i}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[i] = el)}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 40,
                height: 50,
                textAlign: "center",
                fontSize: "1.5rem",
                borderRadius: 6,
                border: errorMsg ? "2px solid red" : "1px solid #ccc",
              }}
            />
          ))}
        </Box>
        {errorMsg && (
          <Typography variant="body2" color="error">
            {errorMsg}
          </Typography>
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          gap: 2,
          backgroundColor: "#f1f5f9",
        }}
      >
        <Button onClick={onClose} variant="outlined" disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? "Verifying..." : "Verify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MpinInput;
