import {
  Box,
  Typography,
  Switch,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useState, useEffect, useContext } from "react";
import { useToast } from "../utils/ToastContext";
import CommonModal from "../components/common/CommonModal";
import { apiErrorToast } from "../utils/ToastUtil";
import { Security, Lock } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";

const PermissionsModal = ({ open, handleClose, user, onFetchRef }) => {
  const { showToast } = useToast();
  const [permissions, setPermissions] = useState({});
  const [viewPermissions, setViewPermissions] = useState({});
  const [actionPermissions, setActionPermissions] = useState({});
  const { fetchUserProfile } = useContext(AuthContext);

  // Load permissions from user prop
  useEffect(() => {
    if (user?.permissions) {
      const perms = user.permissions;
      const views = {};
      const actions = {};

      Object.keys(perms).forEach((key) => {
        if (key.endsWith("_actions")) {
          const base = key.replace("_actions", "");
          actions[base] = perms[key] ? 1 : 0;
        } else {
          views[key] = perms[key] ? 1 : 0;
        }
      });

      setPermissions(perms);
      setViewPermissions(views);
      setActionPermissions(actions);
    }
  }, [user]);

  // Toggle VIEW
  const handleViewToggle = async (key) => {
    const prevView = viewPermissions[key];
    const newView = prevView === 1 ? 0 : 1;

    setViewPermissions((v) => ({ ...v, [key]: newView }));

    // If view is turned off, disable related actions too
    if (newView === 0 && actionPermissions[key] === 1) {
      setActionPermissions((a) => ({ ...a, [key]: 0 }));
      const actPayload = { user_id: user.id, [`${key}_actions`]: 0 };
      await apiCall("post", ApiEndpoints.UPDATE_USER_PERMISSIONS, actPayload);
    }

    const payload = { user_id: user.id, [key]: newView };
    const response = await apiCall("post", ApiEndpoints.UPDATE_USER_PERMISSIONS, payload);

    if (response) {
      showToast(response.message || "View permission updated", "success");
      if (fetchUserProfile) await fetchUserProfile();
      if (onFetchRef) await onFetchRef();
    } else {
      apiErrorToast(response?.message || "Something went wrong");
      setViewPermissions((v) => ({ ...v, [key]: prevView }));
    }
  };

  // Toggle ACTION
  const handleActionToggle = async (key) => {
    if (viewPermissions[key] !== 1) {
      showToast("Enable view first to allow actions", "warning");
      return;
    }

    const prevAction = actionPermissions[key];
    const newAction = prevAction === 1 ? 0 : 1;

    setActionPermissions((a) => ({ ...a, [key]: newAction }));

    const payload = { user_id: user.id, [`${key}_actions`]: newAction };
    const response = await apiCall("post", ApiEndpoints.UPDATE_USER_PERMISSIONS, payload);

    if (response) {
      showToast(response.message || "Action permission updated", "success");
      if (fetchUserProfile) await fetchUserProfile();
      if (onFetchRef) await onFetchRef();
    } else {
      apiErrorToast(response?.message || "Something went wrong");
      setActionPermissions((a) => ({ ...a, [key]: prevAction }));
    }
  };

  if (!user) return null;

  const serviceKeys = Object.keys(viewPermissions).filter(
    (k) => !["id", "user_id", "created_at", "updated_at"].includes(k)
  );

  const activeCount = Object.values(viewPermissions).filter((v) => v === 1).length;

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Permission to{" "}
              <Typography component="span" sx={{ color: "primary.main" }}>
                {user?.name}
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      }
      maxWidth="md"
      footerButtons={[{ text: "Close", variant: "outlined", onClick: handleClose }]}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            mt: -1,
          }}
        >
          <Chip
            icon={<Security />}
            label={`${activeCount}/${serviceKeys.length}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

  <Table>
  <TableHead>
    <TableRow sx={{ backgroundColor: alpha("#1976d2", 0.08) }}>
      <TableCell sx={{ fontWeight: 700 }}>Service</TableCell>
      <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Status</TableCell>

      {/* ✅ Show Action column only if user.role is NOT ret, dd, or api */}
      {!["ret", "dd", "api", "di"].includes(user?.role) && (
        <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Action</TableCell>
      )}
    </TableRow>
  </TableHead>

  <TableBody>
    {serviceKeys.map((key) => (
      <TableRow key={key} hover>
        <TableCell sx={{ textTransform: "capitalize", fontWeight: 600 }}>
          {key.replace(/_/g, " ")}
        </TableCell>

        <TableCell align="center">
          <Switch
            checked={viewPermissions[key] === 1}
            onChange={() => handleViewToggle(key)}
            color="primary"
            size="small"
          />
        </TableCell>

        {/* ✅ Action column will show only if user.role is NOT ret, dd, or api */}
        {!["ret", "dd", "api", "di"].includes(user?.role) && (
          <TableCell align="center">
            {key + "_actions" in permissions ? (
              <Switch
                checked={actionPermissions[key] === 1}
                onChange={() => handleActionToggle(key)}
                color="success"
                size="small"
                disabled={viewPermissions[key] !== 1}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            )}
          </TableCell>
        )}
      </TableRow>
    ))}
  </TableBody>
</Table>



        {serviceKeys.length === 0 && (
          <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
            <Lock sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">No Permissions Available</Typography>
          </Box>
        )}
      </Box>
    </CommonModal>
  );
};

export default PermissionsModal;
