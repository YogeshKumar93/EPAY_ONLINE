// DeleteNotification.js
import React, { useState } from "react";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";
import { Box, Typography } from "@mui/material";

const DeleteNotification = ({ open, onClose, notificationId ,onFetchRef}) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!notificationId) {
      showToast("Invalid notification", "error");
      return;
    }

    setSubmitting(true);

    try {
      const { response, error } = await apiCall(
        "POST",
        `${ApiEndpoints.DELETE_NOTIFICATION}`,
        { id: notificationId } // Make sure your API expects ID in body
      );

      if (response) {
        showToast(response.message || "Notification deleted successfully", "success");
        onFetchRef();
        onClose();
      } else {
        showToast(error?.message || "Failed to delete notification", "error");
      }
    } catch (err) {
      console.error("Unexpected API error:", err);
      showToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <CommonModal
      open={open}
      onClose={onClose}
      title="Delete Notification"
      iconType="delete"
      size="small"
      dividers
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: onClose,
          disabled: submitting,
        },
        {
          text: submitting ? "Deleting..." : "Delete",
          variant: "contained",
          color: "error",
          onClick: handleDelete,
          disabled: submitting,
        },
      ]}
    >
      {/* Children of CommonModal become the modal body */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80px",
          textAlign: "center",
        }}
      >
        <Typography variant="body1">
          Are you sure you want to delete this notification?
        </Typography>
      </Box>
    </CommonModal>
  );

};

export default DeleteNotification;
