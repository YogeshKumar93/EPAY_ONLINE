import React, { useContext, useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";

const OutletDmt1 = ({ open, handleClose, onSuccess }) => {
  const { schema, formData, handleChange, errors, loading } = useSchemaForm(
    ApiEndpoints.DMT1_OUTLET_INITIATE_SCHEMA,
    open
  );

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { location } = useContext(AuthContext);

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
      if (onSuccess) onSuccess(); // to refresh instId or reload page
      handleClose();
    } else {
      showToast(error?.message || "Failed to initiate DMT1 outlet", "error");
      handleClose();
    }
    setSubmitting(false);
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
