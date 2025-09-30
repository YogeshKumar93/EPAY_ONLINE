import React, { useState } from "react";
import { Box, Modal, Typography, IconButton, Button } from "@mui/material";
import OtpInput from "react-otp-input";
import { CheckCircle } from "@mui/icons-material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";
import { useContext } from "react";
import ResetMpin from "../components/common/ResetMpin";

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
  actionTarget,
}) => {
  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { showToast } = useToast();
  const [resetMpinModalOpen, setResetMpinModalOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const username = `TRANS${authCtx?.user?.id}`;

  const handleClose = () => {
    setOpen(false);
    setMpin("");
    setErr("");
  };

  const handleApiCall = async () => {
    if (mpin.length !== 6) {
      setErr("Please enter a valid 6-digit MPIN");
      return;
    }

    try {
      setLoading(true);

      let payload = { id: serviceId, mpin: mpin };

      // Set the correct field based on type and action
      const is_active_value = actionType === "unblock" ? 1 : 0;

      if (actionTarget === "service") payload.is_active = is_active_value;
      if (actionTarget === "api") payload.is_active_api = is_active_value;
      if (actionTarget === "users") payload.is_active_users = is_active_value;

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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: "11px" }}
            onClick={() => setResetMpinModalOpen(true)}
          >
            Reset MPIN
          </Button>
        </Box>
        {resetMpinModalOpen && (
          <ResetMpin
            open={resetMpinModalOpen}
            onClose={() => setResetMpinModalOpen(false)}
            username={username}
          />
        )}

        {err && (
          <Typography variant="body2" color="error" mt={2}>
            {err}
          </Typography>
        )}

        {/* Icon Button
        <IconButton
          color="primary"
          onClick={handleApiCall}
          disabled={loading}
          sx={{ mt: 3 }}
        >
          <CheckCircle sx={{ fontSize: 40 }} />
        </IconButton> */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleApiCall}
          disabled={loading}
          sx={{ mt: 3, width: "100%" }}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Modal>
  );
};

export default BlockUnblockService;
