import React, { useState, useEffect } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useSchemaForm } from "../hooks/useSchemaForm";

const SenderRegisterModal = ({ open, onClose, mobile, onRegistered }) => {
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

  // keep mobile in sync
  useEffect(() => {
    if (mobile) {
      setFormData((prev) => ({ ...prev, mobile_number: mobile }));
    }
  }, [mobile, setFormData]);

const handleRegister = async () => {
  setSubmitting(true);
  setErrors({});
  try {
    const res = await apiCall("post", ApiEndpoints.REGISTER_SENDER, formData);

    if (res) {

      // ✅ log response
      console.log("REGISTER_SENDER response:", res);

      const otp_ref = res?.response?.data?.otp_ref;
      const sender_id = res?.response?.data?.sender?.id;

      console.log("Extracted otp_ref:", otp_ref);
      console.log("Extracted sender_id:", sender_id);

      // ✅ pass both values back
      onRegistered?.({
        mobile_number: formData.mobile_number,
        otp_ref,
        sender_id,
      });

      onClose();
    } else {
      apiErrorToast(res?.message || "Failed to register sender");
    }
  } catch (err) {
    apiErrorToast(err);
    setErrors(err?.response?.data?.errors || {});
  } finally {
    setSubmitting(false);
  }
};


  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Register Sender"
      iconType="info"
      size="small"
      dividers
      fieldConfig={schema}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading || submitting}
      footerButtons={[
        { text: "Cancel", variant: "outlined", onClick: onClose, disabled: submitting },
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

export default SenderRegisterModal;
