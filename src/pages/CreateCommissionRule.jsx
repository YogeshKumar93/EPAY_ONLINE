import React, { useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { PATTERNS, isValid } from "../utils/validators";
import { useToast } from "../utils/ToastContext";

const CreateCommissionRule = ({ open, handleClose, handleSave }) => {
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.GET_COMMISSION_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.service_name) newErrors.service_name = "service_name is required";
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

  // ✅ Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_COMMISSION_RULE,
        formData
      );

      if (response) {
        handleSave(response.data);
        showToast(
          response?.message || "Fund request created successfully",
          "success"
        );
        handleClose();
      } else {
        showToast(error?.message || "Failed to create fund request", "error");
      }
    } catch (err) {
      console.error("Error creating fund request:", err);
      showToast("Something went wrong while creating fund request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Required fields
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

  // ✅ Pick only required fields from schema
  let visibleFields = schema.filter((field) =>
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

export default CreateCommissionRule;
