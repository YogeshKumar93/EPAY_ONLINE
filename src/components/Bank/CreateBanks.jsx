import React, { useState, useEffect } from "react";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../common/CommonModal";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import { PATTERNS, isValid } from "../../utils/validators";
import { useToast } from "../../utils/ToastContext";

const CreateBankModal = ({ open, onClose, onFetchRef }) => {
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_BANK_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Reset errors when modal opens fresh
  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open, setErrors]);

  // ✅ Validation using validators.js
  const validateForm = () => {
    const newErrors = {};

    if (!isValid(PATTERNS.BANK_NAME, formData.bank_name || "")) {
      newErrors.bank_name = "Bank name must be at least 9 characters";
    }

    if (!isValid(PATTERNS.IFSC, formData.ifsc || "")) {
      newErrors.ifsc = "Enter a valid IFSC code";
    }

    if (!isValid(PATTERNS.ACCOUNT_NUMBER, formData.acc_number || "")) {
      newErrors.acc_number =
        "Account number must be 6–18 alphanumeric characters";
    }

    if (!formData.balance || isNaN(formData.balance)) {
      newErrors.balance = "Enter a valid balance amount";
    } else if (Number(formData.balance) < 0) {
      newErrors.balance = "Balance cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_BANK,
        formData
      );

      if (response) {
        showToast(response?.message || "Bank created successfully", "success");
        onFetchRef?.(); // refresh list if callback exists
        onClose();
      } else {
        showToast(error?.message || "Failed to create bank", "error");
        // ❌ don’t auto-close on error
      }
    } catch (err) {
      console.error("Error creating bank:", err);
      showToast("Something went wrong while creating bank", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Pick only required fields from schema
  const visibleFields = schema.filter((field) =>
    ["bank_name", "ifsc", "acc_number", "balance"].includes(field.name)
  );

 return (
  <CommonModal
    open={open}
    onClose={onClose}
    title="Create New Bank"
    iconType="info"
    size="small"
    dividers
      fieldConfig={visibleFields}
    formData={formData}
    handleChange={handleChange}
    errors={errors}
      loading={loading}
    footerButtons={[
      {
        text: "Cancel",
        variant: "outlined",
        onClick: onClose,
        disabled: submitting,
      },
      {
        text: submitting ? "Saving..." : "Save",
        variant: "contained",
        color: "primary",
        onClick: handleSubmit,
        disabled: submitting || loading || !schema.length, // disable until schema ready
      },
    ]}
  />
);

};

export default CreateBankModal;
