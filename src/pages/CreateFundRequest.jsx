import React, { useState, useEffect } from "react";
import dayjs from "dayjs"; // ✅ for date formatting
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";

const CreateFundRequest = ({ open, handleClose, handleSave, onFetchRef }) => {
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    loading,
    setFormData,
  } = useSchemaForm(ApiEndpoints.GET_FUNDREQUEST_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Set default date when modal opens
  useEffect(() => {
    if (open && !formData.date) {
      setFormData((prev) => ({
        ...prev,
        date: dayjs().format("YYYY-MM-DD"), // API-friendly format
      }));
    }
  }, [open, formData.date, setFormData]);

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.bank_name) newErrors.bank_name = "Bank is required";
    if (!formData.mode) newErrors.mode = "Mode is required";
    if (!formData.bank_ref_id)
      newErrors.bank_ref_id = "bank_ref_id is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = "Enter a valid amount";
    }
    if (formData.remark && formData.remark.length > 200) {
      newErrors.remark = "Remarks cannot exceed 200 characters";
    }
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
        ApiEndpoints.CREATE_FUND_REQUEST,
        formData
      );

      if (response) {
        handleSave(response.data);
        showToast(
          response?.message || "Fund request created successfully",
          "success"
        );
        onFetchRef();
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
    "txn_id",
    "bank_name",
    "mode",
    "bank_ref_id",
    "date",
    "amount",
    "remark",
    "request_image",
  ];

  // ✅ Pick only required fields from schema
  let visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );

  // ✅ Override date field to use DatePicker
  const dateField = {
    name: "date",
    label: "Date",
    type: "datepicker",
    props: {
      disableFuture: true,
      format: "DD/MM/YYYY",
    },
  };
  visibleFields = visibleFields.map((f) => (f.name === "date" ? dateField : f));

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Create Fund Request"
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

export default CreateFundRequest;
