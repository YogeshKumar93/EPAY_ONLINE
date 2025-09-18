import React, { useState } from "react";
import CommonModal from "../components/common/CommonModal";
import { Box, Typography, TextField } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import { okSuccessToast } from "../utils/ToastUtil";

const DeleteBeneDmt2 = ({ open, onClose, beneficiary, sender, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [mpin, setMpin] = useState(Array(6).fill(""));
  const { showToast } = useToast();

  if (!beneficiary) return null;

  // Handle MPIN input change
  const handleMpinChange = (value, index) => {
    if (value.length > 1) return; // allow only single digit
    const updated = [...mpin];
    updated[index] = value;
    setMpin(updated);

    // auto-focus next field
    if (value && index < 5) {
      document.getElementById(`mpin-${index + 1}`).focus();
    }
  };

  // Join digits and call delete API
  const handleDelete = async () => {
    const finalMpin = mpin.join("");
    if (finalMpin.length !== 6) {
      showToast("Please enter 6-digit MPIN", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        sender_id: sender?.id,
        rem_mobile: sender?.mobile,
        ben_id: beneficiary?.bene_id,
        mpin: finalMpin,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.DMT2_REMOVE_BENEFICIARY,
        payload
      );

      if (response) {
        okSuccessToast(
          response?.response?.message || "Beneficiary deleted successfully"
        );
        onSuccess?.();
        handleClose();
      } else {
        showToast(
          error?.response?.message || "Failed to delete beneficiary",
          "error"
        );
      }
    } catch (err) {
      showToast(err.message || "Unexpected error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMpin(Array(6).fill(""));
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
      <Box mb={2}>
        <Typography variant="body2" mb={1}>
          Enter your 6-digit MPIN to delete{" "}
          <strong>
            {beneficiary?.beneficiary_name} {beneficiary?.account_number}
          </strong>
        </Typography>

        {/* MPIN Boxes */}
        <Box display="flex" justifyContent="center" gap={1} mt={2}>
          {mpin.map((digit, index) => (
            <TextField
              key={index}
              id={`mpin-${index}`}
              value={digit}
              onChange={(e) => handleMpinChange(e.target.value, index)}
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center", fontSize: "20px" },
              }}
              sx={{ width: 40 }}
            />
          ))}
        </Box>
      </Box>
    </CommonModal>
  );
};

export default DeleteBeneDmt2;
