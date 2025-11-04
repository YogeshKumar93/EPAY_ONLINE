import React, { useState, useEffect } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { Tabs, Tab, Box, CircularProgress } from "@mui/material";
import CommonLoader from "../components/common/CommonLoader";
import { useToast } from "../utils/ToastContext";

const TAB_CONFIG = [
  { key: "user_details", label: "User Details" },
  { key: "basic", label: "Basic" },
  { key: "address", label: "Address" },
  { key: "kyc", label: "KYC" },
];

const formatLabel = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
const EditUser = ({ open, onClose, user, onFetchRef }) => {
  const [selectedTab, setSelectedTab] = useState("user_details");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const { showToast } = useToast();

  // Define field configurations for each tab
  const TAB_FIELDS = {
    address: [
      { name: "address_line1", label: "address_line1", type: "text" },
      { name: "address_line2", label: "address_line2", type: "text" },
      { name: "city", label: "city", type: "text" },
      { name: "state", label: "state", type: "text" },
      { name: "pincode", label: "pincode", type: "text" },
    ],
    kyc: [
      { name: "aadhaar_front", label: "Aadhaar Front", type: "file" },
      { name: "aadhaar_back", label: "Aadhaar Back", type: "file" },
      { name: "pan_card", label: "PAN Card", type: "file" },
      { name: "shop_image", label: "Shop Image", type: "file" },
      { name: "photo", label: "Photo", type: "file" },
    ],
    basic: [
      { name: "business_name", label: "Business Name", type: "text" },
      { name: "business_type", label: "Business Type", type: "text" },
      { name: "address", label: "Address", type: "text" },
      // Add other business fields as needed
    ],
    user_details: [
      { name: "name", label: " Name", type: "text" },
      { name: "establishment", label: "Establishment", type: "text" },
      { name: "mobile", label: "Mobile", type: "text" },
    ],
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
  // ✅ Store raw File object instead of base64
  const handleFileUpload = (fieldName, file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const getChangedFields = () => {
    const changedFields = {};

    // Include uploaded files
    Object.keys(uploadedFiles).forEach((key) => {
      if (uploadedFiles[key]) {
        changedFields[key] = uploadedFiles[key];
      }
    });

    // Include non-file fields that changed
    Object.keys(formData).forEach((key) => {
      if (uploadedFiles[key]) return; // skip already uploaded files

      const isFileField =
        TAB_FIELDS[selectedTab]?.find((f) => f.name === key)?.type === "file";

      if (isFileField) return; // skip file fields not updated

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

      // ✅ Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append("id", user.id);
      formDataToSend.append("user_id", user.id);
      formDataToSend.append("type", selectedTab);

      Object.entries(changedFields).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value); // ✅ binary file
        } else {
          formDataToSend.append(key, value);
        }
      });

      // ✅ Call API (no manual Content-Type header)
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.UPDATE_BY_TYPE,
        formDataToSend
      );

      if (response) {
        showToast(response?.message || "Update successful", "success");
        onFetchRef?.();
        onClose();
      } else {
        showToast(error?.message || "Update failed", "error");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      showToast("Something went wrong while updating user", "error");
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
                {uploadedFiles[field.name] && (
                  <img
                    src={URL.createObjectURL(uploadedFiles[field.name])}
                    alt="Preview"
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      objectFit: "cover",
                      marginTop: "5px",
                    }}
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
