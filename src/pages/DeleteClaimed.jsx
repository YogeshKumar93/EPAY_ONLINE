import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { okSuccessToast } from "../utils/ToastUtil";
import { useToast } from "../utils/ToastContext";

const DeleteClaimed = ({ open, handleClose, selectedClaim, onFetchRef }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const { error, response } = await apiCall(
        "POST",
        `${ApiEndpoints.DELETE_BANK}`,
        { id: selectedClaim.id }
      );

      if (response) {
        okSuccessToast(response?.message);
        onFetchRef();
        handleClose();
      } else {
        showToast(error?.message, "error");
        console.error("Delete failed:", error || response);
      }
    } catch (err) {
      console.error("Error deleting account:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Delete Claim"
      maxWidth="xs"
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: handleClose,
        },
        {
          text: loading ? "Deleting..." : "Confirm",
          variant: "contained",
          onClick: handleConfirmDelete,
          disabled: loading,
        },
      ]}
    >
      <Box sx={{ p: 2 }}>
        <Typography sx={{ mt: 3 }}>
          Are you sure you want to delete claimed entry <b>{selectedClaim?.bank_name}</b>?
        </Typography>
      </Box>
    </CommonModal>
  );
};

export default DeleteClaimed;
