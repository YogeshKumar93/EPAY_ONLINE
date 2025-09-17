import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";

const BlockUnblockUser = ({ open, handleClose, user, onSuccess }) => {
  if (!user) return null;

  const handleConfirm = async () => {
    const newStatus = user.is_active === 1 ? 0 : 1;

    const { error, response } = await apiCall("post",ApiEndpoints.UPDATE_USER_STATUS, {
      id: user.id,
      is_active: newStatus,
    });
console.log("rep[onseeeee",response);

    if (response) {
      okSuccessToast(response?.message);
      handleClose();
      if (onSuccess) onSuccess();
    } else {
      apiErrorToast(error?.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {user.is_active === 1 ? "Block User" : "Unblock User"}
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to{" "}
          <strong>{user.is_active === 1 ? "block" : "unblock"}</strong> user{" "}
          <b>{user.name}</b> 
          {/* (ID: {user.id})? */}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          color={user.is_active === 1 ? "error" : "success"}
          onClick={handleConfirm}
        >
          {user.is_active === 1 ? "Block" : "Unblock"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockUnblockUser;
