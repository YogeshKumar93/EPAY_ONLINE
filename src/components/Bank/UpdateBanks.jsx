import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { PATTERNS, isValid } from "../../utils/validators";
import { useToast } from "../../utils/ToastContext";

const UpdateBanks = ({ open, onClose, bankData, onFetchRef }) => {
  const [formData, setFormData] = useState({
    bank_name: "",
    ifsc: "",
    acc_number: "",
    balance: "",
    id: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Pre-fill form when modal opens
  useEffect(() => {
    if (open && bankData) {
      setFormData({
        bank_name: bankData.bank_name || "",
        ifsc: bankData.ifsc || "",
        acc_number: bankData.acc_number || "",
        balance: bankData.balance || "",
        id: bankData.id || "",
      });
      setErrors({});
    }
  }, [open, bankData]);

  // ✅ Handle field change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!isValid(PATTERNS.BANK_NAME, formData.bank_name))
      newErrors.bank_name = "Enter a valid bank name (min 3 characters)";
    if (!isValid(PATTERNS.IFSC, formData.ifsc))
      newErrors.ifsc = "Enter a valid IFSC code";
    if (!isValid(PATTERNS.ACCOUNT_NUMBER, formData.acc_number))
      newErrors.acc_number = "Account number must be 6–18 digits";
    if (!formData.balance || isNaN(formData.balance))
      newErrors.balance = "Enter a valid balance amount";
    else if (Number(formData.balance) < 0)
      newErrors.balance = "Balance cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit updates
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== bankData[key]) {
        changedFields[key] = formData[key];
      }
    });
    changedFields.id = bankData.id;

    if (Object.keys(changedFields).length <= 1) {
      showToast("No changes detected", "info");
      return;
    }

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_BANK,
        changedFields
      );

      if (response) {
        showToast(response?.message || "Bank updated successfully", "success");
        onFetchRef();
        onClose();
      } else {
        showToast(error?.message || "Failed to update bank", "error");
      }
    } catch {
      showToast("Something went wrong while updating", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!submitting ? onClose : null}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 1.5 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: 18 }}>
        Update Bank Details
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Bank Name"
            fullWidth
            value={formData.bank_name}
            onChange={(e) => handleChange("bank_name", e.target.value)}
            error={!!errors.bank_name}
            helperText={errors.bank_name}
          />

          <TextField
            label="IFSC Code"
            fullWidth
            value={formData.ifsc}
            onChange={(e) => handleChange("ifsc", e.target.value)}
            error={!!errors.ifsc}
            helperText={errors.ifsc}
          />

          <TextField
            label="Account Number"
            fullWidth
            value={formData.acc_number}
            onChange={(e) => handleChange("acc_number", e.target.value)}
            error={!!errors.acc_number}
            helperText={errors.acc_number}
          />

          <TextField
            label="Balance"
            type="number"
            fullWidth
            disabled
            value={formData.balance}
            onChange={(e) => handleChange("balance", e.target.value)}
            error={!!errors.balance}
            helperText={errors.balance}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ pr: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={submitting}
        >
          {submitting ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={18} color="inherit" /> Updating...
            </Box>
          ) : (
            "Update"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBanks;
