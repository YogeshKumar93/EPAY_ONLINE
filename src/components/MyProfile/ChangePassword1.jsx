// src/components/common/ChangePassword.jsx
import React, { useContext, useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthContext from "../../contexts/AuthContext";
import { PATTERNS } from "../../utils/validators";
import ApiEndpoints from "../../api/ApiEndpoints";
import { okSuccessToast } from "../../utils/ToastUtil";
import CommonModal from "./CommonModal";
import { apiCall } from "../../api/apiClient";
import CommonMpinModal from "./CommonMpinModal";

/**
 * Props:
 * - open
 * - onClose
 * - username (current)
 * - targetUser (object) => when provided, component acts in "admin reset" mode
 * - onSuccess (callback that receives success message)
 */
const ChangePassword1 = ({ open, onClose, username, targetUser = null, onSuccess }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const [MpinCallBackVal, setMpinCallBackVal] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { logout } = useContext(AuthContext);
  const passwordRegex = PATTERNS.NEW_PASSWORD;

  useEffect(() => {
    // reset fields when modal opens/closes
    if (!open) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setMpinModalOpen(false);
      setMpinCallBackVal(false);
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [open]);

  const validateForm = () => {
    if (!targetUser) {
      // self change requires old password
      if (!oldPassword) {
        setError("Old password is required");
        return false;
      }
      if (oldPassword === newPassword) {
        setError("New password must be different from the old password");
        return false;
      }
    }

    if (!newPassword) {
      setError("New password is required");
      return false;
    } else if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must contain at least one number and one special character, and be 8-24 characters long"
      );
      return false;
    }

    if (!confirmPassword) {
      setError("Please confirm your password");
      return false;
    } else if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  const changePassword = async (mpin) => {
    try {
      // Build payload depending on mode
      let payload;
      if (targetUser) {
        // Admin resetting another user's password
        payload = {
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
          mpin: mpin * 1,
          user_id: targetUser.id ?? targetUser.user_id ?? targetUser._id ?? targetUser.uid, // defensive keys
        };
      } else {
        // Self change
        payload = {
          current_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
          mpin: mpin * 1,
        };
      }

      // Choose endpoint: prefer admin endpoint if available
      const endpoint =
        (targetUser && ApiEndpoints.ADMIN_RESET_PASS) || ApiEndpoints.CHANGE_PASS;

      const { error: apiError, response } = await apiCall("post", endpoint, payload);

      if (response) {
        okSuccessToast(response?.message || "Password changed successfully");
        if (!targetUser) {
          // logging out the user after self password change
          logout && logout();
        }
        // callback to parent to show success and close
        onSuccess && onSuccess(response?.message || "Password updated successfully");
        setMpinCallBackVal(false);
      } else if (apiError) {
        setError(apiError?.message || "Something went wrong");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // open mpin modal for verification
    setMpinModalOpen(true);
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  return (
    <>
      <CommonModal
        title={targetUser ? `Reset Password for ${targetUser?.name || targetUser?.username || targetUser?.mobile}` : "Change Password"}
        open={open}
        onClose={onClose}
        showCloseButton
        footerButtons={[]}
        dividers={false}
        size="small"
        iconType="help"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          width="100%"
          maxWidth="420px"
          mx="auto"
          mt={2}
          mb={3}
        >
          {/* Only show old password for self-change */}
          {!targetUser && (
            <TextField
              type={showOld ? "text" : "password"}
              label="Old Password"
              fullWidth
              value={oldPassword}
              onChange={handleInputChange(setOldPassword)}
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
          )}

          {/* New Password */}
          <TextField
            type={showNew ? "text" : "password"}
            label="New Password"
            fullWidth
            value={newPassword}
            onChange={handleInputChange(setNewPassword)}
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

          {/* Confirm Password */}
          <TextField
            type={showConfirm ? "text" : "password"}
            label="Confirm Password"
            fullWidth
            value={confirmPassword}
            onChange={handleInputChange(setConfirmPassword)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Error message */}
          {error && (
            <Typography color="error" fontSize="0.875rem" textAlign="center">
              {error}
            </Typography>
          )}

          {/* Submit Button */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{
              bgcolor: "#492077",
              py: 1.25,
              fontSize: "0.95rem",
              fontWeight: "bold",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { bgcolor: "#3f1b5f" },
            }}
          >
            {targetUser ? "Reset Password" : "Set New Password"}
          </Button>
        </Box>
      </CommonModal>

      {/* MPIN Verification Modal */}
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        mPinCallBack={(mPinValue) => {
          setMpinCallBackVal(mPinValue);
          changePassword(mPinValue);
        }}
        title={targetUser ? "Verify MPIN to Reset Password" : "Verify MPIN to Continue"}
      />
    </>
  );
};

export default ChangePassword1;
