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
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

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
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (open && editData) {
      setRole(editData.role || "adm");

      setUser({
        name: editData.user?.name || "",
        email: editData.user?.email || "",
        mobile: editData.user?.mobile || "",
        pan: editData.user?.pan || "",
        gst: editData.user?.gst || "",
        start_date: formatDate(editData.user?.start_date),
        end_date: formatDate(editData.user?.end_date),
        status: editData.user?.status === 1,
      });

      setBusiness({
        business_name: editData.business?.business_name || "",
      });

      setBusinessAddress({
        address_line1: editData.business_address?.address_line1 || "",
        address_line2: editData.business_address?.address_line2 || "",
        city: editData.business_address?.city || "",
        state: editData.business_address?.state || "",
        pincode: editData.business_address?.pincode || "",
      });

      setActiveStep(0);
      setTouched({});
      setSubmitAttempted(false);
    }
  }, [open, editData]);

  // Generic change handlers with touch tracking
  const handleUserChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleBusinessChange = (field, value) => {
    setBusiness((prev) => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleBusinessAddressChange = (field, value) => {
    setBusinessAddress((prev) => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Handle blur events for touch tracking
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Validation functions
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateMobile = (mobile) => {
    if (!mobile) return "Mobile number is required";
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) return "Please enter a valid 10-digit mobile number";
    return "";
  };

  const validatePAN = (pan) => {
    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      return "Please enter a valid PAN number";
    }
    return "";
  };

  const validateGST = (gst) => {
    if (gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)) {
      return "Please enter a valid GST number";
    }
    return "";
  };

  const validatePincode = (pincode) => {
    if (!pincode) return "Pincode is required";
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode)) return "Please enter a valid 6-digit pincode";
    return "";
  };

  const validateDates = (startDate, endDate) => {
    if (!startDate) return "Start date is required";
    if (!endDate) return "End date is required";
    if (new Date(startDate) > new Date(endDate)) {
      return "End date must be after or equal to start date";
    }
    return "";
  };

  // Get field errors - industry standard: show errors only after touch/submit attempt
  const getFieldError = (field, value, additionalData = {}) => {
    const shouldShowError = touched[field] || submitAttempted;
    
    if (!shouldShowError) return "";

    switch (field) {
      case 'email':
        return validateEmail(value);
      case 'mobile':
        return validateMobile(value);
      case 'pan':
        return validatePAN(value);
      case 'gst':
        return validateGST(value);
      case 'pincode':
        return validatePincode(value);
      case 'dates':
        return validateDates(additionalData.startDate, additionalData.endDate);
      case 'name':
        return !value ? "Full name is required" : "";
      case 'business_name':
        return !value ? "Business name is required" : "";
      case 'address_line1':
        return !value ? "Address Line 1 is required" : "";
      case 'address_line2':
        return !value ? "Address Line 2 is required" : "";
      case 'city':
        return !value ? "City is required" : "";
      case 'state':
        return !value ? "State is required" : "";
      case 'role':
        return !value ? "Role is required" : "";
      default:
        return "";
    }
  };

  // Check if step has errors
  const hasStepErrors = (step) => {
    switch (step) {
      case 0:
        return !!getFieldError('role', role);
      case 1:
        return !!getFieldError('name', user.name) ||
               !!getFieldError('email', user.email) ||
               !!getFieldError('mobile', user.mobile) ||
               !!getFieldError('pan', user.pan) ||
               !!getFieldError('gst', user.gst) ||
               !!getFieldError('dates', '', { startDate: user.start_date, endDate: user.end_date });
      case 2:
        return !!getFieldError('business_name', business.business_name) ||
               !!getFieldError('address_line1', businessAddress.address_line1) ||
               !!getFieldError('address_line2', businessAddress.address_line2) ||
               !!getFieldError('city', businessAddress.city) ||
               !!getFieldError('state', businessAddress.state) ||
               !!getFieldError('pincode', businessAddress.pincode);
      default:
        return false;
    }
  };

  // Step handlers
  const handleNext = () => {
    setSubmitAttempted(true);
    
    if (hasStepErrors(activeStep)) {
      showToast("Please fix all errors before proceeding", "error");
      return;
    }

    setActiveStep((prev) => prev + 1);
    setSubmitAttempted(false);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setSubmitAttempted(false);
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    // Check if any step has errors
    let hasErrors = false;
    for (let step = 0; step < steps.length; step++) {
      if (hasStepErrors(step)) {
        hasErrors = true;
        break;
      }
    }

    if (hasErrors) {
      showToast("Please fix all errors before submitting", "error");
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
              <FormControl fullWidth size="small" error={!!getFieldError('role', role)}>
                <InputLabel>Role *</InputLabel>
                <Select
                  value={role}
                  label="Role *"
                  onChange={(e) => setRole(e.target.value)}
                  onBlur={() => handleBlur('role')}
                >
                  {rolesList.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </Select>
                {getFieldError('role', role) && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {getFieldError('role', role)}
                  </Typography>
                )}
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
                      onBlur={() => handleBlur('name')}
                      size="small"
                      fullWidth
                      error={!!getFieldError('name', user.name)}
                      helperText={getFieldError('name', user.name)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email *"
                      value={user.email}
                      onChange={(e) => handleUserChange("email", e.target.value)}
                      onBlur={() => handleBlur('email')}
                      size="small"
                      fullWidth
                      type="email"
                      error={!!getFieldError('email', user.email)}
                      helperText={getFieldError('email', user.email)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Mobile *"
                      value={user.mobile}
                      onChange={(e) => handleUserChange("mobile", e.target.value)}
                      onBlur={() => handleBlur('mobile')}
                      size="small"
                      fullWidth
                      error={!!getFieldError('mobile', user.mobile)}
                      helperText={getFieldError('mobile', user.mobile)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="PAN Number"
                      value={user.pan}
                      onChange={(e) => handleUserChange("pan", e.target.value.toUpperCase())}
                      onBlur={() => handleBlur('pan')}
                      size="small"
                      fullWidth
                      error={!!getFieldError('pan', user.pan)}
                      helperText={getFieldError('pan', user.pan)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="GST Number"
                      value={user.gst}
                      onChange={(e) => handleUserChange("gst", e.target.value.toUpperCase())}
                      onBlur={() => handleBlur('gst')}
                      size="small"
                      fullWidth
                      error={!!getFieldError('gst', user.gst)}
                      helperText={getFieldError('gst', user.gst)}
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
                      onBlur={() => handleBlur('start_date')}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      error={!!getFieldError('dates', '', { startDate: user.start_date, endDate: user.end_date })}
                      helperText={getFieldError('dates', '', { startDate: user.start_date, endDate: user.end_date })?.includes('Start date') ? getFieldError('dates', '', { startDate: user.start_date, endDate: user.end_date }) : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="End Date *"
                      type="date"
                      value={user.end_date}
                      onChange={(e) => handleUserChange("end_date", e.target.value)}
                      onBlur={() => handleBlur('end_date')}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      error={!!getFieldError('dates', '', { startDate: user.start_date, endDate: user.end_date })}
                      helperText={getFieldError('dates', '', { startDate: user.start_date, endDate: user.end_date })?.includes('End date') ? getFieldError('dates', '', { startDate: user.start_date, endDate: user.end_date }) : ''}
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
                  onBlur={() => handleBlur('business_name')}
                  size="small"
                  fullWidth
                  error={!!getFieldError('business_name', business.business_name)}
                  helperText={getFieldError('business_name', business.business_name)}
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
                      label="Address Line 1 *"
                      value={businessAddress.address_line1}
                      onChange={(e) => handleBusinessAddressChange("address_line1", e.target.value)}
                      onBlur={() => handleBlur('address_line1')}
                      size="small"
                      fullWidth
                      error={!!getFieldError('address_line1', businessAddress.address_line1)}
                      helperText={getFieldError('address_line1', businessAddress.address_line1)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Address Line 2 *"
                      value={businessAddress.address_line2}
                      onChange={(e) => handleBusinessAddressChange("address_line2", e.target.value)}
                      onBlur={() => handleBlur('address_line2')}
                      size="small"
                      fullWidth
                      error={!!getFieldError('address_line2', businessAddress.address_line2)}
                      helperText={getFieldError('address_line2', businessAddress.address_line2)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City *"
                      value={businessAddress.city}
                      onChange={(e) => handleBusinessAddressChange("city", e.target.value)}
                      onBlur={() => handleBlur('city')}
                      size="small"
                      fullWidth
                      error={!!getFieldError('city', businessAddress.city)}
                      helperText={getFieldError('city', businessAddress.city)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="State *"
                      value={businessAddress.state}
                      onChange={(e) => handleBusinessAddressChange("state", e.target.value)}
                      onBlur={() => handleBlur('state')}
                      size="small"
                      fullWidth
                      error={!!getFieldError('state', businessAddress.state)}
                      helperText={getFieldError('state', businessAddress.state)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Pincode *"
                      value={businessAddress.pincode}
                      onChange={(e) => handleBusinessAddressChange("pincode", e.target.value)}
                      onBlur={() => handleBlur('pincode')}
                      size="small"
                      fullWidth
                      error={!!getFieldError('pincode', businessAddress.pincode)}
                      helperText={getFieldError('pincode', businessAddress.pincode)}
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