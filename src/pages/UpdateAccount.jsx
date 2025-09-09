// src/components/accounts/UpdateAccount.js
import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";

import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { isValid, PATTERNS } from "../utils/validators";
import { useToast } from "../utils/ToastContext";
import { ReTextField } from "../components/common/ReTextField"; // ✅ Assuming you have reusable text field

const UpdateAccount = ({ open, onClose, handleClose, onFetchRef,selectedAccount }) => {
  const {
    schema,
    formData,
    setFormData,
    handleChange,
    errors,
    setErrors,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_ACCOUNT_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Pre-fill with selected account data
  useEffect(() => {
    if (open && selectedAccount) {
      setFormData({
        id: selectedAccount.id || "",
        name: selectedAccount.name || "",
        user_id: selectedAccount.user_id || "",
        establishment: selectedAccount.establishment || "",
        mobile: selectedAccount.mobile || "",
        type: selectedAccount.type || "",
        asm: selectedAccount.asm || "",
        credit_limit: selectedAccount.credit_limit || "",
        balance: selectedAccount.balance || "",
        status: selectedAccount.status || "1",
      });
    }
  }, [open, selectedAccount, setFormData]);

  // ✅ Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.user_id) {
      newErrors.user_id = "User ID is required";
    }

    if (!formData.establishment?.trim()) {
      newErrors.establishment = "Establishment is required";
    }

    if (!isValid(PATTERNS.MOBILE, formData.mobile || "")) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (formData.credit_limit !== "" && Number(formData.credit_limit) < 0) {
      newErrors.credit_limit = "Credit limit cannot be negative";
    }

    if (formData.balance !== "" && Number(formData.balance) < 0) {
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
        ApiEndpoints.UPDATE_ACCOUNT,
        formData // must include id
      );

      if (response) {
        showToast(response?.message || "Account updated successfully", "success");
        onFetchRef?.();
        onClose();
      } else {
        showToast(error?.message || "Failed to update account", "error");
      }
    } catch (err) {
      showToast("Something went wrong while updating account", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Show only relevant fields from schema
  const visibleFields = schema.filter((field) =>
    [
      "name",
      "user_id",
      "establishment",
      "mobile",
      "type",
      "asm",
      "credit_limit",
      "balance",
    ].includes(field.name)
  );

 
   

  return (
    <CommonModal
     open={open}
      onClose={handleClose}
      title="Update Account"
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
          onClick: handleClose,
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

export default UpdateAccount;
