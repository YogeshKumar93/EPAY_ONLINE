import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";
import {
  FormControlLabel,
  Checkbox,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  DialogActions,
  TextField,
} from "@mui/material";

const CreateFundRequest = ({ open, handleClose, handleSave }) => {
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    loading,
    setFormData,
  } = useSchemaForm(ApiEndpoints.GET_FUNDREQUEST_SCHEMA, open);

  const [receipt, setReceipt] = useState(null); // ✅ for file
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [termsOpen, setTermsOpen] = useState(false);
  const { showToast } = useToast();
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ Prefill today's date when opened
  useEffect(() => {
    if (open && !formData.date) {
      setFormData((prev) => ({
        ...prev,
        date: dayjs().format("YYYY-MM-DD"),
      }));
    }
  }, [open, formData.date, setFormData]);

  // ✅ File input handler (backend required)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setReceipt(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // base64 preview
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bank_name) newErrors.bank_name = "Bank is required";
    if (!formData.mode) newErrors.mode = "Mode is required";
    if (!formData.bank_ref_id)
      newErrors.bank_ref_id = "Bank Ref ID is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      Number(formData.amount) <= 0
    )
      newErrors.amount = "Enter a valid amount";
    if (formData.remark && formData.remark.length > 200)
      newErrors.remark = "Remarks cannot exceed 200 characters";
    if (!receipt) newErrors.receipt = "Receipt image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!agreed) {
      showToast("You must agree to terms and conditions", "error");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (receipt) {
        data.append("receipt", receipt); // ✅ append file properly
      }

      // ✅ Don't manually set "Content-Type"
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_FUND_REQUEST,
        data
      );

      if (response?.status) {
        showToast(
          response?.message || "Fund request created successfully",
          "success"
        );
        handleSave();
        handleClose();
      } else {
        showToast(error?.message || "Failed to create fund request", "error");
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
      showToast("An error occurred while submitting the request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Convert amount to words (Indian numbering)
  const numberToWords = (num) => {
    if (!num) return "";
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const inWords = (num) => {
      if (num < 20) return a[num];
      if (num < 100)
        return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
      if (num < 1000)
        return (
          a[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 ? " and " + inWords(num % 100) : "")
        );
      if (num < 100000)
        return (
          inWords(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 ? " " + inWords(num % 1000) : "")
        );
      if (num < 10000000)
        return (
          inWords(Math.floor(num / 100000)) +
          " Lakh" +
          (num % 100000 ? " " + inWords(num % 100000) : "")
        );
      return (
        inWords(Math.floor(num / 10000000)) +
        " Crore" +
        (num % 10000000 ? " " + inWords(num % 10000000) : "")
      );
    };

    return inWords(Number(num)) + " Rupees Only";
  };

  const requiredFields = [
    "bank_name",
    "mode",
    "bank_ref_id",
    "date",
    "amount",
    "remark",
  ];

  // ✅ Render visible schema fields
  let visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );

  visibleFields = visibleFields.map((f) => {
    if (f.name === "amount")
      return {
        ...f,
        type: "text",
        props: { inputMode: "numeric", pattern: "[0-9]*" },
      };
    if (f.name === "date")
      return {
        ...f,
        type: "datepicker",
        props: { disableFuture: true, format: "DD/MM/YYYY" },
      };
    return f;
  });

  const isFormValidForSave =
    requiredFields.every(
      (field) => formData[field] && formData[field].toString().trim() !== ""
    ) && receipt;

  return (
    <>
      <CommonModal
        open={open}
        onClose={handleClose}
        title="Create Fund Request"
        iconType="info"
        size="medium"
        layout="two-column"
        dividers
        fieldConfig={visibleFields}
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        loading={loading || submitting}
        customContent={
          <Box mt={2}>
            {/* ✅ File input (as backend required) */}
            <TextField
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleFileChange}
              fullWidth
              required
              error={!!errors.receipt}
              helperText={errors.receipt}
              sx={{ mb: 2 }}
            />

            {/* ✅ Show image preview */}
            {imagePreview && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <img
                  src={imagePreview}
                  alt="Receipt Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    borderRadius: 8,
                    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                  }}
                />
              </Box>
            )}

            {formData.amount &&
              !isNaN(formData.amount) &&
              Number(formData.amount) > 0 && (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary" }}
                >
                  Amount in Words:{" "}
                  <strong>{numberToWords(formData.amount)}</strong>
                </Typography>
              )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
              }
              label={
                <span
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => setTermsOpen(true)}
                >
                  I agree to terms and conditions
                </span>
              }
            />
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
            text: submitting ? "Saving..." : "Save",
            variant: "contained",
            color: "primary",
            onClick: handleSubmit,
            disabled: submitting || !agreed || !isFormValidForSave,
          },
        ]}
      />

      {/* Terms Modal */}
      <Dialog
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 1 }}>
            1. The Fund request/approval of fund request will not be allowed
            after 2 months from the date of deposit.
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            2. Keep all slips, ref IDs, and records handy for 12 months from the
            deposit date for reconciliation purposes.
          </Typography>
          <Typography variant="body1">
            3. The user agrees to all terms, conditions, and annexures mentioned
            in Annexure-III (Downloads section).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setTermsOpen(false)}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateFundRequest;
