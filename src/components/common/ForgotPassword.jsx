import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";
import { PATTERNS } from "../../utils/validators";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { useToast } from "../../utils/ToastContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "rgb(247, 228, 228)", // clean white background
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)", // soft shadow
  borderRadius: 3,
  p: 4,
  border: "1px solid #e0e0e0", // light border
};

const ForgotPassword = ({ open, onClose, initialUsername = "" }) => {
  const [username, setUsername] = useState(initialUsername);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const { showToast } = useToast();
  useEffect(() => {
    if (open) {
      setUsername(initialUsername);
      setIsValid(true);
    }
  }, [open, initialUsername]);
  const handleSubmit = async (e) => {
    e?.preventDefault?.(); // safe if called from a form submit
    setLoading(true);

    // use state directly (or rename)
    const payload = username.trim();

    const { response, error } = await apiCall(
      "post",
      ApiEndpoints.FORGOT_PASS,
      { username: payload }
    );

    if (response) {
      okSuccessToast("Password sent successfully", "success");
      onClose();
    } else {
      showToast(error?.message || error || "Something went wrong", "error");
    }

    setLoading(false);
  };

  console.log("the use nma r ia in a", username);
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" color="#000">
            Forgot Password
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#000" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          label="Registered User Id "
          type="text"
          disabled
          value={username}
          onChange={(e) => {
            const value = e.target.value.trim();
            setUsername(value);

            // ✅ Validation: 10-digit mobile OR non-empty string
            if (/^\d{10}$/.test(value) || /^[a-zA-Z0-9_]{3,}$/.test(value)) {
              setIsValid(true);
            } else {
              setIsValid(false);
            }
          }}
          error={!isValid}
          helperText={
            !isValid ? "Enter valid 10-digit mobile number or username" : ""
          }
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: "#000" } }}
          InputProps={{
            style: {
              color: "#000",
              borderRadius: "10px",
            },
          }}
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          onClick={handleSubmit}
          disabled={loading || !isValid}
          sx={{
            mt: 1,
            backgroundColor: "#FF6B6B",
            "&:hover": { backgroundColor: "#D43F3F" },
          }}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ForgotPassword;
