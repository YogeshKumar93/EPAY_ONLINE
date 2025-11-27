import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import { okSuccessToast } from "../utils/ToastUtil";

const EditUser = ({ open, onClose, onFetchRef, editData }) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // ROLE
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

  // Steps with unique IDs
  const steps = [
    { id: 'step-role', label: "Role & Basic Info" },
    { id: 'step-user', label: "User Details" },
    { id: 'step-business', label: "Business Details" },
  ];

  // Prefill edit data - SINGLE useEffect
  useEffect(() => {
    if (open && editData) {
      // Prefill role
      setRole(editData.role || "adm");

      // Prefill user
      setUser({
        name: editData.user?.name || "",
        email: editData.user?.email || "",
        mobile: editData.user?.mobile || "",
        pan: editData.user?.pan || "",
        gst: editData.user?.gst || "",
        start_date: editData.user?.start_date || "",
        end_date: editData.user?.end_date || "",
        status: editData.user?.status === 1,
      });

      // Prefill business
      setBusiness({
        business_name: editData.business?.business_name || "",
      });

      // Prefill business address
      setBusinessAddress({
        address_line1: editData.business_address?.address_line1 || "",
        address_line2: editData.business_address?.address_line2 || "",
        city: editData.business_address?.city || "",
        state: editData.business_address?.state || "",
        pincode: editData.business_address?.pincode || "",
      });

      // Reset step to first
      setActiveStep(0);
    }
  }, [open, editData]);

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
    if (!user.start_date) errors.push("User start date is required");
    if (!user.end_date) errors.push("User end date is required");
    if (!business.business_name.trim())
      errors.push("Business name is required");
    if (!businessAddress.state.trim())
      errors.push("Business state is required");
    if (!businessAddress.pincode.trim())
      errors.push("Business pincode is required");

    return errors;
  };

  // Step handlers
  const handleNext = () => {
    let stepErrors = [];

    if (activeStep === 0) {
      // Step 1: Role - no required fields
    }

    if (activeStep === 1) {
      if (!user.name.trim()) stepErrors.push("User name is required");
      if (!user.email.trim()) stepErrors.push("User email is required");
      if (!user.mobile.trim()) stepErrors.push("User mobile is required");
      if (!user.start_date) stepErrors.push("User start date is required");
      if (!user.end_date) stepErrors.push("User end date is required");
    }

    if (activeStep === 2) {
      if (!business.business_name.trim())
        stepErrors.push("Business name is required");
      if (!businessAddress.state.trim())
        stepErrors.push("Business state is required");
      if (!businessAddress.pincode.trim())
        stepErrors.push("Business pincode is required");
    }

    if (stepErrors.length > 0) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const errors = validate();
    if (errors.length > 0) {
      errors.forEach((e) => showToast(e, "error"));
      return;
    }

    const payload = {
      user_id: editData?.id,
      role,
      user: {
        ...user,
        status: user.status ? 1 : 0,
      },
      business,
      business_address: businessAddress,
    };

    setSubmitting(true);

    try {
      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.EDIT_USER,
        payload
      );

      if (response) {
        okSuccessToast("User updated successfully");
        onFetchRef?.();
        onClose();
      } else {
        showToast(error?.message || "Failed to update user", "error");
      }
    } catch (err) {
      showToast("Something went wrong while updating user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '1.25rem' }}>👤</span>
                Role Selection
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Role *</InputLabel>
                <Select
                  value={role}
                  label="Role *"
                  onChange={(e) => setRole(e.target.value)}
                >
                  {rolesList.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Personal Info */}
            <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '1.25rem' }}>📝</span>
                  Personal Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Full Name *"
                      value={user.name}
                      onChange={(e) => handleUserChange("name", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email *"
                      value={user.email}
                      onChange={(e) => handleUserChange("email", e.target.value)}
                      size="small"
                      fullWidth
                      type="email"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Mobile *"
                      value={user.mobile}
                      onChange={(e) => handleUserChange("mobile", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="PAN Number"
                      value={user.pan}
                      onChange={(e) => handleUserChange("pan", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="GST Number"
                      value={user.gst}
                      onChange={(e) => handleUserChange("gst", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Account Period */}
            <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '1.25rem' }}>📅</span>
                  Account Period
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Start Date *"
                      type="date"
                      value={user.start_date}
                      onChange={(e) => handleUserChange("start_date", e.target.value)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="End Date *"
                      type="date"
                      value={user.end_date}
                      onChange={(e) => handleUserChange("end_date", e.target.value)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(user.status)}
                      onChange={(e) => handleUserChange("status", e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Account Status: <strong>{user.status ? "Active" : "Inactive"}</strong>
                    </Typography>
                  }
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Business Info */}
            <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '1.25rem' }}>🏢</span>
                  Business Information
                </Typography>
                
                <TextField
                  label="Business Name *"
                  value={business.business_name}
                  onChange={(e) => handleBusinessChange("business_name", e.target.value)}
                  size="small"
                  fullWidth
                />
              </CardContent>
            </Card>

            {/* Business Address */}
            <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '1.25rem' }}>📍</span>
                  Business Address
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Address Line 1"
                      value={businessAddress.address_line1}
                      onChange={(e) => handleBusinessAddressChange("address_line1", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Address Line 2"
                      value={businessAddress.address_line2}
                      onChange={(e) => handleBusinessAddressChange("address_line2", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      value={businessAddress.city}
                      onChange={(e) => handleBusinessAddressChange("city", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="State *"
                      value={businessAddress.state}
                      onChange={(e) => handleBusinessAddressChange("state", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Pincode *"
                      value={businessAddress.pincode}
                      onChange={(e) => handleBusinessAddressChange("pincode", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1, borderBottom: 1, borderColor: 'divider', backgroundColor: "#f3ebebff" }}>
        <Typography variant="h5" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.5rem' }}>✏️</span>
          Edit User
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mt: 1 }}>
          Update user details step by step
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        {/* Fixed Stepper with unique keys */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Box>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              disabled={submitting}
              sx={{ backgroundColor: "#9180a2ff", color: "#fff" }}
            >
              Back
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={submitting}
            sx={{ backgroundColor: "#9180a2ff", color: "#fff" }}
          >
            Cancel
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ backgroundColor: "#492077" }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ backgroundColor: "#492077" }}
            >
              {submitting ? "Updating..." : "Update User"}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;