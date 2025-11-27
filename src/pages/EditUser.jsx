import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import { okSuccessToast } from "../utils/ToastUtil";

const EditUser = ({ open, onClose, row, onFetchRef }) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // ROLE — Only adm & sadm
  const [role, setRole] = useState("");
  const rolesList = [
    { value: "sadm", label: "Super Admin" },
    { value: "adm", label: "Admin" },
  ];

  // USER
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    pan: "",
    gst: "",
    start_date: "",
    end_date: "",
    status: false,
  });

  // BUSINESS
  const [business, setBusiness] = useState({
    business_name: "",
  });

  // BUSINESS ADDRESS
  const [businessAddress, setBusinessAddress] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 🔥 Populate state from row when opening modal
  useEffect(() => {
    if (row) {
      setRole(row.role || "adm");

      setUser({
        name: row.name || "",
        email: row.email || "",
        mobile: row.mobile || "",
        pan: row.pan || "",
        gst: row.gst || "",
        start_date: row.start_date || "",
        end_date: row.end_date || "",
        status: row.status === 1, // convert to boolean
      });

      setBusiness({
        business_name: row.business_name || "",
      });

      setBusinessAddress({
        address_line1: row.address_line1 || "",
        address_line2: row.address_line2 || "",
        city: row.city || "",
        state: row.state || "",
        pincode: row.pincode || "",
      });
    } else {
      // Reset to defaults if no row
      setRole("sadm");
      setUser({
        name: "",
        email: "",
        mobile: "",
        pan: "",
        gst: "",
        start_date: "",
        end_date: "",
        status: false,
      });
      setBusiness({
        business_name: "",
      });
      setBusinessAddress({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
      });
    }
  }, [row]);

  // Generic change handlers
  const handleUserChange = (field, value) =>
    setUser((prev) => ({ ...prev, [field]: value }));

  const handleBusinessChange = (field, value) =>
    setBusiness((prev) => ({ ...prev, [field]: value }));

  const handleBusinessAddressChange = (field, value) =>
    setBusinessAddress((prev) => ({ ...prev, [field]: value }));

  // Validation
  const validate = () => {
    const errors = [];
    if (!user.name.trim()) errors.push("User name is required");
    if (!user.email.trim()) errors.push("User email is required");
    if (!user.mobile.trim()) errors.push("User mobile is required");
    if (!business.business_name.trim()) errors.push("Business name is required");
    if (!businessAddress.state.trim()) errors.push("Business state is required");
    if (!businessAddress.pincode.trim()) errors.push("Business pincode is required");
    return errors;
  };

  // Submit
  const handleSubmit = async () => {
    const errors = validate();
    if (errors.length > 0) {
      errors.forEach((e) => showToast(e, "error"));
      return;
    }

    const payload = {
      id: row?.id,
      role,
      user: { ...user, status: user.status ? 1 : 0 }, // convert boolean to number
      business,
      business_address: businessAddress,
    };

    console.log("📌 FINAL UPDATE PAYLOAD →", payload);

    setSubmitting(true);
    try {
      const { response, error } = await apiCall(
        "POST",
        `${ApiEndpoints.EDIT_USER}`,
        payload
      );

      if (response) {
        okSuccessToast(response?.message || "User updated successfully");
        onFetchRef?.();
        onClose();
      } else {
        // Backend validation errors
        if (error?.message && typeof error.message === "object") {
          Object.values(error.message).forEach((msgs) => {
            if (Array.isArray(msgs)) msgs.forEach((m) => showToast(m, "error"));
            else showToast(String(msgs), "error");
          });
        } else {
          showToast(error?.message || "Failed to update user", "error");
        }
      }
    } catch (err) {
      console.error("❌ Update Error:", err);
      showToast("Something went wrong while updating user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          Edit User
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        {/* ROLE */}
        <FormControl fullWidth size="small">
          <InputLabel>Role</InputLabel>
          <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
            {rolesList.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* USER DETAILS */}
        <Typography fontWeight={600}>User Details</Typography>
        <TextField
          label="Name"
          value={user.name}
          onChange={(e) => handleUserChange("name", e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Email"
          value={user.email}
          onChange={(e) => handleUserChange("email", e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Mobile"
          value={user.mobile}
          onChange={(e) => handleUserChange("mobile", e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="PAN"
          value={user.pan}
          onChange={(e) => handleUserChange("pan", e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="GST"
          value={user.gst}
          onChange={(e) => handleUserChange("gst", e.target.value)}
          size="small"
          fullWidth
        />

        {/* DATES */}
        <TextField
          label="Start Date"
          type="date"
          value={user.start_date}
          onChange={(e) => handleUserChange("start_date", e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="End Date"
          type="date"
          value={user.end_date}
          onChange={(e) => handleUserChange("end_date", e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        {/* STATUS */}
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(user.status)}
              onChange={(e) => handleUserChange("status", e.target.checked)}
            />
          }
          label={user.status ? "Active" : "Inactive"}
        />

        {/* BUSINESS */}
        <Typography fontWeight={600}>Business Details</Typography>
        <TextField
          label="Business Name"
          value={business.business_name}
          onChange={(e) => handleBusinessChange("business_name", e.target.value)}
          size="small"
          fullWidth
        />

        {/* ADDRESS */}
        <Typography fontWeight={600}>Business Address</Typography>
        <TextField
          label="Address Line 1"
          value={businessAddress.address_line1}
          onChange={(e) => handleBusinessAddressChange("address_line1", e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Address Line 2"
          value={businessAddress.address_line2}
          onChange={(e) => handleBusinessAddressChange("address_line2", e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="City"
          value={businessAddress.city}
          onChange={(e) => handleBusinessAddressChange("city", e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="State"
          value={businessAddress.state}
          onChange={(e) => handleBusinessAddressChange("state", e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Pincode"
          value={businessAddress.pincode}
          onChange={(e) => handleBusinessAddressChange("pincode", e.target.value)}
          size="small"
          fullWidth
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;
