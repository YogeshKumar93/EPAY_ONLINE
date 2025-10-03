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
import CommonMpinModal from "../components/common/CommonMpinModal";
import { useToast } from "../utils/ToastContext";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
const AddLein = ({ open, handleClose, onFetchRef, selectedRow, type }) => {
  console.log("THe selected row is", type);
  const [formData, setFormData] = useState({
    given_txn_id: selectedRow?.txn_id || "",
    user_id:
      type === "transaction"
        ? selectedRow?.user_id || ""
        : selectedRow?.id || "",
    amount: "",
    remark: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (!selectedRow) return;

    setFormData((prev) => ({
      ...prev,
      user_id:
        type === "transaction"
          ? selectedRow?.user_id || "" // ✅ transaction me user_id aayega
          : selectedRow?.id || "", // ✅ normal me id aayega
      given_txn_id:
        type === "transaction" ? selectedRow?.txn_id || "" : prev.given_txn_id,
    }));
  }, [selectedRow, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // reset error on change
  };

  // ✅ Validate required fields
  const validate = () => {
    const newErrors = {};

    if (type === "transaction" && !formData.given_txn_id) {
      newErrors.given_txn_id = "Txn ID is required";
    }

    if (type !== "transaction" && !formData.user_id) {
      newErrors.user_id = "User ID is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (mpin) => {
    if (!validate()) return;

    setSubmitting(true);

    // Conditional payload
    const dataToSend =
      type === "transaction"
        ? {
            given_txn_id: formData.given_txn_id,
            user_id: formData.user_id, // ✅ ab yeh sahi aayega
            amount: formData.amount,
            mpin,
            remark: formData.remark,
          }
        : {
            user_id: formData.user_id,
            amount: formData.amount,
            mpin,
            remark: formData.remark,
          };

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
          {type == "transaction" && (
            <TextField
              label="Txn ID"
              name="txn_id"
              value={formData.given_txn_id}
              onChange={handleChange}
              error={!!errors.given_txn_id}
              helperText={errors.given_txn_id}
              fullWidth
            />
          )}
          {type !== "transaction" && (
            <TextField
              label="User ID"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              error={!!errors.user_id}
              helperText={errors.user_id}
              fullWidth
            />
          )}
          <TextField
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount}
            fullWidth
          />
          <TextField
            label="Remark"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.remark}
            fullWidth
          />
        </Box>
        <Box
          sx={{
            mt: 1,
          }}
        >
          <Button
            onClick={handleClose}
            disabled={submitting}
            variant="outlined"
          >
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
        </Box>
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
