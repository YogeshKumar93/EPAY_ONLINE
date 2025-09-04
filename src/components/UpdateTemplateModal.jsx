import { useState, useEffect, useMemo } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "./common/CommonModal";

const UpdateTemplateModal = ({ open, onClose, template, onSuccess }) => {
  const [form, setForm] = useState({
    id: "",
    vendor: "",
    name: "",
    message: "",
    temp_id: "",
    status: 1,
  });
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (template) {
      const init = {
        id: template.id,
        vendor: template.vendor || "",
        name: template.name || "",
        message: template.message || "",
        temp_id: template.temp_id || "",
        status: template.status ?? 1,
      };
      setForm(init);
      setInitialData(init);
    }
  }, [template]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!initialData) return;

    // 🟢 Extract only changed fields + always include `id`
    const updatedFields = { id: form.id };
    Object.keys(form).forEach((key) => {
      if (form[key] !== initialData[key]) {
        updatedFields[key] = form[key];
      }
    });

    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.UPDATE_TEMPLATE,
      updatedFields
    );

    if (!error && response?.status) {
      onSuccess?.();
      onClose();
    } else {
      alert("Update failed: " + (error?.message || response?.message));
    }
  };

  // ✅ Check if any change has been made
  const isChanged = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(form) !== JSON.stringify(initialData);
  }, [form, initialData]);

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Edit Template"
      iconType="info"
      footerButtons={[
        { text: "Cancel", variant: "outlined", onClick: onClose },
        {
          text: "Update",
          variant: "contained",
          onClick: handleUpdate,
          disabled: !isChanged, // ✅ disable when unchanged
        },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Vendor"
          name="vendor"
          value={form.vendor}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Template Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Message"
          name="message"
          value={form.message}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={3}
        />
        <TextField
          label="Template ID"
          name="temp_id"
          value={form.temp_id}
          onChange={handleChange}
          fullWidth
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

export default UpdateTemplateModal;
