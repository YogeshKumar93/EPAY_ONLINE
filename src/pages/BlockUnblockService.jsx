import React, { useState } from "react";
import { Box, Modal, Typography, IconButton } from "@mui/material";
import OtpInput from "react-otp-input";
import { CheckCircle } from "@mui/icons-material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useToast } from "../utils/ToastContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const BlockUnblockService = ({
  open,
  setOpen,
  serviceId,
  actionType,
  onSuccess,
}) => {
  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { showToast } = useToast();

  const handleClose = () => {
    setOpen(false);
    setMpin("");
    setErr("");
  };

  // API call on button click
  const handleApiCall = async () => {
    if (mpin.length !== 6) {
      setErr("Please enter a valid 6-digit MPIN");
      return;
    }

    try {
      setLoading(true);

      const is_active = actionType === "unblock" ? 1 : 0;

      const payload = {
        id: serviceId,
        is_active: is_active,
        mpin: mpin,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.BLOCK_UNBLOCK_SERVICE,
        payload
      );

      if (response) {
        handleClose();
        okSuccessToast(response?.message);
        onSuccess();
      } else {
        showToast(error.message || "Something went wrong", "error");
      }
    } catch (error) {
      apiErrorToast("API Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={1}>
          {actionType === "block" ? "Block Service" : "Unblock Service"}
        </Typography>

        {/* Instruction Text */}
        <Typography variant="body2" color="textSecondary" mb={2}>
          Please enter your 6-digit MPIN to continue
        </Typography>

        {/* MPIN Input Fields */}
        <OtpInput
          value={mpin}
          onChange={setMpin}
          numInputs={6}
          isInputSecure={true}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            width: "40px",
            height: "40px",
            margin: "0 5px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "2px solid #ccc",
            textAlign: "center",
          }}
          focusStyle={{
            border: "2px solid #1976d2",
          }}
        />

        {err && (
          <Typography variant="body2" color="error" mt={2}>
            {err}
          </Typography>
        )}

        {/* Icon Button */}
        <IconButton
          color="primary"
          onClick={handleApiCall}
          disabled={loading}
          sx={{ mt: 3 }}
        >
          <CheckCircle sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default BlockUnblockService;
