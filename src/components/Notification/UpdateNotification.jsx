import React, { useEffect, useState } from "react";
 
import { CircularProgress } from "@mui/material";
 
import CommonModal from "../common/CommonModal";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";

const UpdateNotification = ({ open, onClose,  row,onFetchRef }) => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    type: "",
    info: "",
    message: "",
    user_id: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // ✅ Fetch users when modal opens
  useEffect(() => {
    if (!open) return;
    const fetchUsers = async () => {
      try {
        const { response, error } = await apiCall("POST", ApiEndpoints.GET_USERS);
        if (response?.data) {
          const userList = Array.isArray(response.data) ? response.data : [response.data];
          setUsers(userList);
        } else {
          console.error("Failed to fetch users:", error);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [open]);

  // ✅ Prefill when modal opens
  useEffect(() => {
    if (open && row) {
      setFormData({
        id: row.id?.toString() || "",
        title: row.title || "",
        type: row.type || "",
        
        message: row.message || "",
        user_id: row.user_id?.toString() || "",
      });
    }
  }, [open, row]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.message) newErrors.message = "Message is required";
    if (!formData.user_id) newErrors.user_id = "Please select a user";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit update
  const onSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        id: formData.id,
        title: formData.title,
        
        message: formData.message,
        user_id: formData.user_id === "all" ? "all" : formData.user_id,
      };

      const { response, error } = await apiCall("POST", ApiEndpoints.UPDATE_NOTIFICATION, payload);

      if (response) {
        okSuccessToast(response.message || "Notification updated successfully!");
        onFetchRef();
        onClose();
      } else {
        apiErrorToast(error?.message || "Failed to update notification");
      }
    } catch (err) {
      console.error(err);
      apiErrorToast("Something went wrong while updating notification");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Footer Buttons
  const footerButtons = [
    {
      text: "Cancel",
      variant: "outlined",
      onClick: onClose,
      disabled: loading,
    },
    {
      text: loading ? "Updating..." : "Update",
      variant: "contained",
      onClick: onSubmit,
      disabled: loading,
      startIcon: loading ? <CircularProgress size={20} color="inherit" /> : null,
    },
  ];

  // ✅ Field Config
  const fieldConfig = [
    {
      name: "title",
      label: "Title",
      type: "select",
      options: [
        { label: "System Update", value: "System Update" },
        { label: "Maintenance", value: "Maintenance" },
        { label: "Reminder", value: "Reminder" },
      ],
      validation: { required: true },
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { label: "Info", value: "info" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
      ],
      validation: { required: true },
    },
    
    {
      name: "message",
      label: "Message",
      type: "textarea",
      validation: { required: true },
    },
    {
      name: "user_id",
      label: "User",
      type: "select",
      options: [
        { label: "All Users", value: "all" },
        ...users.map((u) => ({ label: u.name, value: u.id.toString() })),
      ],
      validation: { required: true },
    },
  ];

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Update Notification"
      footerButtons={footerButtons}
      size="medium"
      iconType="edit"
      layout="two-column"
      showCloseButton={true}
      closeOnBackdropClick={!loading}
      dividers={true}
      fieldConfig={fieldConfig}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading}
    />
  );
};

export default UpdateNotification;
