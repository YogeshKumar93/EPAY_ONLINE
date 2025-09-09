import React, { useEffect, useState } from "react";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../common/CommonModal";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import { PATTERNS, isValid } from "../../utils/validators";
import { useToast } from "../../utils/ToastContext";

const UpdateBanks = ({ open, onClose, bankData, onFetchRef }) => {
  const {
    schema,
    formData,
    setFormData,
    handleChange,
    errors,
    setErrors,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_BANK_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Pre-fill form with selected bank data
  useEffect(() => {
    if (open && bankData) {
      setFormData({
        bank_name: bankData.bank_name || "",
        ifsc: bankData.ifsc || "",
        acc_number: bankData.acc_number || "",
        balance: bankData.balance || "",
        id: bankData.id, // 👈 required for update
      });
    }
  }, [open, bankData, setFormData]);

  // ✅ Validate before submit
  const validateForm = () => {
    const newErrors = {};

    if (!isValid(PATTERNS.BANK_NAME, formData.bank_name || "")) {
      newErrors.bank_name = "Enter a valid bank name (min 3 characters)";
    }

    if (!isValid(PATTERNS.IFSC, formData.ifsc || "")) {
      newErrors.ifsc = "Enter a valid IFSC code";
    }

    if (!isValid(PATTERNS.ACCOUNT_NUMBER, formData.acc_number || "")) {
      newErrors.acc_number = "Account number must be 6–18 digits";
    }

    if (!formData.balance || isNaN(formData.balance)) {
      newErrors.balance = "Enter a valid balance amount";
    } else if (Number(formData.balance) < 0) {
      newErrors.balance = "Balance cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit update
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_BANK,
        formData // 👈 send full formData including id
      );

      if (response) {
        showToast(response?.message || "Bank updated successfully", "success");
       onFetchRef(); // 👈 let parent refresh table
        onClose();
      } else {
        showToast(error?.message || "Failed to update bank", "error");
      }
    } catch (err) {
      showToast("Something went wrong while updating", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Only show required fields
  const visibleFields = schema.filter((field) =>
    ["bank_name", "ifsc", "acc_number", "balance"].includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Update Bank"
      iconType="edit"
      size="small"
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
          onClick: onClose,
          disabled: submitting,
        },
        {
          text: submitting ? "Updating..." : "Update",
          variant: "contained",
          color: "primary",
          onClick: handleSubmit,
          disabled: submitting,
        },
      ]}
    />
  );
};

export default UpdateBanks;
