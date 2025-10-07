import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";

const LevinRegisterRemitter = ({ open, onClose, mobile, onRegistered }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    number: mobile || "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pin: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // keep mobile in sync
  useEffect(() => {
    if (mobile) {
      setFormData((prev) => ({ ...prev, number: mobile }));
    }
  }, [mobile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setSubmitting(true);
    setErrors({});
    try {
      // include type = "bank" by default
      const payload = { ...formData, type: "bank" };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_REGISTER,
        payload
      );

      if (response) {
        const state = response?.data?.state; // Get the state from the response
        const sender_id = response?.response?.data?.sender?.id;

        showToast(response?.response?.data?.message, "success");

        // Pass the state and sender_id to the parent component
        onRegistered?.({
          number: formData.number,
          state, // Add the state to the onRegistered payload
          sender_id,
        });
        onClose();
      } else {
        showToast(error?.message, "error");
      }
    } catch (err) {
      setErrors(err?.response?.data?.errors || {});
      showToast("Failed to register sender", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 2 },
          boxShadow: { xs: "none", sm: "0 10px 40px rgba(0,0,0,0.1)" },
          bgcolor: "#FFFFFF",
          fontFamily: '"DM Sans", sans-serif !important',
          maxHeight: "90vh",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ m: 0, p: 0 }}>
        <Box sx={{ height: "4px", width: "100%", bgcolor: "#854fff" }} />
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <InfoIcon
              sx={{ fontSize: 24, color: theme.palette.info.main, mr: 1.5 }}
            />
            <Typography
              variant="h5"
              component="h2"
              sx={{
                color: "#364a63",
                fontWeight: 550,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Register Sender
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
              "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          p: 4,
          backgroundColor: "#ffffff",
          overflowY: "auto",
          maxHeight: "calc(90vh - 140px)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 3,
            alignItems: "start",
            mt: 1.4,
          }}
        >
          {/* Fields */}
          <TextField
            name="first_name"
            label="First Name"
            placeholder="Enter First name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.first_name}
            helperText={errors.first_name}
          />
          <TextField
            name="last_name"
            label="Last Name"
            placeholder="Enter Last name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.last_name}
            helperText={errors.last_name}
          />
          <TextField
            name="number"
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            value={formData.number}
            onChange={handleChange}
            fullWidth
            required
            disabled
            error={!!errors.number}
            helperText={errors.number}
          />
          <TextField
            name="address1"
            label="Address Line 1"
            placeholder="Enter Address Line 1"
            value={formData.address1}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.address1}
            helperText={errors.address1}
          />
          <TextField
            name="address2"
            label="Address Line 2"
            placeholder="Enter Address Line 2"
            value={formData.address2}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.address2}
            helperText={errors.address2}
          />
          <TextField
            name="city"
            label="City"
            placeholder="Enter City"
            value={formData.city}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.city}
            helperText={errors.city}
          />
          <TextField
            name="state"
            label="State"
            placeholder="Enter State"
            value={formData.state}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.state}
            helperText={errors.state}
          />
          <TextField
            name="pin"
            label="PIN Code"
            placeholder="Enter PIN Code"
            value={formData.pin}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.pin}
            helperText={errors.pin}
          />
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          gap: 1,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "#f8fafc",
          flexDirection: { xs: "column", sm: "row" },
          "& > *": { width: { xs: "100%", sm: "auto" } },
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={submitting}
          sx={{
            backgroundColor: "#8094ae !important",
            color: "#fff",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleRegister}
          variant="contained"
          disabled={submitting}
          sx={{
            backgroundColor: "#854fff",
            color: "#fff",
            textTransform: "none",
          }}
        >
          {submitting ? "Registering..." : "Register"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LevinRegisterRemitter;
