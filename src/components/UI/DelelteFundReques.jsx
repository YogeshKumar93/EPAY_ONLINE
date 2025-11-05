import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <>
      <CommonModal
        open={open}
        onClose={handleClose}
        title="Delete Fund Request"
        iconType="delete"
        size="small"
        dividers
        layout="one-column"
        customContent={
          <Box>
            {/* Warning Alert */}
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{
                mb: 3,
                borderRadius: 2,
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                This action cannot be undone
              </Typography>
            </Alert>

            {/* Fund Request Details */}
            <Card
              variant="outlined"
              sx={{
                mb: 3,
                borderRadius: 2,
                borderColor: "warning.light",
                backgroundColor: "warning.lightest",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="text.primary"
                      fontWeight={600}
                    >
                      ₹{row?.amount}
                    </Typography>
                    <Chip
                      label={row?.status}
                      color={getStatusColor(row?.status)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Divider />

                  <Stack spacing={1.5}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Bank:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {row?.bank_name}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Mode:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {row?.mode}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Reference ID:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        fontFamily="monospace"
                      >
                        {row?.bank_ref_id}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Date:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {row?.date}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Confirmation Text */}
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 1 }}
            >
              Please confirm you want to permanently delete this fund request.
            </Typography>
          </Box>
        }
        footerButtons={[
          {
            text: "Cancel",
            variant: "outlined",
            onClick: handleClose,
            disabled: submitting,
            sx: { minWidth: 100 },
          },
          {
            text: submitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} />
                Deleting...
              </Box>
            ) : (
              "Delete"
            ),
            variant: "contained",
            color: "error",
            onClick: handleSendClick,
            startIcon: !submitting && <DeleteIcon />,
            disabled: submitting,
            sx: {
              minWidth: 120,
              backgroundColor: "error.main",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            },
          },
        ]}
      />

      {/* MPIN confirmation modal */}
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Confirm Deletion"
        subtitle="Enter your MPIN to permanently delete this fund request"
        mPinCallBack={handleDelete}
      />
    </>
  );
};

export default DeleteFundRequest;
