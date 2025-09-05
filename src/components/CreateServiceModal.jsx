import { useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import CommonModal from "./common/CommonModal";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { useToast } from "../utils/ToastContext";

const CreateServiceModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    route: "",
    is_active: 1,
  });
const {showToast} = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_SERVICE,
        form
        
      );
        onClose();
      if (response) {
        onSuccess?.(); 
        showToast(response?.message || "Service created successfully", "success");
        setForm({ name: "", code: "", route: "", is_active: 1 });
      } else {
      showToast(error?.message || "Failed to create Service", "error");
      }
    
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create Service"
      iconType="info"
      footerButtons={[
        { text: "Cancel", variant: "outlined", onClick: onClose },
        { text: "Create", variant: "contained", onClick: handleCreate },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Service Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Code"
          name="code"
          value={form.code}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Route"
          name="route"
          value={form.route}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          select
          label="Status"
          name="is_active"
          value={form.is_active}
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

export default CreateServiceModal;
