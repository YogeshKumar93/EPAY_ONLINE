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
import AuthContext from "../../contexts/AuthContext";
import { PATTERNS } from "../../utils/validators";
import ApiEndpoints from "../../api/ApiEndpoints";
import { okSuccessToast } from "../../utils/ToastUtil";
import CommonModal from "./CommonModal";
import { apiCall } from "../../api/apiClient";
import CommonMpinModal from "./CommonMpinModal";

const ChangePassword = ({ open, onClose, username }) => {
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

  const validateForm = () => {
    if (!oldPassword) {
      setError("Old password is required");
      return false;
    }

    if (!newPassword) {
      setError("New password is required");
      return false;
    } else if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must contain at least one number and one special character, and be 8-24 characters long"
      );
      return false;
    } else if (oldPassword === newPassword) {
      setError("New password must be different from the old password");
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
    const payload = {
      current_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
      mpin: mpin * 1, // ensure number
    };

    try {
      const { error: apiError, response } = await apiCall(
        "post",
        ApiEndpoints.CHANGE_PASS,
        payload
      );

      if (response) {
        okSuccessToast(response?.message || "Password changed successfully");
        logout();
        onClose();
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

    setMpinModalOpen(true);
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  return (
    <>
      <CommonModal
        title="Change Password"
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
          maxWidth="400px"
          mx="auto"
          mt={2}
          mb={3}
        >
          {/* Old Password */}
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

          {/* Error message */}
          {error && (
            <Typography color="error" fontSize="0.8rem" textAlign="center">
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
              py: 1.5,
              fontSize: "15px",
              fontWeight: "bold",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { bgcolor: "rgb(72, 176, 77)" },
            }}
          >
            Set New Password
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
        title="Verify MPIN to Continue"
      />
    </>
  );
};
export default ChangePassword;
