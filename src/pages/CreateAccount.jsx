import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

const accountTypes = ["Current", "Savings", "Credit"];

const CreateAccount = ({ open, handleClose, handleSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    user_id: "",
    establishment: "",
    mobile: "",
    type: "",
    asm: "",
    credit_limit: "",
    balance: "",
    status: "1",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.user_id) newErrors.user_id = "User ID is required";
    if (!formData.establishment.trim())
      newErrors.establishment = "Establishment is required";
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!formData.type) newErrors.type = "Account type is required";
    if (formData.credit_limit < 0)
      newErrors.credit_limit = "Credit limit cannot be negative";
    if (formData.balance < 0)
      newErrors.balance = "Balance cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    if (validate()) {
      handleSave(formData);
      handleClose();
      setFormData({
        name: "",
        user_id: "",
        establishment: "",
        mobile: "",
        type: "",
        asm: "",
        credit_limit: "",
        balance: "",
        status: "1",
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Account</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="User ID"
              name="user_id"
              type="number"
              fullWidth
              value={formData.user_id}
              onChange={handleChange}
              error={!!errors.user_id}
              helperText={errors.user_id}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Establishment"
              name="establishment"
              fullWidth
              value={formData.establishment}
              onChange={handleChange}
              error={!!errors.establishment}
              helperText={errors.establishment}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Mobile"
              name="mobile"
              fullWidth
              value={formData.mobile}
              onChange={handleChange}
              error={!!errors.mobile}
              helperText={errors.mobile}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Type"
              name="type"
              fullWidth
              value={formData.type}
              onChange={handleChange}
              error={!!errors.type}
              helperText={errors.type}
            >
              {accountTypes.map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="ASM"
              name="asm"
              fullWidth
              value={formData.asm}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Credit Limit"
              name="credit_limit"
              type="number"
              fullWidth
              value={formData.credit_limit}
              onChange={handleChange}
              error={!!errors.credit_limit}
              helperText={errors.credit_limit}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Balance"
              name="balance"
              type="number"
              fullWidth
              value={formData.balance}
              onChange={handleChange}
              error={!!errors.balance}
              helperText={errors.balance}
            />
          </Grid>
        </Grid>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          * Status will be set to Active (1) by default
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit} sx={{ bgcolor: "#1CA895" }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAccount;
