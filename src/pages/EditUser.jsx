import React, { useState, useEffect } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { Tabs, Tab, Box, CircularProgress } from "@mui/material";
import CommonLoader from "../components/common/CommonLoader";
import { useToast } from "../utils/ToastContext";

const TAB_CONFIG = [
  { key: "basic", label: "Basic" },
  { key: "address", label: "Address" },
  { key: "kyc", label: "KYC" },
];

const formatLabel = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
const EditUser = ({ open, onClose, user, onFetchRef }) => {
  const [selectedTab, setSelectedTab] = useState("basic");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const { showToast } = useToast();

  // Define field configurations for each tab
  const TAB_FIELDS = {
    basic: [
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      // Add other basic fields as needed
    ],
    kyc: [
      { name: "aadhaar_front", label: "Aadhaar Front", type: "file" },
      { name: "aadhaar_back", label: "Aadhaar Back", type: "file" },
      { name: "pan_card", label: "PAN Card", type: "file" },
      { name: "shop_image", label: "Shop Image", type: "file" },
      { name: "photo", label: "Photo", type: "file" },
    ],
    business: [
      { name: "business_name", label: "Business Name", type: "text" },
      { name: "business_type", label: "Business Type", type: "text" },
      { name: "address", label: "Address", type: "text" },
      // Add other business fields as needed
    ],
    // Add more tabs as needed
  };

  // Fetch data when modal opens or tab changes
  useEffect(() => {
    if (!user || !open) return;
    fetchBusinessDetails(selectedTab);
  }, [user, open, selectedTab]);

  const fetchBusinessDetails = async (type) => {
    setLoading(true);
    try {
      const res = await apiCall("post", ApiEndpoints.GET_BY_TYPE, {
        user_id: user.id,
        type: type,
      });
      const data = res?.data || res?.response?.data || {};

      // Initialize form data with default values for all fields in the tab
      const initializedData = {};
      const tabFields = TAB_FIELDS[type] || [];

      tabFields.forEach((field) => {
        // Use API data if available, otherwise use empty string
        initializedData[field.name] = data[field.name] || "";
      });

      setFormData(initializedData);
      setOriginalData(initializedData);
      setUploadedFiles({});
    } catch (err) {
      console.error("Error fetching business details:", err);

      // Initialize with empty data if API fails
      const tabFields = TAB_FIELDS[selectedTab] || [];
      const emptyData = {};
      tabFields.forEach((field) => {
        emptyData[field.name] = "";
      });
      setFormData(emptyData);
      setOriginalData(emptyData);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Fixed file upload handler
  const handleFileUpload = (fieldName, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result;
        setFormData((prev) => ({
          ...prev,
          [fieldName]: fileData,
        }));
        setUploadedFiles((prev) => ({
          ...prev,
          [fieldName]: fileData,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to get only changed fields
  const getChangedFields = () => {
    const changedFields = {};

    // First, include all uploaded files
    Object.keys(uploadedFiles).forEach((key) => {
      if (uploadedFiles[key]) {
        changedFields[key] = uploadedFiles[key];
      }
    });

    // Then, include non-file fields that have changed
    Object.keys(formData).forEach((key) => {
      // Skip if it's already included as an uploaded file
      if (uploadedFiles[key]) return;

      // Skip if it's a file field but not uploaded (to avoid sending empty file fields)
      const isFileField =
        TAB_FIELDS[selectedTab]?.find((field) => field.name === key)?.type ===
        "file";
      if (isFileField && !uploadedFiles[key]) return;

      // Check if value changed from original for non-file fields
      if (formData[key] !== originalData[key]) {
        changedFields[key] = formData[key];
      }
    });

    return changedFields;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const changedFields = getChangedFields();

      if (Object.keys(changedFields).length === 0) {
        showToast("No changes detected", "info");
        setLoading(false);
        return;
      }

      console.log("Sending changed fields:", Object.keys(changedFields));

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.UPDATE_BY_TYPE,
        {
          id: user.id,
          user_id: user.id,
          type: selectedTab,
          ...changedFields,
        }
      );
      if (response) {
        showToast(response?.message || "Update successful", "success");
        onFetchRef?.();
        onClose();
      } else {
        showToast(error?.message || "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get fields for current tab - always use predefined fields
  const fields = TAB_FIELDS[selectedTab] || [];

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Edit User"
      loading={loading}
      footerButtons={[
        { text: "Cancel", variant: "outlined", onClick: onClose },
        { text: "Save", variant: "contained", onClick: handleSubmit },
      ]}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          {TAB_CONFIG.map((tab) => (
            <Tab key={tab.key} value={tab.key} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      <Box position="relative">
        {loading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="rgba(255,255,255,0.6)"
            zIndex={1}
          >
            <CommonLoader />
          </Box>
        )}
        <Box opacity={loading ? 0.5 : 1}>
          {fields.map((field) => {
            const value = formData[field.name] || "";
            const isImageField = field.type === "file";
            const hasValue =
              isImageField &&
              typeof value === "string" &&
              (value.startsWith("http://") ||
                value.startsWith("https://") ||
                value.startsWith("data:image"));

            const isNewlyUploaded = uploadedFiles[field.name];

            return (
              <div
                key={field.name}
                style={{
                  marginBottom: "15px",
                  display: isImageField ? "flex" : "block",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <label style={{ fontWeight: 500, minWidth: "120px" }}>
                  {field.label}
                </label>

                {isImageField ? (
                  <>
                    {hasValue && (
                      <Box>
                        <img
                          src={value}
                          alt={field.label}
                          style={{
                            maxWidth: "150px",
                            maxHeight: "150px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            objectFit: "cover",
                          }}
                        />
                        {isNewlyUploaded && (
                          <div
                            style={{
                              color: "green",
                              fontSize: "12px",
                              marginTop: "5px",
                            }}
                          >
                            Newly uploaded
                          </div>
                        )}
                      </Box>
                    )}

                    <Box>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          handleFileUpload(field.name, file);
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={value}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  />
                )}

                {errors[field.name] && (
                  <p style={{ color: "red", margin: 0 }}>
                    {errors[field.name]}
                  </p>
                )}
              </div>
            );
          })}
        </Box>
      </Box>
    </CommonModal>
  );
};
export default EditUser;
