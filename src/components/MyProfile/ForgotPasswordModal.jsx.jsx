import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import AuthContext from "../../contexts/AuthContext";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";

import CommonModal from "../common/CommonModal";
import { useToast } from "../../utils/ToastContext";

const ForgotPasswordModal = ({ open, onClose }) => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const { showToast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ⭐ FETCH USERS LIST
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Fetch all users
        const { response, error } = await apiCall(
          "post",
          ApiEndpoints.GET_USERS
        );

        const usersArray = response?.data?.data || [];
        setUsers(usersArray);
        console.log("FETCHED USERS: ", usersArray);
        // Default selected user to current logged-in user if present
        if (user?.id && usersArray.some((u) => u.id === user.id)) {
          setSelectedUser(user.id);
        }
      } catch (err) {
        console.error("FETCH USER ERROR: ", err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [open, user]);

  // ⭐ SUBMIT PASSWORD UPDATE
  const handleSubmit = async () => {
    setError("");
    console.log("SUBMITTING FOR USER ID: ");
    setLoading(true);

    try {
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.FORGOT_PASS,
        {
          user_id: selectedUser,
          new_password: newPassword,
        }
      );

      if (response) {
        showToast( response.message || "Password changed successfully!","success");
        onClose();
      } else {
        showToast(response?.message || "Failed to change password" ,"error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to change password");
    }

    setLoading(false);
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Change User Password"
      width="400px"
      footerButtons={[]}
    >
      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* USER DROPDOWN */}
            <TextField
              select
              fullWidth
              label="Select User"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              sx={{ mb: 2 }}
            >
              {users.length > 0 ? (
                users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name} (ID: {u.id})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No users found</MenuItem>
              )}
            </TextField>

            {/* NEW PASSWORD */}
            <TextField
              label="New Password"
              fullWidth
              type={showPass ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)}>
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              fullWidth
              type={showCPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCPass(!showCPass)}>
                      {showCPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* ERROR MESSAGE */}
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </>
        )}
      </Box>
      
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          py: 1.2, mt:2,
          fontWeight: 600,
          borderRadius: "10px",
          background: "linear-gradient(135deg, #492077, #492077)",
        }}
      >
        {loading ? "Processing..." : "Change User Password"}
      </Button>
    </CommonModal>
  );
};

export default ForgotPasswordModal;
