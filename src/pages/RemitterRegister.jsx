import React, { useState, useEffect } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useSchemaForm } from "../hooks/useSchemaForm";

const RemitterRegister = ({ open, onClose, mobile, onSuccess }) => {
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    setFormData,
    loading,
  } = useSchemaForm(ApiEndpoints.REGISTER_SENDER_SCHEMA, open, {
    mobile_number: mobile || "",
  });

  const [submitting, setSubmitting] = useState(false);

  // keep mobile synced
  useEffect(() => {
    if (mobile) {
      setFormData((prev) => ({ ...prev, mobile_number: mobile }));
    }
  }, [mobile, setFormData]);

  // ✅ disable mobile number by overriding fieldConfig
  const disabledSchema = schema.map((field) =>
    field.name === "mobile_number" ? { ...field, disabled: true } : field
  );

  const handleRegister = async () => {
    setSubmitting(true);
    setErrors({});
    try {
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.DMT1_REGISTER,
        formData
      );

      if (response) {
        okSuccessToast("Remitter registered successfully");
        onSuccess?.(response.data);
        onClose();
      } else {
        apiErrorToast(error?.message || "Failed to register remitter");
      }
    } catch (err) {
      apiErrorToast(err?.message || "Unexpected error");
      setErrors(err?.response?.data?.errors || {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Register Remitter"
      iconType="info"
      size="small"
      dividers
      fieldConfig={disabledSchema} // ✅ use disabledSchema instead of schema
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
          text: submitting ? "Registering..." : "Register",
          variant: "contained",
          color: "primary",
          onClick: handleRegister,
          disabled: submitting,
        },
      ]}
    />
  );
};

export default RemitterRegister;
