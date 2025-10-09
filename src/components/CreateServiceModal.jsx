import { useState, useEffect } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import CommonModal from "./common/CommonModal";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { useToast } from "../utils/ToastContext";

const CreateServiceModal = ({ open, onClose, onFetchRef }) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    route: "",
    is_active: 1,
  });

  const { showToast } = useToast();
  const [routes, setRoutes] = useState([]); 
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Fetch route list automatically when modal opens
  const fetchRoutes = async () => {
    setLoadingRoutes(true);
    try {
      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.GET_ROUTES // 👈 use correct API endpoint for fetching routes
      );

      if (response?.data) {
        const mappedRoutes = response.data.map((route) => ({
          value: route.id || route.route_id,
          label: route.name || route.route_name,
        }));
        setRoutes(mappedRoutes);
      } else {
        showToast(error?.message || "Failed to load routes", "error");
      }
    } catch (err) {
      console.error("Error fetching routes:", err);
      showToast("Something went wrong while fetching routes", "error");
    } finally {
      setLoadingRoutes(false);
    }
  };

  // ✅ Trigger fetchRoutes when modal opens
  useEffect(() => {
    if (open) {
      fetchRoutes();
    }
  }, [open]);

  // ✅ Handle create service submit
  const handleCreate = async () => {
    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.CREATE_SERVICE,
      form
    );

    if (response) {
      showToast(response?.message || "Service created successfully", "success");
      onFetchRef();
      onClose();
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

        {/* ✅ Route Field */}
        <TextField
          select
          label="Route"
          name="route"
          value={form.route}
          onChange={handleChange}
          fullWidth
          disabled={loadingRoutes}
        >
          {routes.map((route) => (
            <MenuItem key={route.value} value={route.label}>
              {route.label}
            </MenuItem>
          ))}
        </TextField>

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
