import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import CommonModal from "./common/CommonModal";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { useToast } from "../utils/ToastContext";

const CreatePurpose = ({ open, onClose, onFetchRef }) => {
  const [form, setForm] = useState({ type: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  // ✅ Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!form.type || form.type.trim() === "") {
      newErrors.type = "Type is required";
    } else if (form.type.length > 50) {
      newErrors.type = "Type cannot exceed 50 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return; // stop if validation fails

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_PURPOSE,
        form
      );

      if (response) {
        showToast(response?.message || "Purpose created successfully", "success");
        onFetchRef();
        onClose();
        setForm({ type: "" }); // reset form
      } else {
        showToast(error?.message || "Failed to create Purpose", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create Purpose"
      iconType="info"
      footerButtons={[
        { text: "Cancel", variant: "outlined", onClick: onClose, disabled: submitting },
        { text: submitting ? "Saving..." : "Create", variant: "contained", onClick: handleCreate, disabled: submitting },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.type}
          helperText={errors.type}
          inputProps={{ maxLength: 50 }} // prevent user from typing more than 50
        />
      </Box>
    </CommonModal>
  );
};

export default CreatePurpose;
