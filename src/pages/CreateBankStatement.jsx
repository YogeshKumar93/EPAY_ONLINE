import React, { useEffect, useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

const CreateBankStatement = ({ onFetchRef, bankId, balance }) => {
  const { schema, errors, loading } =
    useSchemaForm(ApiEndpoints.GET_BANK_STATEMENT_SCHEMA, true);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({});

  // Set default values when bankId or balance changes
  useEffect(() => {
    if (bankId) {
      setFormData((prev) => ({
        ...prev,
        bank_id: bankId,
        balance: balance || 0,
        date: new Date().toISOString().split("T")[0], // default today in YYYY-MM-DD
      }));
    }
  }, [bankId, balance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.CREATE_BANK_STATEMENT,
      formData
    );

    if (response) {
      showToast(response?.message || "Statement Created", "success");
      onFetchRef?.();
    } else {
      showToast(error?.message || "Failed to create Statement", "error");
    }
    setSubmitting(false);
  };

  // Only show required fields from schema
  const requiredFields = [
    "mop",
    "credit",
    "status",
    "date",
    "debit",
    "balance",
    "particulars",
  ];
  const visibleFields = schema.filter((f) =>
    requiredFields.includes(f.name)
  );

  return (
    <Box sx={{  }}>
       

      <Grid container spacing={2}>
        {visibleFields.map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
           <TextField
  select={field.type === "dropdown"} // handle dropdown dynamically
  label={field.label || field.name}
  name={field.name}
  value={formData[field.name] || ""}
  onChange={handleChange}
  size="small"
  error={Boolean(errors[field.name])}
  helperText={errors[field.name]}
  disabled={field.name === "balance"} // only disable balance
  type={
    field.type === "date"
      ? "date"
      : field.type === "number"
      ? "number"
      : "text"
  } // handle type
  sx={{ width: 200 }} // fixed width in px, adjust as needed
>
  {field.type === "dropdown" &&
    field.options?.map((opt) => (
      <MenuItem key={opt} value={opt}>
        {opt}
      </MenuItem>
    ))}
</TextField>

          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={submitting || loading}
        sx={{ mt: 2 }}
      >
        {submitting ? "Submitting..." : "Create Statement"}
      </Button>
    </Box>
  );
};

export default CreateBankStatement;
