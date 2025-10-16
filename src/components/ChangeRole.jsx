import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  MenuItem,
  TextField,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

// Role labels for display
const roleLabels = {
  ret: "Retailer",
  adm: "Admin",
  sadm: "Super Admin",
  di: "Distributor",
  asm: "Area Sales Manager",
  zsm: "Zonal Sales Manager",
  api: "API User",
  dd: "Direct Dealer",
  md: "Master Distributor",
};

const ChangeRoleModal = ({ open, onClose, user, onSuccess }) => {
  const { showToast } = useToast();
  const [role, setRole] = useState(user?.role || "");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // ✅ confirmation modal

  useEffect(() => {
    if (open) {
      setRole(user?.role || "");
    }
  }, [open, user]);

  const handleUpdateClick = () => {
    if (!role) {
      showToast("Please select a role", "error");
      return;
    }
    setConfirmOpen(true); // open confirmation modal
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      showToast("User ID is missing", "error");
      setConfirmOpen(false);
      return;
    }

    setLoading(true);
    try {
      const { response, error } = await apiCall("POST", ApiEndpoints.CHANGE_ROLE, {
        user_id: user.id,
        role,
      });

      if (response) {
        showToast(response.message || "Role updated successfully", "success");
        onSuccess?.();
        onClose();
      } else {
        showToast(error?.message || "Failed to change role", "error");
      }
    } catch (err) {
      console.error("API Error:", err);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Change Role for {user?.name || "User"}
          </Typography>

          <TextField
            select
            label="Select Role"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="normal"
          >
            {roles.length > 0
              ? roles.map((r) => {
                  const value = r.role || r.code;
                  const label = roleLabels[value] || r.role_name || r.name || value;
                  return (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  );
                })
              : Object.entries(roleLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
          </TextField>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
            <Button onClick={onClose} variant="outlined" color="error" disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateClick} variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Update Role"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Role Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the role of <b>{user?.name}</b> to <b>{roleLabels[role] || role}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangeRoleModal;
