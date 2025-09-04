import { useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import CommonModal from "./common/CommonModal";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";

const CreateTemplateModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    vendor: "",
    name: "",
    message: "",
    temp_id: "",
    status: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_TEMPLATE,
        form
      );

      if (!error && response?.status) {
        onSuccess?.(); // refresh parent table
        onClose();
        setForm({ vendor: "", name: "", message: "", temp_id: "", status: 1 });
      } else {
        alert("Failed: " + (error?.message || response?.message));
      }
    } catch (err) {
      console.error("Error creating template:", err);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create Template"
      iconType="info"
      footerButtons={[
        { text: "Cancel", variant: "outlined", onClick: onClose },
        { text: "Create", variant: "contained", onClick: handleCreate },
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
        />
        <TextField
          label="Template Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Message"
          name="message"
          value={form.message}
          onChange={handleChange}
          fullWidth
          multiline
          required
          minRows={3}
        />
        <TextField
          label="Template ID"
          name="temp_id"
          value={form.temp_id}
          onChange={handleChange}
          fullWidth
          required
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
