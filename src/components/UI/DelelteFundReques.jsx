import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardMedia,
  Chip,
} from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";
import CommonMpinModal from "../common/CommonMpinModal";

const DeleteFundRequest = ({ open, handleClose, row, onFetchRef }) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);

  const handleDelete = async (mpin) => {
    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("id", row.id);
    formDataToSend.append("mpin", mpin);

    const { response, error } = await apiCall(
      "POST",
      ApiEndpoints.DELETE_FUND_REQUEST,
      formDataToSend
    );

    if (response) {
      showToast("Fund request deleted successfully", "success");
      onFetchRef();
      handleClose();
    } else {
      showToast(error?.message || "Delete failed", "error");
    }

    setSubmitting(false);
  };

  const handleSendClick = () => {
    setMpinModalOpen(true);
  };

  return (
    <>
      <CommonModal
        open={open}
        onClose={handleClose}
        title="Delete Fund Request"
        iconType="delete"
        size="medium"
        dividers
        layout="one-column"
        customContent={
          <Box mt={2}>
            <Typography variant="h6" gutterBottom color="error">
              Are you sure you want to delete this fund request?
            </Typography>

            {/* Show details */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body1">
                <strong>Bank:</strong> {row?.bank_name}
              </Typography>
              <Typography variant="body1">
                <strong>Mode:</strong> {row?.mode}
              </Typography>
              <Typography variant="body1">
                <strong>Reference ID:</strong> {row?.bank_ref_id}
              </Typography>
              <Typography variant="body1">
                <strong>Amount:</strong> ₹{row?.amount}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {row?.date}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {row?.status}
              </Typography>
            </Box>
          </Box>
        }
        footerButtons={[
          {
            text: "Cancel",
            variant: "outlined",
            onClick: handleClose,
            disabled: submitting,
          },
          {
            text: submitting ? "Deleting..." : "Delete",
            variant: "contained",
            color: "error",
            onClick: handleSendClick,
            disabled: submitting,
          },
        ]}
      />

      {/* MPIN confirmation modal */}
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Enter MPIN to Confirm Delete"
        mPinCallBack={handleDelete}
      />
    </>
  );
};

export default DeleteFundRequest;
