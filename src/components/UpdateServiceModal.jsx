import { useState, useEffect, useMemo } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "./common/CommonModal";
import { useToast } from "../utils/ToastContext";

const UpdateServiceModal = ({ open, onClose, service, onFetchRef }) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    route: "",
  });

  const [initialData, setInitialData] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const { showToast } = useToast();

  // Initialize form when service changes
  useEffect(() => {
    if (service) {
      const init = {
        id: service.id,
        name: service.name || "",
        route: service.route || "", // current route code
      };
      setForm(init);
      setInitialData(init);
    }
  }, [service]);

  // Fetch routes when modal opens
  const fetchRoutes = async () => {
    setLoadingRoutes(true);
    try {
      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.GET_ROUTES
      );

      if (response?.data) {
        const mappedRoutes = response.data.map((route) => ({
          value: route.code, // Use code as value
          label: route.name, // Show name in dropdown
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

  useEffect(() => {
    if (open) fetchRoutes();
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    // Only send id and selected route code
    const payload = {
      id: form.id,
      route: form.route,
    };

    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.UPDATE_SERVICE,
      payload
    );

    if (!error && response?.status) {
      onFetchRef();
      onClose();
      showToast("Service updated successfully", "success");
    } else {
      showToast(
        "Update failed: " + (error?.message || response?.message),
        "error"
      );
    }
  };

  // Check if any change has been made
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
          disabled: !isChanged,
        },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Read-only service name */}
        <TextField
          label="Service Name"
          name="name"
          value={form.name}
          fullWidth
          disabled
        />

        {/* Route select */}
        <TextField
          select
          label="Route"
          name="route"
          value={form.route} // matches route code
          onChange={handleChange}
          fullWidth
          disabled={loadingRoutes}
        >
          {routes.map((route) => (
            <MenuItem key={route.value} value={route.value}>
              {route.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </CommonModal>
  );
};

export default UpdateServiceModal;
