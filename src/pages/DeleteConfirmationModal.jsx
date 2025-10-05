import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";

const DeleteConfirmationModal = ({
  open,
  handleClose,
  onFetchRef,
  userId,
  account_id,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.DELETE_ACCOUNT_LAST,
        { account_id: account_id } // backend deletes last transaction automatically
      );

      if (response) {
        onFetchRef?.();
        handleClose();
      } else {
        console.error("Delete failed:", error || response);
      }
    } catch (err) {
      console.error("Error deleting account statement:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Delete Last Account Statement"
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
        <Typography sx={{ mt: 1 }}>
          Are you sure you want to delete the last account statement?
        </Typography>
      </Box>
    </CommonModal>
  );
};

export default DeleteConfirmationModal;
