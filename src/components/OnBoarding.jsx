import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  Person,
  Edit,
  Email,
  Smartphone,
  AccountCircle,
  CheckCircle,
} from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { useSchemaForm } from "../hooks/useSchemaForm";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { useToast } from "../utils/ToastContext";
import CommonFormField from "./common/CommonFormField";

const OnBoarding = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const username = `P2PAE${user?.id}`;
  const { showToast } = useToast();

  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) setSuccessMessage("Profile updated successfully!");
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  // KYC Form (Business Info)
  const kyc = useSchemaForm(ApiEndpoints.KYC_SCHEMA, true);

  const handleSubmitKYC = async () => {
    if (!kyc.schema || !kyc.schema.length) {
      showToast("Schema not loaded yet", "error");
      return;
    }

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_KYC,
        {
          ...kyc.formData,
          status: 2,
        }
      );

      if (response) {
        showToast(response?.message || "KYC saved successfully", "success");
        authCtx.loadUserProfile();
        showToast("🎉 Business information completed!", "success");
      } else {
        showToast(error?.message || "Failed to save KYC", "error");
      }
    } catch (err) {
      console.error("Error saving KYC:", err);
      showToast("Something went wrong while saving", "error");
    } finally {
      setSubmitting(false);
    }
  };
  // Define the required image fields for KYC
  const requiredImages = [
    "aadhaar_front",
    "aadhaar_back",
    "shop_image",
    "pan_card",
    "photo",
  ];

  // Check if all required images are uploaded
  const allImagesUploaded = requiredImages.every(
    (key) => kyc.formData[key] && kyc.formData[key] !== ""
  );
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflowY: "auto",
        background: "linear-gradient(135deg, #f9f5ff 0%, #f0e8ff 100%)",
        display: "flex",
        flexDirection: "column",
        p: { xs: 2, sm: 4 },
      }}
    >
      {/* Profile Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          mb: 4,
          gap: 3,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            sx={{
              width: { xs: 100, sm: 120, md: 140 },
              height: { xs: 100, sm: 120, md: 140 },
              border: "4px solid rgba(0,0,0,0.2)",
              bgcolor: "rgba(0,0,0,0.05)",
            }}
          >
            <Person sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />
          </Avatar>
          <IconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "gold",
              "&:hover": { transform: "scale(1.1)" },
            }}
            onClick={handleEditToggle}
          >
            <Edit sx={{ fontSize: 16, color: "#1E3A8A" }} />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
          {isEditing ? (
            <TextField
              value={editedUser.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
              fullWidth
            />
          ) : (
            <Typography variant="h4" fontWeight="bold">
              {user?.name}
            </Typography>
          )}
          <Chip
            icon={<AccountCircle />}
            label="Active User"
            size="small"
            sx={{ mt: 1 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 1 }}>
            <Email />
            {isEditing ? (
              <TextField
                value={editedUser.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                variant="outlined"
                size="small"
              />
            ) : (
              <Typography>{user?.email}</Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
            <Smartphone />
            {isEditing ? (
              <TextField
                value={editedUser.mobile || ""}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                variant="outlined"
                size="small"
              />
            ) : (
              <Typography>{user?.mobile}</Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
            <Typography>Username:</Typography>
            <Typography fontWeight="bold">{username}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Success Message */}
      {successMessage && (
        <Box
          sx={{
            p: 2,
            mb: 3,
            background: "linear-gradient(90deg, #4caf50, #81c784, #66bb6a)",
            color: "white",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <CheckCircle />
          <Typography>{successMessage}</Typography>
        </Box>
      )}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#6B21A8",
            textAlign: "center",
            mb: 1,
          }}
        >
          📂 Please upload the required documents to move further.
        </Typography>
      </Box>

      {/* Business Information Form - Full Height */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          background: "white",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        {kyc.loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {kyc.schema.map((field, i) => (
              <CommonFormField
                key={i}
                field={field}
                formData={kyc.formData}
                handleChange={kyc.handleChange}
                errors={kyc.errors}
                loading={kyc.loading}
              />
            ))}

            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitKYC}
                disabled={submitting || kyc.loading || !allImagesUploaded}
              >
                {submitting ? "Saving..." : "Save Business Info"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OnBoarding;
