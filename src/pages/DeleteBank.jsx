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

const DeleteBank = ({ open, handleClose, selectedBank,onFetchRef}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const { error, response } = await apiCall(
        "POST",
        `${ApiEndpoints.DELETE_BANK}`,
        { id: selectedBank.id } 
      );

      if  (response) {
        onFetchRef();
        handleClose();
      } else {
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
      title="Delete Bank"
      maxWidth="xs"
   footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: handleClose
        },
        {
          text: loading ? "Deleting..." : "Confirm",
          variant: "contained",
          onClick: handleConfirmDelete,
          disabled: loading
        }
      ]}
    >
      <Box sx={{ p: 2 }}>
       <Typography sx={{ mt: 3 }}>
  Are you sure you want to delete bank{" "}
  <b>{selectedBank?.bank_name}</b>?
</Typography>



       


      </Box>
    </CommonModal>
  );
};

export default DeleteBank;
