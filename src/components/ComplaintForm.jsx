import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "./common/CommonModal";
const ComplaintForm = ({ txnId, onSuccess, open, onClose, type }) => {
  console.log("THe tan ind ",txnId.id)
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "",
    text: "",
  });

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!txnId) {
      setSnackbar({
        open: true,
        type: "error",
        text: "Invalid transaction selected",
      });
      return;
    }
    if (!message.trim()) {
      setSnackbar({
        open: true,
        type: "error",
        text: "Complaint message is required",
      });
      return;
    }

    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_COMPLAINTS, // 🔄 endpoint
        { id: txnId.id, message, type: type,txn_id:txnId.txn_id }
      );

      if (response) {
        setSnackbar({
          open: true,
          type: "success",
          text: response?.message || "Complaint created successfully",
        });
        setMessage("");
        if (onSuccess) onSuccess(response.data);
      } else {
        setSnackbar({
          open: true,
          type: "error",
          text: error?.message || "Failed to create complaint",
        });
      }
    } catch (err) {
      console.error("Error creating complaint:", err);
      setSnackbar({
        open: true,
        type: "error",
        text: "Something went wrong while creating complaint",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal open={open} onClose={onClose}>
   <Box
  component="form"
  onSubmit={handleSubmit}
  sx={{
    p: 3,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    maxWidth: 700, // increase width to fit two fields side by side
  }}
>
  <Typography variant="h6">Raise a Complaint</Typography>

  {/* Row with fields side by side */}
  <Box sx={{ display: "flex", gap: 2 }}>
    <TextField
      label="Transaction ID"
      value={txnId.id || ""}
      InputProps={{ readOnly: true }}
      variant="outlined"
      sx={{ flex: 1 }} // take equal space
    />

    <TextField
      label="Complaint Message"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      required
      multiline
      rows={3}
      placeholder="Enter your complaint details..."
      variant="outlined"
      sx={{ flex: 2 }} // optional: make this field wider
    />
  </Box>

  {/* Submit button */}
  <Button
    type="submit"
    variant="contained"
    color="primary"
    disabled={loading}
  >
    {loading ? <CircularProgress size={24} /> : "Submit Complaint"}
  </Button>

  {/* Snackbar */}
  <Snackbar
    open={snackbar.open}
    autoHideDuration={4000}
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
  >
    <Alert
      severity={snackbar.type || "info"}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
    >
      {snackbar.text}
    </Alert>
  </Snackbar>
</Box>

    </CommonModal>
  );
};

export default ComplaintForm;
