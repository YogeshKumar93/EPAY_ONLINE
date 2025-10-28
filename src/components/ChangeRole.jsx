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

const roleMapping = {
  ret: "di",
  di: "md",
  asm: "zsm",
  md: "asm",
  dd: "asm",
};

const ChangeRoleModal = ({ open, onClose, user, onSuccess }) => {
  const { showToast } = useToast();
  const [role, setRole] = useState(user?.role || "");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [parentList, setParentList] = useState([]);
  const [parentId, setParentId] = useState("");
  const [loadingParents, setLoadingParents] = useState(false);
  const [isRoleChanged, setIsRoleChanged] = useState(false);

  useEffect(() => {
    if (open) {
      setRole(user?.role || "");
      setParentId("");
      setParentList([]);
      setIsRoleChanged(false);
    }
  }, [open, user]);

  const fetchParentList = async (mappedRole) => {
    if (!mappedRole) return;
    setLoadingParents(true);
    try {
      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.GET_USERS,
        {
          role: mappedRole,
        }
      );
      if (response?.data?.data) {
        setParentList(response.data.data);
      } else {
        showToast(error?.message || "Failed to fetch parent list", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error fetching parent list", "error");
    } finally {
      setLoadingParents(false);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    const mappedRole = roleMapping[selectedRole];

    // ✅ Show parent field only when role actually changes
    const roleChanged = selectedRole !== user?.role;
    setIsRoleChanged(roleChanged);

    if (roleChanged && mappedRole) {
      fetchParentList(mappedRole);
    } else {
      setParentList([]);
      setParentId("");
    }
  };

  const handleUpdateClick = () => {
    if (!role) {
      showToast("Please select a role", "error");
      return;
    }

    if (isRoleChanged && roleMapping[role] && !parentId) {
      showToast("Please select a parent user", "error");
      return;
    }

    setConfirmOpen(true);
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      showToast("User ID is missing", "error");
      setConfirmOpen(false);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user.id,
        role,
      };

      if (parentId) {
        payload.parent_id = parentId;
      }

      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.CHANGE_ROLE,
        payload
      );

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
            onChange={handleRoleChange}
            margin="normal"
          >
            {Object.entries(roleLabels).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </TextField>

          {/* ✅ Show Select Parent only when role actually changes */}
          {isRoleChanged && roleMapping[role] && (
            <TextField
              select
              label="Select Parent"
              fullWidth
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              margin="normal"
              disabled={loadingParents}
            >
              {loadingParents ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : parentList.length > 0 ? (
                parentList.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({p.establishment})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No parents available</MenuItem>
              )}
            </TextField>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              color="error"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateClick}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Update Role"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Role Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the role of <b>{user?.name}</b> to{" "}
            <b>{roleLabels[role] || role}</b>?
            {isRoleChanged && roleMapping[role] && parentId && (
              <>
                <br />
                New Parent ID: <b>{parentId}</b>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmOpen(false)}
            color="error"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangeRoleModal;
