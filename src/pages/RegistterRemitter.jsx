// RemitterRegister.js
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";

const RegistterRemitter = ({ mobile, onSuccess }) => {
  const [name, setName] = useState("");

  const handleRegister = async () => {
    if (!name) return apiErrorToast("Name is required");

    const { error, response } = await apiCall("post", ApiEndpoints.DMT1_REGISTER, {
      mobile_number: mobile,
      name,
    });

    if (response) {
      okSuccessToast("Remitter registered successfully");
      onSuccess(response.data); // pass new remitter back to parent
    } else {
      apiErrorToast(error?.message || "Registration failed");
    }
  };

  return (
    <Box p={3} border="1px solid #ccc" borderRadius={2}>
      <Typography variant="h6" mb={2}>Register Remitter</Typography>
      <TextField
        label="Full Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleRegister}>Register</Button>
    </Box>
  );
};

export default RegistterRemitter;
