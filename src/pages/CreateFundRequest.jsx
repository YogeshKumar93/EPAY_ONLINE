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

  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false); // ✅ terms modal
  const { showToast } = useToast();

  const handleModalClose = () => {
    setFormData({});
    setAgreed(false);
    handleClose();
  };

  useEffect(() => {
    if (open && !formData.date) {
      setFormData((prev) => ({
        ...prev,
        date: dayjs().format("YYYY-MM-DD"),
      }));
    }
  }, [open, formData.date, setFormData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bank_name) newErrors.bank_name = "Bank is required";
    if (!formData.mode) newErrors.mode = "Mode is required";
    if (!formData.bank_ref_id)
      newErrors.bank_ref_id = "bank_ref_id is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      Number(formData.amount) <= 0
    )
      newErrors.amount = "Enter a valid amount";
    if (formData.remark && formData.remark.length > 200)
      newErrors.remark = "Remarks cannot exceed 200 characters";

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
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_FUND_REQUEST,
        formData
      );
      if (response) {
        showToast(
          response?.message || "Fund request created successfully",
          "success"
        );
        handleSave();
        handleModalClose();
      } else {
        showToast(error?.message || "Failed to create fund request", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const requiredFields = [
    "txn_id",
    "bank_name",
    "mode",
    "bank_ref_id",
    "date",
    "amount",
    "remark",
    "receipt",
  ];
  let visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );
  const dateField = {
    name: "date",
    label: "Date",
    type: "datepicker",
    props: { disableFuture: true, format: "DD/MM/YYYY" },
  };
  visibleFields = visibleFields.map((f) => (f.name === "date" ? dateField : f));

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
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
              }
              // ✅ Make label clickable
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
            disabled: submitting || !agreed,
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
            1. The Fund request/ approval of fund request will not be allowed
            after 2 Months from the date of deposit.
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            2. The proper records of Fund Request(s), slips, Ref no etc shall
            keep handy by the user of portal/ platform for the purpose of
            Reconciliation purpose of the company (PSPKA Services Pvt Ltd) for
            12 months from the date of Deposit.
          </Typography>
          <Typography variant="body1">
            3. The user of portal/ platform shall agree all the terms,
            conditions, points of the Annexure-III as attached in Downloads
            section.
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
