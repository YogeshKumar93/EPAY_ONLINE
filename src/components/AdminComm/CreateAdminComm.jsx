import React, { useState, useEffect } from "react";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";

const CreateAdminComm = ({ open, handleClose, handleSave, onFetchRef }) => {
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.GET_ADMIN_COMMISSIONS_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Required fields
  const requiredFields = [
    "service_name",
    "rule_type",
    "value_type",

    "a_comm",

    "min_amount",
    "max_amount",
  ];

  // ✅ Clear errors whenever modal opens fresh
  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open, setErrors]);

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = `${field} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_ADMIN_COMMISSIONS,
        formData
      );

      if (response) {
        handleSave?.(response.data);
        showToast(
          response?.message || "Commission rule created successfully",
          "success"
        );
        onFetchRef?.();
        handleClose();
      } else {
        showToast(
          error?.message || "Failed to create commission rule",
          "error"
        );
        // ❌ don't close modal on error
      }
    } catch (err) {
      console.error("Error creating commission rule:", err);
      showToast("Something went wrong while creating commission rule", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Pick only required fields from schema
  const visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Create Commission Rule"
      iconType="info"
      size="medium"
      layout="two-column"
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

export default CreateAdminComm;
