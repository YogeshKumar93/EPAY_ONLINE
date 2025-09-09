// src/components/accounts/CreateAccount.js
import React, { useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";
import { PATTERNS, isValid } from "../utils/validators";

const CreateAccount = ({ open, handleClose, onFetchRef }) => {
  // ✅ Load schema dynamically
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_ACCOUNT_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Validation using validators.js
  const validateForm = () => {
    const newErrors = {};

    if (!isValid(PATTERNS.NAME, formData.name || "")) {
      newErrors.name = "Enter a valid account name";
    }
    if (!formData.user_id) {
      newErrors.user_id = "User ID is required";
    }
    if (!isValid(PATTERNS.MOBILE, formData.mobile || "")) {
      newErrors.mobile = "Enter a valid mobile number";
    }
    if (!formData.type) {
      newErrors.type = "Select account type";
    }
    if (formData.credit_limit && isNaN(formData.credit_limit)) {
      newErrors.credit_limit = "Credit limit must be a number";
    }
    if (formData.balance && isNaN(formData.balance)) {
      newErrors.balance = "Balance must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = () => {
    if (!validateForm()) return;

    setSubmitting(true);

    apiCall("post", ApiEndpoints.CREATE_ACCOUNT, {
      ...formData,
      status: "1", // default Active
    }).then(({ error, response }) => {
      if (response) {
        showToast(response?.message || "Account created successfully", "success");
        onFetchRef?.();
        handleClose();
      } else {
        showToast(error?.message || "Failed to create account", "error");
      }
      setSubmitting(false);
    });
  };

  // ✅ Optional: pick only visible fields from schema
  const visibleFields = schema.filter((field) =>
    [
      "name",
      "user_id",
      "establishment",
      "mobile",
      "type",
      "asm",
      "credit_limit",
      "balance",
    ].includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Create Account"
      iconType="info"
      size="medium"
      dividers
      fieldConfig={visibleFields} // schema-driven fields
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading || submitting}
      layout="two-column"
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
          disabled: submitting,
        },
      ]}
    />
  );
};

export default CreateAccount;
