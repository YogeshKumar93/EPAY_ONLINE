import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch, FormControlLabel, Box } from "@mui/material";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { useState } from "react";

const PermissionsModal = ({ open, handleClose, user ,onFetchRef}) => {
  const [permissions, setPermissions] = useState(user?.permissions || {});

  const handleToggle = async (permKey) => {
    const newValue = permissions[permKey] ? 0 : 1; // convert to 1/0
    setPermissions((prev) => ({ ...prev, [permKey]: newValue }));

    // Prepare payload dynamically using the permission key
    const payload = {
      user_id: user.id,
      [permKey]: newValue, // key directly as permission name
    };

    const response = await apiCall("post", ApiEndpoints.UPDATE_USER_PERMISSIONS, payload);

    if (response) {
      okSuccessToast(response.message || `Permission "${permKey}" updated`);
            onFetchRef();
      handleClose();
    } else {
      apiErrorToast(response?.message || "Something went wrong");
      // revert toggle if API fails
      setPermissions((prev) => ({ ...prev, [permKey]: prev[permKey] === 1 ? 0 : 1 }));
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={() => handleClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Permissions for {user.name}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={1}>
          {Object.keys(permissions)
            .filter((key) => !["id", "user_id", "created_at", "updated_at"].includes(key))
            .map((permKey) => (
              <FormControlLabel
                key={permKey}
                control={
                  <Switch
                    checked={permissions[permKey] === 1} // 1 = on, 0 = off
                    onChange={() => handleToggle(permKey)}
                    color="primary"
                  />
                }
                label={permKey.toUpperCase()}
              />
            ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionsModal;
