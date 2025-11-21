import React, { useContext, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ApiEndpoints from "../../api/ApiEndpoints";
import { okSuccessToast } from "../../utils/ToastUtil";
import AuthContext from "../../contexts/AuthContext";
import CommonModal from "./CommonModal";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";
const ChangeMpin = ({ open, onClose }) => {
  const [oldMpin, setOldMpin] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { logout } = useContext(AuthContext);
  const { showToast } = useToast();
  const handleSubmit = async () => {
    // 🔹 Validations
    if (!oldMpin || !newMpin || !confirmMpin) {
      showToast("All fields are required", "error");
      return;
    }
    if (
      oldMpin.length !== 6 ||
      newMpin.length !== 6 ||
      confirmMpin.length !== 6
    ) {
      showToast("All MPINs must be exactly 6 digits", "error");
      return;
    }
    if (oldMpin === newMpin) {
      showToast("New MPIN cannot be the same as Old MPIN", "error");
      return;
    }
    if (newMpin !== confirmMpin) {
      showToast("New MPIN and Confirm MPIN do not match", "error");
      return;
    }

    const payload = {
      current_mpin: oldMpin,
      new_mpin: newMpin,
      new_mpin_confirmation: confirmMpin,
    };

    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.CHANGE_MPIN,
      payload
    );

    if (response) {
      okSuccessToast(response?.message || "MPIN changed successfully");
      logout();
      setOldMpin("");
      setNewMpin("");
      setConfirmMpin("");
      onClose(); // ✅ close modal after success
    }
    if (error) {
      showToast(error?.message || "Something went wrong", "error");
      console.error(error);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Change MPIN"
      iconType="help"
      showCloseButton
      footerButtons={[]} // ❌ remove default Cancel/Confirm buttons
      size="small"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        width="100%"
        maxWidth="350px"
        mx="auto"
      >
        {/* Old MPIN */}
        <TextField
          type={showOld ? "text" : "password"}
          label="Old MPIN"
          fullWidth
          value={oldMpin}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,6}$/.test(value)) setOldMpin(value);
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowOld(!showOld)} edge="end">
                  {showOld ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* New MPIN */}
        <TextField
          type={showNew ? "text" : "password"}
          label="New MPIN"
          fullWidth
          value={newMpin}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,6}$/.test(value)) setNewMpin(value);
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                  {showNew ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm MPIN */}
        <TextField
          type={showConfirm ? "text" : "password"}
          label="Confirm New MPIN"
          fullWidth
          value={confirmMpin}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,6}$/.test(value)) setConfirmMpin(value);
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirm(!showConfirm)}
                  edge="end"
                >
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Submit */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            bgcolor: "#492077",
            py: 1.25,
            fontWeight: "bold",
            borderRadius: 2,
            "&:hover": { bgcolor: "#d45552" },
          }}
        >
          Confirm New MPIN
        </Button>
      </Box>
    </CommonModal>
  );
};

export default ChangeMpin;
