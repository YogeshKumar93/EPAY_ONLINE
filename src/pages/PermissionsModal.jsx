import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useState } from "react";
import { useToast } from "../utils/ToastContext";
import CommonModal from "../components/common/CommonModal";
import { apiErrorToast } from "../utils/ToastUtil";

const PermissionsModal = ({ open, handleClose, user, onFetchRef }) => {
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
      // revert change on error
      setPermissions((prev) => ({
        ...prev,
        [permKey]: prev[permKey] === 1 ? 0 : 1,
      }));
    }
  };

  if (!user) return null;

  const permKeys = Object.keys(permissions).filter(
    (key) => !["id", "user_id", "created_at", "updated_at"].includes(key)
  );

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title={`Permissions for ${user.name}`}
      maxWidth="sm"
      footerButtons={[
        {
          text: "Close",
          variant: "outlined",
          onClick: handleClose,
        },
      ]}
    >
      <Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {permKeys.map((permKey) => (
            <Grid item xs={12} sm={6} key={permKey}>
              <FormControlLabel
                control={
                  <Switch
                    checked={permissions[permKey] === 1}
                    onChange={() => handleToggle(permKey)}
                    color="primary"
                  />
                }
                label={permKey.toUpperCase()}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </CommonModal>
  );
};

export default PermissionsModal;
