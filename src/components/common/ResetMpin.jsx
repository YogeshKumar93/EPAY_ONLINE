import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import CommonModal from "./CommonModal";
import { apiCall } from "../../api/apiClient";

const ResetMpin = ({ open, onClose, username }) => {
  const [loading, setLoading] = React.useState(false);

  const handleMpin = async () => {
    setLoading(true);
    try {
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.RESET_MPIN,
        { username }
      );

      if (response) {
        okSuccessToast(
          response.message || "MPIN reset instructions sent successfully"
        );
        onClose();
      } else {
        apiErrorToast(error?.message || error || "Something went wrong");
      }
    } catch (err) {
      apiErrorToast("Failed to reset MPIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      title="Reset MPIN"
      open={open}
      onClose={onClose}
      showCloseButton
      footerButtons={[]} // using custom footer inside
      dividers={false}
      size="small"
      iconType="help"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: 3,
          gap: 3,
        }}
      >
        {/* Info text */}
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          We’ll send reset instructions to your registered contact.
        </Typography>

        {/* Username field */}
        <TextField
          fullWidth
          variant="outlined"
          label="Registered Mobile/Email"
          value={username}
          InputProps={{ readOnly: true }}
          sx={{
            "& .MuiInputLabel-root": {
              "&.Mui-focused": { color: "#FF6B6B" },
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& fieldset": {
                borderColor: "rgba(0, 0, 0, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "#FF6B6B",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#FF6B6B",
                borderWidth: "2px",
              },
            },
          }}
        />

        {/* Button */}
        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          onClick={handleMpin}
          sx={{
            py: 1.5,
            backgroundColor: "#6c4bc7",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "16px",
            mt: 1,
            "&:hover": {
              backgroundColor: "#D43F3F",
              boxShadow: "0 4px 12px rgba(212, 63, 63, 0.3)",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(255, 107, 107, 0.5)",
              color: "rgba(255, 255, 255, 0.7)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Send Reset Instructions"
          )}
        </Button>
      </Box>
    </CommonModal>
  );
};


export default ResetMpin;
