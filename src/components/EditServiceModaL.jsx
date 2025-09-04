import { useState, useEffect, useMemo } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "./common/CommonModal";

const EditServiceModal = ({ open, onClose, service, onSuccess }) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    code: "",
    route: "",
    is_active: 1,
  });
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (service) {
      const init = {
        id: service.id,
        name: service.name || "",
        code: service.code || "",
        route: service.route || "",
        is_active: service.is_active ?? 1,
      };
      setForm(init);
      setInitialData(init);
    }
  }, [service]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.UPDATE_SERVICE,
      form
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
      title="Edit Service"
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

export default EditServiceModal;
