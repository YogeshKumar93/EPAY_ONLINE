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

// Convert key_name to Label (e.g., business_email -> Business Email)
const formatLabel = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const EditUser = ({ open, onClose, user, onFetchRef }) => {
  const [selectedTab, setSelectedTab] = useState("basic");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
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
      setFormData(data);
    } catch (err) {
      console.error("Error fetching business details:", err);
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.UPDATE_BY_TYPE,
        {
          id: user.id,
          user_id: user.id,
          type: selectedTab,
          ...formData,
        }
      );
      if (response) {
        showToast(
          response?.message || "AEPS2 onboarding successful",
          "success"
        );
        onFetchRef?.();
        onClose();
      } else {
        showToast(error?.message || "AEPS2 onboarding failed", "error");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically generate fields from API response
  const NON_EDITABLE_FIELDS = ["id", "user_id", "created_at", "updated_at"];

  // Dynamically generate fields from API response but skip non-editable ones
  let fields = Object.keys(formData || {})
    .filter((key) => !NON_EDITABLE_FIELDS.includes(key))
    .map((key) => ({
      name: key,
      label: formatLabel(key),
      type: key.toLowerCase().includes("date") ? "date" : "text",
    }));

  // If KYC tab and no data received, create placeholder fields for upload
  if (selectedTab === "kyc" && fields.length === 0) {
    fields = [
      { name: "aadhaar_front", label: "Aadhaar Front", type: "file" },
      { name: "aadhaar_back", label: "Aadhaar Back", type: "file" },
      { name: "pan_card", label: "PAN Card", type: "file" },
      { name: "shop_image", label: "Shop Image", type: "file" },
      { name: "photo", label: "Photo", type: "file" },
    ];
  }

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
        {/* Loader overlay */}
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
            const isImageField = selectedTab === "kyc"; // For KYC tab only
            const hasValue =
              typeof value === "string" &&
              (value.startsWith("http://") ||
                value.startsWith("https://") ||
                value.startsWith("data:image"));

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
                    {/* Show preview only if a value exists */}
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
                      </Box>
                    )}

                    {/* Always show file input for KYC fields */}
                    <Box>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setFormData((prev) => ({
                                ...prev,
                                [field.name]: reader.result,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
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
