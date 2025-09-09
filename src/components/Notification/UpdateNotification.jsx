import React, { useEffect, useState } from "react";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../common/CommonModal";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import { useToast } from "../../utils/ToastContext";

const UpdateNotification = ({ open, onClose, row, onFetchRef }) => {
  const {
    schema,
    formData,
    setFormData,
    handleChange,
    errors,
    setErrors,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_NOTIFICATION_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Pre-fill form when modal opens
  useEffect(() => {
    if (open && row) {
      setFormData({
        id: row.id || "",
        title: row.title || "",
        type: row.type || "",
        message: row.message || "",
        user_id: row.user_id?.toString() || "",
      });
    }
  }, [open, row, setFormData]);

  // ✅ Validate before submit
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    }
    if (!formData.type) {
      newErrors.type = "Type is required";
    }
    if (!formData.message) {
      newErrors.message = "Message is required";
    }
    if (!formData.user_id) {
      newErrors.user_id = "Please select a user";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit update
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = {
        id: formData.id,
        title: formData.title,
        type: formData.type,
        message: formData.message,
        user_id: formData.user_id === "all" ? "all" : formData.user_id,
      };

      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_NOTIFICATION,
        payload
      );

      if (response) {
        showToast(response?.message || "Notification updated successfully", "success");
        onFetchRef();
        onClose();
      } else {
        showToast(error?.message || "Failed to update notification", "error");
      }
    } catch (err) {
      showToast("Something went wrong while updating notification", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Only required fields shown
  const visibleFields = schema.filter((field) =>
    ["title", "type", "message", "user_id"].includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Update Notification"
      iconType="edit"
      size="medium"
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

export default UpdateNotification;
