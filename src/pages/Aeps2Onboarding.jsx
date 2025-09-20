import React, { useState, useEffect } from "react";
import { apiCall } from "../api/apiClient";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";
import dayjs from "dayjs";
import ApiEndpoints from "../api/ApiEndpoints";

const Aeps2Onboarding = ({ open, handleClose }) => {
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    loading,
    setFormData,
  } = useSchemaForm(ApiEndpoints.AEPS2_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // Set default date if schema has a datepicker
  useEffect(() => {
    if (open && schema.length && !formData.date) {
      const dateField = schema.find((f) => f.type === "datepicker");
      if (dateField) {
        setFormData((prev) => ({
          ...prev,
          [dateField.name]: dayjs().format("YYYY-MM-DD"),
        }));
      }
    }
  }, [open, schema, formData.date, setFormData]);

  // ✅ Validate required fields
  const validateForm = () => {
    const newErrors = {};
    schema.forEach((f) => {
      if (f.required && !formData[f.name]) {
        newErrors[f.name] = `${f.label || f.name} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit AEPS2 form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.AEPS2_ONBOARDING,
        formData
      );

      if (response) {
        showToast(
          response?.message || "AEPS2 onboarding successful",
          "success"
        );
        handleClose();
      } else {
        showToast(error?.message || "AEPS2 onboarding failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong during AEPS2 onboarding", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="AEPS2 Onboarding"
      iconType="info"
      size="medium"
      fieldConfig={schema}
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
          text: submitting ? "Processing..." : "Submit",
          variant: "contained",
          color: "primary",
          onClick: handleSubmit,
          disabled: submitting,
        },
      ]}
    />
  );
};

export default Aeps2Onboarding;
