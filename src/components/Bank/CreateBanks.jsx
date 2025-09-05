import React, { useState } from "react";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../common/CommonModal";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import { PATTERNS, isValid } from "../../utils/validators"; // 👈 import validators
import { useToast } from "../../utils/ToastContext";

const CreateBankModal = ({ open, onClose }) => {
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_BANK_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
const {showToast} = useToast();
  // ✅ Validation using validators.js
  const validateForm = () => {
    const newErrors = {};

    if (!isValid(PATTERNS.BANK_NAME, formData.bank_name || "")) {
      newErrors.bank_name = "Enter a valid bank name (min 9 characters)";
    }

    if (!isValid(PATTERNS.IFSC, formData.ifsc || "")) {
      newErrors.ifsc = "Enter a valid IFSC code";
    }

    if (!isValid(PATTERNS.ACCOUNT_NUMBER, formData.acc_number || "")) {
      newErrors.acc_number = "Account number must be 6–18 alphanumeric characters";
    }

    if (!formData.balance || isNaN(formData.balance)) {
      newErrors.balance = "Enter a valid balance amount";
    } else if (Number(formData.balance) < 0) {
      newErrors.balance = "Balance cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = () => {
  if (!validateForm()) return;

  setSubmitting(true);

  apiCall("post", ApiEndpoints.CREATE_BANK, formData).then(({ error, response }) => {
    onClose();

    if (response) {
      showToast(response?.message || "Bank created successfully", "success");
    } else {
      showToast(error?.message || "Failed to create bank", "error");
    }

    setSubmitting(false);
  });
};
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
      loading={loading || submitting}
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
          disabled: submitting,
        },
      ]}
    />
  );
};

export default CreateBankModal;
