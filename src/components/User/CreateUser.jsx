import React, { useState, useEffect } from "react";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../common/CommonModal";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import { PATTERNS, isValid } from "../../utils/validators";
import { useToast } from "../../utils/ToastContext";

const CreateUser = ({ open, onClose, onFetchRef }) => {
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.GET_SIGNUP_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Reset errors when modal opens fresh
  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open, setErrors]);

  // ✅ Submit handler
  const handleSubmit = async () => {
    // if (!validateForm()) return;

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_USER,
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


  const visibleFields = schema.filter((field) =>
    ["name", "email", "phone", "role", "mobile","business_name","entity_type","gst_number","pan_number","address"].includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create New User"
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

export default CreateUser;
