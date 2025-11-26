import React, { useState, useEffect } from "react";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../common/CommonModal";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import { PATTERNS, isValid } from "../../utils/validators";
import { useToast } from "../../utils/ToastContext";

const CreateBankModal = ({ open, onClose, onFetchRef }) => {
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.GET_BANK_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // --------------------------
  // NEW: USER DROPDOWN STATE
  // --------------------------
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  // Fetch users when modal opens
  useEffect(() => {
    if (open) {
      setErrors({});
      fetchUsers();
    }
  }, [open, setErrors]);

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const { response } = await apiCall("POST", ApiEndpoints.GET_USERS);
      if (response?.data.data) {
        setUsers(
          response.data.data.map((u) => ({
            label: u.name || u.username, 
            value: u.id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching users", error);
      showToast("Failed to load user list", "error");
    } finally {
      setUserLoading(false);
    }
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (!isValid(PATTERNS.BANK_NAME, formData.bank_name || "")) {
      newErrors.bank_name = "Bank name must be at least 9 characters";
    }

    if (!isValid(PATTERNS.IFSC, formData.ifsc || "")) {
      newErrors.ifsc = "Enter a valid IFSC code";
    }

    if (!isValid(PATTERNS.ACCOUNT_NUMBER, formData.acc_number || "")) {
      newErrors.acc_number =
        "Account number must be 6–18 alphanumeric characters";
    }

    if (!formData.balance || isNaN(formData.balance)) {
      newErrors.balance = "Enter a valid balance amount";
    } else if (Number(formData.balance) < 0) {
      newErrors.balance = "Balance cannot be negative";
    }

    // --------------------------
    // NEW: handle_by validation
    // --------------------------
    if (!formData.handled_by) {
      newErrors.id = "Please select a handler";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_BANK_ADMIN,
        formData
      );

      if (response) {
        showToast(response?.message || "Bank created successfully", "success");
        onFetchRef?.();
        onClose();
      } else {
        showToast(error?.message || "Failed to create bank", "error");
      }
    } catch (err) {
      console.error("Error creating bank:", err);
      showToast("Something went wrong while creating bank", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // PICK FIELDS FROM SCHEMA + ADD DROPDOWN
  const visibleFields = [
    ...schema.filter((field) =>
      ["bank_name", "ifsc", "acc_number", "balance"].includes(field.name)
    ),
    {
      name: "handled_by",
      label: "Handled By",
      type: "select",
      options: users, // dropdown options
      required: true,
      disabled: userLoading,
    },
  ];

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create New Bank"
      iconType="info"
      size="small"
      dividers
      fieldConfig={visibleFields}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading || userLoading}
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: onClose,
          disabled: submitting,
        },
        {
          text: submitting ? "Saving..." : "Save",
          variant: "contained",
          color: "primary",
          onClick: handleSubmit,
          disabled:
            submitting || loading || userLoading || !schema.length,
        },
      ]}
    />
  );
};

export default CreateBankModal;
