import React, { useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";

const CreateAccountStatement = ({ open, handleClose,onFetchRef }) => {
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.GET_ACCOUNT_STATEMENT_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Submit
  const handleSubmit = async () => {

    setSubmitting(true);
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_ACCOUNT_STATEMENT,
        formData
      );

      if (response) {
        showToast(
          response?.message || "Account Statement Created successfully",
          "success"
        );
        onFetchRef();
        handleClose();
      } else {
        showToast(error?.message || "Failed to create Account Statement", "error");
        handleClose();
      }

  };

  // ✅ Required fields
  const requiredFields = [
    
    "account_id",
    "remarks",
    "bank_id",
    "credit",
    "debit",
    "balance",
    "particulars"

  
  ];

  // ✅ Pick only required fields from schema
  let visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Create Accoun Statement"
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

export default CreateAccountStatement;
