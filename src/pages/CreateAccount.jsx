// src/components/accounts/CreateAccount.js
import React, { useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useToast } from "../utils/ToastContext";

const CreateAccount = ({ open, handleClose, onFetchRef, setGlobalLoader }) => {
  
  const initialFormData = {
    name: "",
    mobile: "",
    establishment: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // Reset form function
  const resetForm = () => {
    setFormData(initialFormData);
  };

  // Handle modal close with reset
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  // Handle change to update form data
  const handleChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === "mobile") {
      finalValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  // Submit function with validation and form reset
 const handleSubmit = () => {
  if (!formData.name.trim()) return showToast("Name is required", "error");
  if (!formData.mobile.trim()) return showToast("Mobile is required", "error");
  if (formData.mobile.length !== 10)
    return showToast("Mobile must be 10 digits", "error");
  if (!formData.establishment.trim())
    return showToast("Establishment is required", "error");

  setSubmitting(true);

  apiCall("post", ApiEndpoints.CREATE_ACCOUNT, { ...formData })
    .then(async ({ error, response }) => {
      if (response) {
        showToast(response?.message || "Account created successfully", "success");

        setGlobalLoader(true);

        await new Promise((res) => setTimeout(res, 500));

        onFetchRef?.();

        resetForm();
        handleClose();
      } else {
        showToast(error?.message || "Failed to create account", "error");
      }
    })
    .finally(() => {
      setSubmitting(false);
      setGlobalLoader(false);
    });
};

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  // 3 fields only
  const visibleFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter Name",
    },
    {
      name: "mobile",
      label: "Mobile Number",
      type: "text",
      placeholder: "Enter Mobile Number",
    },
    {
      name: "establishment",
      label: "Establishment",
      type: "text",
      placeholder: "Enter Establishment",
    },
  ];

  return (
    <CommonModal
      open={open}
      onClose={handleModalClose}
      title="Create Account"
      iconType="info"
      size="medium"
      dividers
      fieldConfig={visibleFields}
      formData={formData}
      handleChange={handleChange}
      errors={{}}
      loading={submitting}
      layout="two-column"
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: handleModalClose,
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

export default CreateAccount;
