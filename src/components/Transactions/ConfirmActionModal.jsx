import React, { useState } from "react";
import { Typography } from "@mui/material";
import CommonModal from "../common/CommonModal";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";

const ConfirmActionModal = ({
  open,
  onClose,
  title = "Confirm Action",
  txnId,
  apiEndpoint,
  onSuccess,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!txnId) return;
    setLoading(true);

    try {
      const { response, error } = await apiCall("post", apiEndpoint, {
        txn_id: txnId,
      });

      if (response?.status) {
        showToast(response.message || "Action completed successfully!", "success");
        if (onSuccess) onSuccess();
      } else {
        showToast(error?.message || "Action failed.", "error");
      }
    } catch (err) {
      showToast("Error performing action.", "error");
    }

    setLoading(false);
    onClose();
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={title}
      footerButtons={[
        {
          text: cancelText,
          variant: "outlined",
          onClick: onClose,
        },
        {
          text: confirmText,
          variant: "contained",
          onClick: handleConfirm,
          disabled: loading,
        },
      ]}
    >
      <Typography sx={{ fontSize: 14 }}>
        Are you sure you want to proceed with transaction ID: {txnId}?
      </Typography>
    </CommonModal>
  );
};

export default ConfirmActionModal;
