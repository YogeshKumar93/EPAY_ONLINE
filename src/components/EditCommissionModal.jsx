import React, { useEffect, useState } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { CircularProgress } from "@mui/material";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useSchemaForm } from "../hooks/useSchemaForm";

const EditCommissionModal = ({ open, onClose, commissionRule, onSuccess }) => {
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
console.log("commissionRule",commissionRule);

  // ✅ Directly populate form data from commissionRule when modal opens
  useEffect(() => {
    if (open && commissionRule) {
      console.log("📋 Populating form from commission rule data:", commissionRule);
      
      // Create form data directly from commissionRule
      const formDataFromRule = {
        id: commissionRule.id || "", // Make sure to include the ID
        service_name: commissionRule.service_name || "",
        rule_type: commissionRule.rule_type || "",
        comm_dd: commissionRule.comm_dd || "",
        comm_ret: commissionRule.comm_ret || "",
        comm_di: commissionRule.comm_di || "",
        comm_md: commissionRule.comm_md || "",
        min_amount: commissionRule.min_amount || "",
        max_amount: commissionRule.max_amount || "",
        plan_id: commissionRule.plan_id || "",
        value_type: commissionRule.value_type || "",
        // Add any other fields you need from commissionRule
      };

      setFormData(formDataFromRule);
      setErrors({});
    }
  }, [open, commissionRule, setFormData]);

  // ✅ Debug: Log current form data
  useEffect(() => {
    if (open) {
      console.log("Current formData:", formData);
    }
  }, [formData, open]);

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.service_name) newErrors.service_name = "Service name is required";
    if (!formData.rule_type) newErrors.rule_type = "Rule type is required";
    if (!formData.comm_dd) newErrors.comm_dd = "DD commission is required";
    if (!formData.comm_ret) newErrors.comm_ret = "Retail commission is required";
    if (!formData.comm_di) newErrors.comm_di = "DI commission is required";
    if (!formData.comm_md) newErrors.comm_md = "MD commission is required";
    if (!formData.min_amount) newErrors.min_amount = "Minimum amount is required";
    if (!formData.max_amount) newErrors.max_amount = "Maximum amount is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit update
  const onSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      // Make sure to include the ID in the request
      const payload = {
        ...formData,
        id: commissionRule.id // Ensure the ID is included
      };

      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_COMMISSION_RULE,
        payload
      );

      if (response) {
        okSuccessToast(response?.message || "Commission rule updated successfully!");
        onSuccess(); // Call the success callback
        onClose(); // Close the modal
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

  // ✅ Handle modal close
  const handleClose = () => {
    if (!submitting) {
      onClose();
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