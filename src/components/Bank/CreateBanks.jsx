import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
} from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../common/CommonModal";
const CreateBankModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    bank_name: "",
    acc_number: "",
    ifsc: "",
    balance: "",
  });
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiCall("post", ApiEndpoints.CREATE_BANK, form);
      setLoading(false);
      onClose(); // close modal after success
    } catch (error) {
      console.error("Error creating bank:", error);
      setLoading(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create New Bank"
      iconType="info"
      size="small"
      dividers
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: onClose,
          disabled: loading,
        },
        {
          text: loading ? "Saving..." : "Save",
          variant: "contained",
          color: "primary",
          onClick: handleSubmit,
          disabled: loading,
        },
      ]}
    >
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Bank Name"
          name="bank_name"
          fullWidth
          margin="normal"
          value={form.bank_name}
          onChange={handleChange}
        />
        <TextField
          label="Account Number"
          name="acc_number"
          fullWidth
          margin="normal"
          value={form.acc_number}
          onChange={handleChange}
        />
        <TextField
          label="IFSC Code"
          name="ifsc"
          fullWidth
          margin="normal"
          value={form.ifsc}
          onChange={handleChange}
        />
        <TextField
          label="Balance"
          name="balance"
          fullWidth
          margin="normal"
          value={form.balance}
          onChange={handleChange}
        />
      </Box>
    </CommonModal>
  );
};

export default CreateBankModal;
