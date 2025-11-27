import React, { useState } from "react";
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
  Grid,
  Card,
  CardContent,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import { okSuccessToast } from "../../utils/ToastUtil";

const CreateUser = ({ open, onClose, onFetchRef }) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // ROLE — Only adm & sadm
  const [role, setRole] = useState("sadm");
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

  // Generic change handlers
  const handleUserChange = (field, value) =>
    setUser((prev) => ({ ...prev, [field]: value }));

  const handleBusinessChange = (field, value) =>
    setBusiness((prev) => ({ ...prev, [field]: value }));

  const handleBusinessAddressChange = (field, value) =>
    setBusinessAddress((prev) => ({ ...prev, [field]: value }));

  // VALIDATION
  const validate = () => {
    const errors = [];

    if (!user.name.trim()) errors.push("User name is required");
    if (!user.email.trim()) errors.push("User email is required");
    if (!user.mobile.trim()) errors.push("User mobile is required");
    if (!user.start_date) errors.push("User start date is required");
    if (!user.end_date) errors.push("User end date is required");

    if (!business.business_name.trim())
      errors.push("Business name is required");
    if (!businessAddress.state.trim()) errors.push("Business state is required");
    if (!businessAddress.pincode.trim())
      errors.push("Business pincode is required");

    return errors;
  };

  // STEP HANDLERS
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
    if (!business.business_name.trim()) stepErrors.push("Business name is required");
    if (!businessAddress.state.trim()) stepErrors.push("Business state is required");
    if (!businessAddress.pincode.trim()) stepErrors.push("Business pincode is required");
  }

  if (stepErrors.length > 0) {
    stepErrors.forEach((msg) => showToast("Please fill all details first", "error"));
    return;
  }

  setActiveStep((prev) => prev + 1);
};


  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // SUBMIT
  const handleSubmit = async () => {
    const errors = validate();
    if (errors.length > 0) {
      errors.forEach((e) => showToast(e, "error"));
      return;
    }

    const payload = {
      role,
      user: {
        ...user,
        status: user.status ? 1 : 0, // convert boolean to number
      },
      business,
      business_address: businessAddress,
    };

    console.log("📌 Final Payload →", payload);

    setSubmitting(true);

    try {
      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_USER,
        payload
      );

      if (response) {
        okSuccessToast(response?.message || "User created successfully");
        onFetchRef?.();
        onClose();
        setActiveStep(0); // Reset step on success
      } else {
        // Handle backend validation errors
        if (error?.message && typeof error.message === "object") {
          Object.values(error.message).forEach((msgs) => {
            if (Array.isArray(msgs)) msgs.forEach((m) => showToast(m, "error"));
            else showToast(String(msgs), "error");
          });
        } else {
          showToast(error?.message || "Failed to create user", "error");
        }
      }
    } catch (err) {
      console.error("❌ Error creating user:", err);
      showToast("Something went wrong while creating user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ['Role & Basic Info', 'User Details', 'Business Details'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
          </Box>
        );

     case 1:
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      
      {/* ------------ PERSONAL INFORMATION ------------ */}
      <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <span style={{ fontSize: '1.25rem' }}>📝</span>
            Personal Information
          </Typography>

          <Grid container spacing={2}>
            {/* Full Name - Single Row */}
            <Grid item xs={12}>
              <TextField
                label="Full Name *"
                value={user.name}
                onChange={(e) => handleUserChange("name", e.target.value)}
                size="small"
                fullWidth
              />
            </Grid>

            {/* Email + Mobile */}
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

            {/* PAN + GST */}
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

      {/* ------------ ACCOUNT PERIOD ------------ */}
      <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
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
      <DialogTitle sx={{ pb: 1, borderBottom: 1, borderColor: '#blue', backgroundColor:"#f3ebebff" }}>
        <Typography variant="h5" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.5rem' }}>👥</span>
          Create New User
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mt: 1 }}>
          Fill in the user details step by step
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt:2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Box>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={submitting}  sx={{backgroundColor:"#9180a2ff", color:"#fff"}}>
              Back
            </Button>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} disabled={submitting} color="inherit" sx={{backgroundColor:"#9180a2ff", color:"#fff"}}>
            Cancel
          </Button>
          
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} sx={{backgroundColor:"#492077"}}>
              Next
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create User"}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUser;