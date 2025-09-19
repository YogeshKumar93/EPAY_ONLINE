import React, { useState } from "react";
import { Box, Modal, Typography, IconButton } from "@mui/material";
import OtpInput from "react-otp-input";
import { CheckCircle } from "@mui/icons-material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useToast } from "../utils/ToastContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const BlockUnblockUser = ({ open, handleClose, user, onSuccess }) => {
  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { showToast } = useToast();

  if (!user) return null;

  const handleCloseModal = () => {
    handleClose();
    setMpin("");
    setErr("");
  };

  const handleConfirm = async () => {
    if (mpin.length !== 6) {
      setErr("Please enter a valid 6-digit MPIN");
      return;
    }

    try {
      setLoading(true);
      const newStatus = user.is_active === 1 ? 0 : 1;

      const payload = {
        id: user.id,
        is_active: newStatus,
        mpin: mpin,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.UPDATE_USER_STATUS,
        payload
      );

      if (response) {
        okSuccessToast(response?.message);
        handleCloseModal();
        if (onSuccess) onSuccess();
      } else {
        showToast(error?.message || "Something went wrong", "error");
      }
    } catch (error) {
      apiErrorToast("API Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={1}>
          {user.is_active === 1 ? "Block User" : "Unblock User"}
        </Typography>

        {/* Instruction Text */}
        <Typography variant="body2" color="textSecondary" mb={2}>
          Please enter your 6-digit MPIN to{" "}
          {user.is_active === 1 ? "block" : "unblock"} user <b>{user.name}</b>
        </Typography>

        {/* MPIN Input Fields */}
        <OtpInput
          value={mpin}
          onChange={setMpin}
          numInputs={6}
          isInputSecure={true}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            width: "40px",
            height: "40px",
            margin: "0 5px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "2px solid #ccc",
            textAlign: "center",
          }}
          focusStyle={{
            border: "2px solid #1976d2",
          }}
        />

        {err && (
          <Typography variant="body2" color="error" mt={2}>
            {err}
          </Typography>
        )}

        {/* Confirm Button */}
        <IconButton
          color={user.is_active === 1 ? "error" : "success"}
          onClick={handleConfirm}
          disabled={loading}
          sx={{ mt: 3 }}
        >
          <CheckCircle sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default BlockUnblockUser;
