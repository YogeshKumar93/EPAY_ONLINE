import { useState } from "react";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import CommonModal from "./common/CommonModal";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";

const CreateTemplateModal = ({ open, onClose, onFetchRef }) => {
  const [form, setForm] = useState({
    vendor: "",
    name: "",
    message: "",
    temp_id: "",
    status: 1,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let val = value;
    if (name === "message" && value.length > 250) val = value.slice(0, 250); // max 250 chars
    if (name === "temp_id" && value.length > 20) val = value.slice(0, 20); // max 20 chars

    setForm({ ...form, [name]: val });
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.vendor) newErrors.vendor = "Vendor is required";
    if (!form.name) newErrors.name = "Template name is required";
    if (!form.message) newErrors.message = "Message is required";
    else if (form.message.length > 250) newErrors.message = "Message cannot exceed 250 characters";
    if (!form.temp_id) newErrors.temp_id = "Template ID is required";
    else if (form.temp_id.length > 20) newErrors.temp_id = "Template ID cannot exceed 20 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return; // stop if validation fails

    setSubmitting(true);
    try {
      const { error, response } = await apiCall("POST", ApiEndpoints.CREATE_TEMPLATE, form);

      if (!error && response?.status) {
        onFetchRef(); // refresh parent table
        onClose();
        setForm({ vendor: "", name: "", message: "", temp_id: "", status: 1 });
      } else {
        alert("Failed: " + (error?.message || response?.message));
      }
    } catch (err) {
      console.error("Error creating template:", err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create Template"
      iconType="info"
      footerButtons={[
        { text: "Cancel", variant: "outlined", onClick: onClose, disabled: submitting },
        { text: "Create", variant: "contained", onClick: handleCreate, disabled: submitting },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Vendor"
          name="vendor"
          value={form.vendor}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.vendor}
          helperText={errors.vendor}
        />
        <TextField
          label="Template Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Message"
          name="message"
          value={form.message}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={3}
          required
          error={!!errors.message}
          helperText={errors.message}
        />
        <TextField
          label="Template ID"
          name="temp_id"
          value={form.temp_id}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.temp_id}
          helperText={errors.temp_id}
        />
        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value={1}>Active</MenuItem>
          <MenuItem value={0}>Inactive</MenuItem>
        </TextField>
      </Box>
    </CommonModal>
  );
};

export default CreateTemplateModal;
