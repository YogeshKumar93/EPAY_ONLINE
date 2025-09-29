import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import CommonMpinModal from "../common/CommonMpinModal";
import { useToast } from "../../utils/ToastContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../common/CommonModal";
const AddLein = ({ open, handleClose, onFetchRef, user }) => {
  const [formData, setFormData] = useState({
    txn_id: "",
    user_id: user?.id || "",
    amount: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);

  const { showToast } = useToast();

  // Update user_id if user changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, user_id: user?.id || "" }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // reset error on change
  };

  // ✅ Validate required fields
  const validate = () => {
    const newErrors = {};
    if (!formData.txn_id) newErrors.txn_id = "Txn ID is required";
    if (!formData.user_id) newErrors.user_id = "User ID is required";
    if (!formData.amount) newErrors.amount = "Amount is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle submit after MPIN
  const handleSubmit = async (mpin) => {
    if (!validate()) return;

    setSubmitting(true);

    const dataToSend = { ...formData, mpin };
    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.ADD_LEIN,
      dataToSend
    );

    if (response) {
      showToast(
        response?.message || "Lein Amount added successfully",
        "success"
      );
      onFetchRef?.();
      handleClose();
    } else {
      showToast(error?.message || "Failed to add Lein Amount", "error");
    }

    setSubmitting(false);
  };

  return (
    <>
      <CommonModal
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        footerButtons={[]}
        title="Add Lein Amount"
      >
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Txn ID"
            name="txn_id"
            value={formData.txn_id}
            onChange={handleChange}
            error={!!errors.txn_id}
            helperText={errors.txn_id}
            fullWidth
          />
          <TextField
            label="User ID"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            error={!!errors.user_id}
            helperText={errors.user_id}
            fullWidth
          />
          <TextField
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount}
            fullWidth
          />
        </Box>

        <Button onClick={handleClose} disabled={submitting} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => setMpinModalOpen(true)}
          disabled={submitting}
          variant="contained"
          color="primary"
          startIcon={submitting && <CircularProgress size={16} />}
        >
          {submitting ? "Saving..." : "Save"}
        </Button>
      </CommonModal>

      {/* MPIN modal */}
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Enter MPIN to Confirm"
        mPinCallBack={handleSubmit} // MPIN will be passed here
      />
    </>
  );
};

export default AddLein;
