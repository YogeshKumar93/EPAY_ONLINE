import React, { useEffect, useState } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { CircularProgress } from "@mui/material";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useSchemaForm } from "../hooks/useSchemaForm";

const EditCommissionModal = ({ open, handleClose, row }) => {
  const {
    schema,
    formData,
    setFormData,
    handleChange,
    errors,
    setErrors,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_COMMISSION_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);

  // ✅ Prefill row data when schema + modal opens
useEffect(() => {
  if (open && row && schema.length > 0) {
    setFormData((prev) => {
      const merged = {};
      schema.forEach((field) => {
        merged[field.name] =
          row[field.name] !== undefined && row[field.name] !== null
            ? row[field.name]
            : prev[field.name] ?? "";
      });
      return merged;
    });
  }
}, [open, row, schema, setFormData]);

  // ✅ Validation (keep same as create for consistency)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.service_name)
      newErrors.service_name = "service_name is required";
    if (!formData.rule_type) newErrors.rule_type = "rule_type is required";
    if (!formData.comm_dd) newErrors.comm_dd = "comm_dd is required";
    if (!formData.comm_ret) newErrors.comm_ret = "comm_ret is required";
    if (!formData.comm_di) newErrors.comm_di = "comm_di is required";
    if (!formData.comm_md) newErrors.comm_md = "comm_md is required";
    if (!formData.min_amount) newErrors.min_amount = "min_amount is required";
    if (!formData.max_amount) newErrors.max_amount = "max_amount is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit update
  const onSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const { response, error } = await apiCall(
        "POST", // or PUT/PATCH if backend expects
        ApiEndpoints.UPDATE_COMMISSION_RULE,
        formData
      );

      if (response) {
        okSuccessToast(response?.message || "Commission rule updated successfully!");
        handleClose();
      } else {
        apiErrorToast(error?.message || "Failed to update commission rule");
      }
    } catch (err) {
      console.error(err);
      apiErrorToast("Something went wrong while updating commission rule");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Required fields for edit
  const requiredFields = [
    "plan_id",
    "service_name",
    "rule_type",
    "value_type",
    "comm_dd",
    "comm_ret",
    "comm_di",
    "comm_md",
    "min_amount",
    "max_amount",
  ];

  // ✅ Filter schema for only required fields
  const visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );

  // ✅ Footer buttons
  const footerButtons = [
    {
      text: "Cancel",
      variant: "outlined",
      onClick: handleClose,
      disabled: submitting,
    },
    {
      text: submitting ? "Updating..." : "Update",
      variant: "contained",
      onClick: onSubmit,
      disabled: submitting,
      startIcon: submitting ? (
        <CircularProgress size={20} color="inherit" />
      ) : null,
    },
  ];

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Update Commission Rule"
      footerButtons={footerButtons}
      size="medium"
      iconType="info"
      layout="two-column"
      showCloseButton
      closeOnBackdropClick={!submitting}
      dividers
      fieldConfig={visibleFields}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading || submitting}
    />
  );
};

export default EditCommissionModal;
