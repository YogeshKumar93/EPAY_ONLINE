import React, { useContext, useState } from "react";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";
import { apiCall } from "../api/apiClient";

const OutletDmt1 = ({ open, handleClose, onSuccess }) => {
  const { schema, formData, handleChange, errors, loading } = useSchemaForm(
    ApiEndpoints.DMT1_OUTLET_INITIATE_SCHEMA,
    open
  );

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { location } = useContext(AuthContext);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [initPayload, setInitPayload] = useState(null);

  // ✅ Submit Handler

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      ...formData,
      latitude: location?.lat || "",
      longitude: location?.long || "",
    };
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.DMT1_OUTLET_INITIATE,
      payload
    );

    if (response) {
      showToast(
        response?.message || "DMT1 Outlet initiated successfully",
        "success"
      );

      // 🔑 Save the init payload + required otpReferenceId + hash
      setInitPayload({
        ...payload,
        otpReferenceID: response?.data?.otpReferenceID,
        hash: response?.data?.hash,
        hash2: response?.data?.hash,
      });

      setOtpModalOpen(true); // Open OTP modal
    } else {
      if (error) {
        showToast(error, "error");
      } else {
        showToast(error?.message || "Failed to initiate DMT1 outlet", "error");
        handleClose();
      }
    }
    setSubmitting(false);
  };

  const handleOtpSubmit = async () => {
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.VALIDATE_DMT1_OUTLET,
      {
        ...initPayload, // includes formData + otpReferenceId + hash
        otp,
      }
    );

    if (response) {
      showToast("OTP Verified Successfully", "success");
      if (onSuccess) onSuccess();
      setOtpModalOpen(false);
      handleClose();
    } else {
      showToast(error?.message || "OTP Validation Failed", "error");
    }
  };

  // ✅ Required fields (if you only want some fields from schema)
  const requiredFields = [
    "mobile",
    "pan",
    "email",
    "bankAccountNo",
    "bankIfsc",
    "aadhaar",
  ];

  // ✅ Pick only required fields from schema
  const visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Enable DMT1 Outlet"
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
          text: submitting ? "Submitting..." : "Submit",
          variant: "contained",
          color: "primary",
          onClick: handleSubmit,
          disabled: submitting,
        },
      ]}
    />
  );
};

export default OutletDmt1;
