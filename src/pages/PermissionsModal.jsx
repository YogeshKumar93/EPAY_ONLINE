import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiErrorToast } from "../utils/ToastUtil";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { useState } from "react";
import { useToast } from "../utils/ToastContext";

const PermissionsDrawer = ({ open, handleClose, user, onFetchRef }) => {
  const [permissions, setPermissions] = useState(user?.permissions || {});
  const { showToast } = useToast();

  const handleToggle = async (permKey) => {
    const newValue = permissions[permKey] ? 0 : 1;
    setPermissions((prev) => ({ ...prev, [permKey]: newValue }));

    const payload = {
      user_id: user.id,
      [permKey]: newValue,
    };

    const response = await apiCall(
      "post",
      ApiEndpoints.UPDATE_USER_PERMISSIONS,
      payload
    );

    if (response) {
      showToast(
        response.message || `Permission "${permKey}" updated`,
        "success"
      );
      onFetchRef();
    } else {
      apiErrorToast(response?.message || "Something went wrong");
      setPermissions((prev) => ({
        ...prev,
        [permKey]: prev[permKey] === 1 ? 0 : 1,
      }));
    }
  };

  if (!user) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => handleClose(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 400,
          p: 2,
          top: "64px", // push below navbar
          height: "calc(100% - 64px)", // take remaining height
        },
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Permissions for {user.name}</Typography>
        <IconButton onClick={() => handleClose(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* Permissions List */}
      <Box display="flex" flexDirection="column" gap={1} mt={2}>
        {Object.keys(permissions)
          .filter(
            (key) =>
              !["id", "user_id", "created_at", "updated_at"].includes(key)
          )
          .map((permKey) => (
            <FormControlLabel
              key={permKey}
              control={
                <Switch
                  checked={permissions[permKey] === 1}
                  onChange={() => handleToggle(permKey)}
                  color="primary"
                />
              }
              label={permKey.toUpperCase()}
            />
          ))}
      </Box>

      {/* Footer */}
      <Box mt={3}>
        {/* <Button variant="outlined" fullWidth onClick={() => handleClose(false)}>
          Close
        </Button> */}
      </Box>
    </Drawer>
  );
};

export default PermissionsDrawer;
