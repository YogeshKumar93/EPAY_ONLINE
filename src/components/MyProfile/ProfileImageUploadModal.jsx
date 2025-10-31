import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";

const ProfileImageUploadModal = ({
  open,
  onClose,
  onUploadSuccess,
  username,
}) => {
  const [preview, setPreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Convert image file to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result); // this will be the base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Send Base64 string to API
  const handleUpload = async () => {
    if (!base64Image) return;

    setUploading(true);
    const payload = {
      username,
      profile_image: base64Image, // send base64 string directly
    };

    try {
      const response = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_USER_PROFILE_NEW,
        payload
      );

      if (response?.status) {
        onUploadSuccess(base64Image);
        onClose();
      } else {
        alert(response?.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Profile upload error:", error);
      alert("Something went wrong while uploading. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          p: 4,
          width: 350,
          mx: "auto",
          mt: "15%",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" mb={2}>
          Upload Profile Picture
        </Typography>

        <Avatar
          src={preview || ""}
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            mb: 2,
            bgcolor: "#f5f5f5",
          }}
        >
          {!preview && "No Image"}
        </Avatar>

        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2, textTransform: "none" }}
        >
          Choose File
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>

        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!base64Image || uploading}
          >
            {uploading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Upload"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProfileImageUploadModal;
