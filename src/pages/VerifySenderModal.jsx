import React, { useState, useEffect } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useSchemaForm } from "../hooks/useSchemaForm";

const VerifySenderModal = ({ open, onClose, mobile, otpRef, otpData}) => {
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    setFormData,
    loading,
  } = useSchemaForm(ApiEndpoints.VERIFY_SENDER_SCHEMA, open, {
    mobile_number: mobile,
    otp_ref: otpRef,
    otp: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // sync props into form
  useEffect(() => {
    if (mobile && otpRef) {
      setFormData((prev) => ({
        ...prev,
        mobile_number: mobile,
        otp_ref: otpRef,
      }));
    }
  }, [mobile, otpRef, setFormData]);

const handleVerify = async () => {
  setSubmitting(true);
  setErrors({});
  try {
    const payload = {
      mobile_number: mobile,
      otp: formData.otp,       // user input
      otp_ref: otpData?.otp_ref,
      id: otpData?.sender_id,
    };

    console.log("VERIFY_SENDER payload:", payload);

    const res = await apiCall("post", ApiEndpoints.VERIFY_SENDER, payload);

    if (res) {
      okSuccessToast(res?.message || "Sender verified successfully");
      onClose();
    } else {
      apiErrorToast(res?.message || "Failed to verify sender");
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
      title="Verify Sender"
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
          text: submitting ? "Verifying..." : "Verify",
          variant: "contained",
          color: "primary",
          onClick: handleVerify,
          disabled: submitting,
        },
      ]}
    />
  );
};

export default VerifySenderModal;
