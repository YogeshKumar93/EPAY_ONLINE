import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";



import CommonModal from "./common/CommonModal";
import AuthContext from "../contexts/AuthContext";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";

const UpdateComplaint = ({ open, onClose, complaintId, onSuccess }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
  const validateForm = () => {
    if (!remarks.trim()) {
      showToast("Please enter remarks", "error");
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        id: complaintId,   // ✅ complaint row id
        remark: remarks,   // ✅ remarks from form
        handler: user?.id , // ✅ logged-in user id
        status:status
      };

      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_COMPLAINTS,
        payload
      );

      if (response) {
        showToast(response?.message || "Complaint updated successfully", "success");
        onSuccess?.(); // refresh list
        onClose();     // close modal
      } else {
        showToast(error?.message || "Failed to update complaint", "error");
      }
    } catch (err) {
      console.error("Error updating complaint:", err);
      showToast("Something went wrong while updating complaint", "error");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <CommonModal open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <TextField
        label="Remarks"
        fullWidth
        multiline
        minRows={3}
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        disabled={loading}
        margin="dense"
      />
      <TextField
        label="Status"
        fullWidth
        multiline
        minRows={3}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={loading}
        margin="dense"
      />
      <Button onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </Button>
    </CommonModal>
  );
};

export default UpdateComplaint;
