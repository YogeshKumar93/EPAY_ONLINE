import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { apiCall } from "../../api/apiClient";
const CreateNotification = ({ open, onClose }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [info, setInfo] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(""); // selected user ID
  const [users, setUsers] = useState([]); // users from API
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const titleOptions = ["System Update", "Maintenance", "Reminder"];
  const fetchUsers = async () => {
    try {
      const { response, error } = await apiCall("get", ApiEndpoints.GET_USERS);

      if (response) {
        const userData = response.data
          ? Array.isArray(response.data)
            ? response.data
            : [response.data] // wrap single object in array
          : [];
        setUsers(userData);
      } else {
        console.error("API Error:", error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };
  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    if (!title || !info || !message || !selectedUser) {
      setErrors({ general: "All fields are required" });
      setLoading(false);
      return;
    }
    if (selectedUser !== "all") {
      formData.user_id = selectedUser;
    }

    const formData = {
      title,
      info,
      message,
      user_id: selectedUser, // selected user from dropdown
    };

    try {
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.ADMIN_NOTIFICATION,
        formData
      );

      if (response) {
        okSuccessToast(response.message || "Notification created successfully");
        onClose();
      } else {
        if (error?.errors) {
          setErrors(error.errors);
        } else {
          apiErrorToast(error || "Failed to create notification");
        }
      }
    } catch (err) {
      apiErrorToast(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Notification</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* Title Autocomplete */}
          <Autocomplete
            freeSolo
            options={titleOptions}
            value={title}
            onInputChange={(event, newValue) => setTitle(newValue)}
            renderInput={(params) => <TextField {...params} label="Title" />}
          />

          <FormControl fullWidth>
            <InputLabel id="user-label">Send To</InputLabel>
            <Select
              labelId="user-label"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              label="Send To"
            >
              {/* Option for all users */}
              <MenuItem value="all">All Users</MenuItem>

              {/* Options from API */}
              {users?.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Info Dropdown */}
          <FormControl fullWidth>
            <InputLabel id="info-label">Info Type</InputLabel>
            <Select
              labelId="info-label"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              label="Info Type"
            >
              <MenuItem value="Important">Important</MenuItem>
              <MenuItem value="Alert System">Alert System</MenuItem>
            </Select>
          </FormControl>

          {/* Message Field */}
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={4}
            fullWidth
            error={!!errors.message}
            helperText={errors.message}
          />

          {errors.general && (
            <Typography color="error">{errors.general}</Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            onClose();
            navigate("/notifications");
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNotification;
