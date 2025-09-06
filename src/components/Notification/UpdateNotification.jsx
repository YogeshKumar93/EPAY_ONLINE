import React, { useState, useEffect } from "react";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../common/CommonModal";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import { useToast } from "../../utils/ToastContext";

const UpdateNotification = ({ open, onClose, notification }) => {
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    setFormData,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_NOTIFICATION_SCHEMA, open);

  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch users when modal opens
  useEffect(() => {
    if (!open) return;
    const fetchUsers = async () => {
      const { response, error } = await apiCall("get", ApiEndpoints.GET_USERS);
      if (response?.data) {
        const userList = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setUsers(userList);
      } else {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [open]);

  // Pre-fill form when notification, schema, and users are ready
  useEffect(() => {
    if (notification && open && schema.length && users.length) {
      setFormData({
        id: notification.id?.toString() || "",
        title: ["System Update", "Maintenance", "Reminder"].includes(notification.title)
          ? notification.title
          : "",
        type: notification.type || "",
        info: notification.info || "",
        message: notification.message || "",
        user_id: notification.user_id?.toString() || "",
      });
    }
  }, [notification, open, schema, users, setFormData]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.message) newErrors.message = "Message is required";
    if (!formData.user_id) newErrors.user_id = "Please select a user";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    const payload = {
      id: formData.id,
      title: formData.title,
      info: formData.info,
      message: formData.message,
      user_id: formData.user_id === "all" ? "all" : formData.user_id,
    };

    try {
      const { response, error } = await apiCall(
        "POST",
        `${ApiEndpoints.UPDATE_NOTIFICATION}`,
        payload
      );

      if (response) {
        showToast(response.message || "Notification updated successfully", "success");
        onClose();
      } else {
        showToast(error?.message || "Failed to update notification", "error");
      }
    } catch (err) {
      console.error("Unexpected API error:", err);
      showToast("Something went wrong", "error");
    }

    setSubmitting(false);
  };

  // Filter schema fields
  const visibleFields = schema.filter((field) =>
    ["title", "type", "message", "user_id"].includes(field.name)
  );

  // Enrich fields with select/autocomplete options
  const enrichedFields = visibleFields.map((field) => {
    if (field.name === "user_id") {
      return {
        ...field,
        type: "select",
        options: [
          { label: "All Users", value: "all" },
          ...users.map((u) => ({ label: u.name, value: u.id.toString() })),
        ],
      };
    }
    if (field.name === "title") {
      return {
        ...field,
        type: "autocomplete",
        options: ["System Update", "Maintenance", "Reminder"],
      };
    }
    if (field.name === "type") {
      return {
        ...field,
        type: "select",
        options: [
          { label: "Info", value: "info" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
        ],
      };
    }
    return field;
  });

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Update Notification"
      iconType="edit"
      size="small"
      dividers
      fieldConfig={enrichedFields}
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
