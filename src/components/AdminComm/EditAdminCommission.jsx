import React, { useState, useEffect, useContext } from "react";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";
import AuthContext from "../../contexts/AuthContext";

const EditAdminCommission = ({
  open,
  handleClose,
  handleSave,
  onFetchRef,
  commissionRule,
}) => {
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    loading,
    setFormData,
  } = useSchemaForm(ApiEndpoints.GET_ADMIN_COMMISSIONS_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  // ✅ Required fields
  const requiredFields = [
    "service_name",
    "rule_type",
    "value_type",
    "a_comm",
    "min_amount",
    "max_amount",
  ];

  // ✅ Clear errors whenever modal opens fresh
  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open, setErrors]);

  // ✅ Autofill fields from selected row
  useEffect(() => {
    if (open && commissionRule) {
      setFormData({
        id: commissionRule?.id || "",
        service_name: commissionRule?.service_name || "",
        rule_type: commissionRule?.rule_type || "",
        value_type: commissionRule?.value_type || "",
        a_comm: commissionRule?.a_comm || "",
        min_amount: commissionRule?.min_amount || "",
        max_amount: commissionRule?.max_amount || "",
      });
      setErrors({});
    }
  }, [open, commissionRule, setFormData, setErrors]);

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = `${field} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit updated data
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    const payload = {
      ...formData,
      id: commissionRule?.id, // ✅ Send selected row ID
    };

    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_ADMIN_COMMISSIONS,
        payload
      );

      if (response) {
        handleSave?.(response.data);
        showToast(
          response?.message || "Commission rule updated successfully",
          "success"
        );
        onFetchRef?.();
        handleClose();
      } else {
        showToast(
          error?.message || "Failed to update commission rule",
          "error"
        );
      }
    } catch (err) {
      console.error("Error updating commission rule:", err);
      showToast("Something went wrong while updating commission rule", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Show only required schema fields
  const visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Edit Commission Rule"
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

export default EditAdminCommission;
