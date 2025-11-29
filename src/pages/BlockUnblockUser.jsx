import React, { useState, useContext } from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const BlockUnblockUser = ({ open, handleClose, user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const authCtx = useContext(AuthContext);

  if (!user) return null;

  const handleCloseModal = () => {
    handleClose();
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const newStatus = user.is_active === 1 ? 0 : 1;

      const payload = {
        id: user.id,
        is_active: newStatus,
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
        <Typography variant="h6" mb={1} fontWeight="bold">
          {user.is_active === 1 ? "Block User" : "Unblock User"}
        </Typography>

        {/* Basic Confirmation */}
        <Typography variant="body1" mt={1}>
          Are you sure you want to{" "}
          <b style={{ color: user.is_active ? "red" : "green" }}>
            {user.is_active === 1 ? "BLOCK" : "UNBLOCK"}
          </b>{" "}
          this user?
        </Typography>

        {/* User Details */}
        <Typography variant="body2" mt={1}>
          User: <b>{user.name}</b>
        </Typography>

        <Typography variant="body2">
          Current Status:{" "}
          <b style={{ color: user.is_active ? "green" : "red" }}>
            {user.is_active === 1 ? "Active" : "Inactive"}
          </b>
        </Typography>

        {/* ⚠ Extra Confirmation Text */}
        <Typography
          variant="body2"
          mt={2}
          sx={{
            color: "#d32f2f",
            fontWeight: "bold",
            background: "#ffe6e6",
            padding: "8px",
            borderRadius: "6px",
          }}
        >
          ⚠ This action cannot be undone. Do you want to proceed?
        </Typography>

        {/* Confirm Button */}
        <Button
          variant="contained"
          color={user.is_active === 1 ? "error" : "success"}
          onClick={handleConfirm}
          disabled={loading}
          sx={{ mt: 3, width: "100%", fontWeight: "bold" }}
        >
          {loading
            ? "Processing..."
            : user.is_active === 1
            ? "Yes, Block User"
            : "Yes, Unblock User"}
        </Button>

        {/* Cancel Button */}
        <Button
          variant="text"
          onClick={handleCloseModal}
          sx={{ mt: 1, width: "100%" }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default BlockUnblockUser;
