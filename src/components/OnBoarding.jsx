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
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";

const OnBoarding = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const username = `TRANS${user?.id}`;
  const { showToast } = useToast();
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    aadhaar_front: null,
    aadhaar_back: null,
    pan_card: null,
    shop_image: null,
    photo: null,
  });
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) setSuccessMessage("Profile updated successfully!");
    setIsEditing(!isEditing);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, [name]: file }));

    // generate preview
    const previewURL = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [name]: previewURL }));
  };

  const handleSubmitKYC = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      for (const key in formData) {
        const value = formData[key];
        if (value instanceof File || value instanceof Blob) {
          fd.append(key, value);
        } else {
          fd.append(key, value ?? "");
        }
      }
      fd.append("status", 2);

      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_KYC,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response) {
        showToast(
          response?.message || "KYC submitted successfully!",
          "success"
        );
        authCtx.loadUserProfile();
      } else {
        showToast(error?.message || "Failed to submit KYC", "error");
      }
    } catch (err) {
      console.error("Error submitting KYC:", err);
      showToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const requiredImages = [
    "aadhaar_front",
    "aadhaar_back",
    "shop_image",
    "pan_card",
    "photo",
  ];

  const allImagesUploaded = requiredImages.every(
    (key) => formData[key] && formData[key] !== ""
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
              onChange={(e) =>
                setEditedUser({ ...editedUser, name: e.target.value })
              }
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
            <Typography>{user?.email}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
            <Smartphone />
            <Typography>{user?.mobile}</Typography>
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

      {/* KYC Section */}
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          textAlign: "center",
          fontWeight: 600,
          color: "#6B21A8",
        }}
      >
        📂 Upload Required KYC Documents
      </Typography>

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
        {submitting ? (
          <CircularProgress />
        ) : (
          <>
            {[
              { name: "aadhaar_front", label: "Aadhaar Front" },
              { name: "aadhaar_back", label: "Aadhaar Back" },
              { name: "pan_card", label: "PAN Card" },
              { name: "shop_image", label: "Shop Image" },
              { name: "photo", label: "Your Photo" },
            ].map((f) => (
              <Box key={f.name} sx={{ mb: 2 }}>
                <Typography fontWeight={500} sx={{ mb: 1 }}>
                  {f.label}
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  disabled={submitting}
                >
                  Upload {f.label}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, f.name)}
                  />
                </Button>

                {previews[f.name] && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={previews[f.name]}
                      alt={f.label}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                      }}
                    />
                  </Box>
                )}
              </Box>
            ))}

            {/* Submit */}
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitKYC}
                disabled={submitting || !allImagesUploaded}
              >
                {submitting ? "Saving..." : "Save Business Info"}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default OnBoarding;
