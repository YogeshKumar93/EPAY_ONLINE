import React, { useEffect, useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";

const CreateAccountStatement = ({  handleClose,onFetchRef,accountId }) => {
  const { schema, errors,  loading } =
    useSchemaForm(ApiEndpoints.GET_ACCOUNT_STATEMENT_SCHEMA, true);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
   const [formData, setFormData] = useState({});

  // ✅ Submit
  const handleSubmit = async () => {

    setSubmitting(true);
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_ACCOUNT_STATEMENT,
        formData
      );

      if (response) {
        showToast(
          response?.message || "Account Statement Created successfully",
          "success"
        );
        onFetchRef();
        handleClose();
      } else {
        showToast(error?.message || "Failed to create Account Statement", "error");
        handleClose();
      }

  };

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  useEffect(() => {
    if (accountId) {
      setFormData((prev) => ({
        ...prev,
        account_id: accountId,
        // balance: balance || 0,
      }));
    }
  }, [accountId]);


  // ✅ Required fields
  const requiredFields = [
    
    "account_id",
    "remarks",
    "bank_id",
    "credit",
    "debit",
    "balance",
    "particulars"

  
  ];

  // ✅ Pick only required fields from schema
  let visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );

  return (
 <Box sx={{  }}>
      

     <Grid container spacing={2}>
  {visibleFields.map((field) => (
    <Grid item xs={12} sm={6} md={4} key={field.name}>
      <TextField
        select={field.type === "select"} // handle select dynamically
        label={field.label || field.name}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
        sx={{width:200}}
        size="small"
        error={Boolean(errors[field.name])}
        helperText={errors[field.name]}
        disabled={field.name === "account_id"}  
      >
        {field.type === "select" &&
          field.options?.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
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

    // <CommonModal
    //   open={open}
    //   onClose={handleClose}
    //   title="Create Account Statement"
    //   iconType="info"
    //   size="medium"
    //   layout="two-column"
    //   dividers
    //   fieldConfig={visibleFields}
    //   formData={formData}
    //   handleChange={handleChange}
    //   errors={errors}
    //   loading={loading || submitting}
    //   footerButtons={[
    //     {
    //       text: "Cancel",
    //       variant: "outlined",
    //       onClick: handleClose,
    //       disabled: submitting,
    //     },
    //     {
    //       text: submitting ? "Saving..." : "Save",
    //       variant: "contained",
    //       color: "primary",
    //       onClick: handleSubmit,
    //       disabled: submitting,
    //     },
    //   ]}
    // />
  );
};

export default CreateAccountStatement;
