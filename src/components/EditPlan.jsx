import React, { useEffect, useState } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { CircularProgress } from "@mui/material";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useSchemaForm } from "../hooks/useSchemaForm";

const EditPlan = ({ open, onClose, plans, onSuccess,onFetchRef }) => {
  const {
    schema,
    formData,
    setFormData,
    handleChange,
    errors,
    setErrors,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_PLAN_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
console.log("plans",plans);

  // ✅ Directly populate form data from commissionRule when modal opens
  useEffect(() => {
    if (open && plans) {
      console.log("📋 Populating form from commission rule data:", plans);
      
      // Create form data directly from commissionRule
      const formDataFromRule = {
        id: plans.id || "", // Make sure to include the ID
        name: plans.name || "",
        description: plans.description || "",
       
      };

      setFormData(formDataFromRule);
      setErrors({});
    }
  }, [open, plans, setFormData]);

  // ✅ Debug: Log current form data
  useEffect(() => {
    if (open) {
      console.log("Current formData:", formData);
    }
  }, [formData, open]);


  // ✅ Submit update
  const onSubmit = async () => {
    setSubmitting(true);

    try {
      // Make sure to include the ID in the request
      const payload = {
        ...formData,
        id: plans.id // Ensure the ID is included
      };

      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_PLAN,
        payload
      );

      if (response) {
        okSuccessToast(response?.message || "Plan updated successfully!");
        onSuccess();
        onFetchRef(); 
        onClose(); // Close the modal
      } else {
        apiErrorToast(error?.message || "Failed to update Plan");
      }
    } catch (err) {
      console.error(err);
      apiErrorToast("Something went wrong while updating Plan");
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
    "name",
    "description",

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

export default EditPlan;