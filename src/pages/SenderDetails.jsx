import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Chip,
  Avatar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CommonModal from "../components/common/CommonModal";
import PayoutModal from "./PayoutModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useSchemaForm } from "../hooks/useSchemaForm";

const SenderDetails = ({ sender, onSuccess }) => {
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [beneficiaryForPayout, setBeneficiaryForPayout] = useState(null);
  const [openPayout, setOpenPayout] = useState(false);

  // ✅ load schema for add beneficiary
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    loading,
  } = useSchemaForm(ApiEndpoints.ADD_BENEFICIARY_SCHEMA, openModal, {
    sender_id: sender.id,
  });

  // ✅ Add beneficiary
  const handleAddBeneficiary = async () => {
    setSubmitting(true);
    setErrors({});
    try {
      const payload = {
        ...formData,
        sender_id: sender.id,
      };

      const res = await apiCall("post", ApiEndpoints.CREATE_BENEFICIARY, payload);

      if (res) {
        okSuccessToast(res?.message || "Beneficiary added successfully");
        setOpenModal(false);
        if (onSuccess) onSuccess(sender.mobile_number);
      } else {
        apiErrorToast(res?.message || "Failed to add beneficiary");
      }
    } catch (err) {
      apiErrorToast(err);
      setErrors(err?.response?.data?.errors || {});
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Delete beneficiary
  const handleDeleteBeneficiary = async (beneficiaryId) => {
    try {
      const res = await apiCall("post", ApiEndpoints.DELETE_BENEFICIARY, {
        sender_id: sender.id,
        id: beneficiaryId,
      });

      if (res) {
        okSuccessToast(res?.message || "Beneficiary deleted successfully");
        if (onSuccess) onSuccess(sender.mobile_number);
      } else {
        apiErrorToast(res?.message || "Failed to delete beneficiary");
      }
    } catch (err) {
      apiErrorToast(err);
      console.error("Delete Beneficiary Error:", err);
    }
  };

  // ✅ open payout modal
  const handleOpenPayout = (beneficiary) => {
    setBeneficiaryForPayout(beneficiary);
    setOpenPayout(true);
  };

  const getKycColor = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      {/* Sender Card */}
      <Card sx={{ mb: 2, borderRadius: 1 }}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 1.5, width: 32, height: 32 }}>
              {sender.sender_name?.charAt(0) || "S"}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="subtitle1" fontWeight="medium" noWrap>
                {sender.sender_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {sender.mobile_number}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Chip
                label={sender.kyc_status}
                size="small"
                color={getKycColor(sender.kyc_status)}
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
              <Typography variant="caption" display="block" fontWeight="medium">
                ₹{sender.rem_limit?.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Beneficiaries */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" fontWeight="bold">
          BENEFICIARIES
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => setOpenModal(true)}
          startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
          sx={{ minWidth: "auto", px: 1, py: 0.5, fontSize: "0.75rem" }}
        >
          Add
        </Button>
      </Box>

      {sender.beneficiary?.length > 0 ? (
        <List dense sx={{ py: 0 }}>
          {sender.beneficiary.map((b) => (
            <ListItem
              key={b.id}
              sx={{
                py: 0.5,
                px: 1,
                mb: 0.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              secondaryAction={
                <Box>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenPayout(b)}
                  >
                    Pay
                  </Button>
                  <IconButton
                    edge="end"
                    size="small"
                    color="error"
                    onClick={() => handleDeleteBeneficiary(b.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    <AccountBalanceIcon
                      sx={{ mr: 0.5, color: "primary.main", fontSize: 16 }}
                    />
                    <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: 100 }}>
                      {b.beneficiary_name}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" display="block" color="text.secondary" noWrap>
                      A/C: {b.account_number}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {b.bank_name} • {b.ifsc_code}
                    </Typography>
                  </Box>
                }
                sx={{ my: 0 }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Alert severity="info" sx={{ borderRadius: 1, py: 0.5 }}>
          <Typography variant="caption">No beneficiaries found</Typography>
        </Alert>
      )}

      {/* Add Beneficiary Modal */}
      {openModal && (
        <CommonModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Add Beneficiary"
          iconType="info"
          size="small"
          dividers
          fieldConfig={schema}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          loading={loading || submitting}
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: () => setOpenModal(false),
              disabled: submitting,
            },
            {
              text: submitting ? "Saving..." : "Save",
              variant: "contained",
              color: "primary",
              onClick: handleAddBeneficiary,
              disabled: submitting,
            },
          ]}
        />
      )}

      {/* Payout Modal */}
      {openPayout && beneficiaryForPayout && (
        <PayoutModal
          open={openPayout}
          onClose={() => setOpenPayout(false)}
          senderId={sender.id}
          beneficiary={beneficiaryForPayout}
          onSuccess={() => onSuccess && onSuccess(sender.mobile_number)}
        />
      )}
    </Box>
  );
};

export default SenderDetails;
