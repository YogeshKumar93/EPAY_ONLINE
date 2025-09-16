import React, { useState } from "react";
import CommonModal from "../components/common/CommonModal";
import { Box, Typography } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import { okSuccessToast } from "../utils/ToastUtil";

const DeleteBeneDmt2 = ({ open, onClose, beneficiary, sender, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!beneficiary) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const payload = {
        sender_id: sender?.id,
        rem_mobile: sender?.mobile,
        ben_id: beneficiary?.bene_id,
      };

      const response = await apiCall(
        "post",
        ApiEndpoints.DMT2_REMOVE_BENEFICIARY,
        payload
      );
      console.log("🟢 Delete API Response:", response);

      // ✅ Check success
      if (response) {
        okSuccessToast(response?.response?.message);
        onSuccess?.(); // refresh list or callback
        handleClose();
      } else {
        showToast(
          response?.response?.message || "Failed to delete beneficiary",
          "error"
        );
      }
    } catch (err) {
      console.error("❌ Delete Error:", err);
      showToast(err.message || "Unexpected error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Delete Beneficiary"
      iconType="warning"
      size="small"
      dividers
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: handleClose,
          disabled: loading,
        },
        {
          text: loading ? "Deleting..." : "Delete",
          variant: "contained",
          color: "error",
          onClick: handleDelete,
          disabled: loading,
        },
      ]}
    >
      <Box>
        <Typography variant="body2">
          Are you sure you want to delete{" "}
          <strong>
            {beneficiary?.beneficiary_name} {beneficiary?.account_number}
          </strong>
          ?
        </Typography>
      </Box>
    </CommonModal>
  );
};

export default DeleteBeneDmt2;
