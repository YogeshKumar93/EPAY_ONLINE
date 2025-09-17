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


  // ✅ Submit handler
  const handleSubmit = () => {
    setSubmitting(true);

    apiCall("post", ApiEndpoints.CREATE_ACCOUNT, {
      ...formData,
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
      "user_id",      
      "credit_limit",
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
