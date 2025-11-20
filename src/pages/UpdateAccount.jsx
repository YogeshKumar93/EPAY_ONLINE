// src/components/accounts/UpdateAccount.js
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
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import { isValid, PATTERNS } from "../utils/validators";

const UpdateAccount = ({ open, handleClose, onFetchRef, selectedAccount }) => {
  const [formData, setFormData] = useState({
    id: "",
    credit_limit: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Pre-fill form with selectedAccount data
  useEffect(() => {
    if (open && selectedAccount) {
      setFormData({
        id: selectedAccount.id || "",
        credit_limit: selectedAccount.credit_limit || "",
      });
    }
  }, [open, selectedAccount]);

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (formData.credit_limit !== "" && Number(formData.credit_limit) < 0)
      newErrors.credit_limit = "Credit limit cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit update
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_ACCOUNT,
        formData
      );

      if (response) {
        showToast(
          response?.message || "Account updated successfully",
          "success"
        );
        onFetchRef?.();
        handleClose();
      } else {
        showToast(error?.message || "Failed to update account", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600, color:"#492077" }}>Update Account</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Credit Limit"
            name="credit_limit"
            type="number"
            value={formData.credit_limit}
            onChange={(e) =>
              setFormData({ ...formData, credit_limit: e.target.value })
            }
            error={!!errors.credit_limit}
            helperText={errors.credit_limit}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
        variant="contained"
         
        sx={{  backgroundColor:"#492077",  color:"primary"}}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} /> Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateAccount;
