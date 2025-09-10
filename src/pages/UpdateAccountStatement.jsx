import React, { useEffect, useState, useContext } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import AuthContext from "../contexts/AuthContext"; // ✅ import context

const UpdateAccountStatement = ({ open, handleClose, handleSave, row,onFetchRef }) => {
  const [formData, setFormData] = useState({
    name: "",
    color_code: "#000000", // ✅ default valid hex
    element_type: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

//   const [colorOptions, setColorOptions] = useState([]);

  // ✅ Prefill form when editing
  useEffect(() => {
    if (open && row) {
      setFormData({
        name: row?.name || "",
        color_code: row?.color_code?.startsWith("#")
          ? row.color_code
          : `#${row?.color_code || "000000"}`, // ✅ ensure valid hex
        element_type: row?.element_type || "",
      });
    }
  }, [open, row]);

  useEffect(() => {
    if (open) {
      fetchColors();
    }
  }, [open]);

  const fetchColors = async () => {
    try {
      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.GET_ACCOUNT_STATEMENT_SCHEMA
      );
      if (response) {
        (response?.data?.data || []);
        
      } else {
        console.error("Error fetching colors: ", error);
      }
    } catch (err) {
      console.error("Error fetching colors: ", err);
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ API submit (Update)
  const onSubmit = async () => {
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_ACCOUNT_STATEMENT, // 🔑 update endpoint
        { id: row?.id, ...formData }
      );

      if (response) {
        handleSave(response.data);
        onFetchRef();
        handleClose();
      } else {
        console.error("Failed to update layout:", error || response);
      }
    } catch (err) {
      console.error("Error updating layout:", err);
      alert("Something went wrong while updating layout.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Footer buttons
  const footerButtons = [
    {
      text: "Cancel",
      variant: "outlined",
      onClick: handleClose,
      disabled: loading,
    },
    {
      text: "Update",
      variant: "contained",
      onClick: onSubmit,
      disabled: loading,
      startIcon: loading ? <CircularProgress size={20} color="inherit" /> : null,
    },
  ];

  // ✅ Field configuration
  const fieldConfig = [
    { name: "name", label: "Name", type: "text" },
    { name: "element_type", label: "Element Type", type: "text" },
   
  ];

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Update Colours"
      footerButtons={footerButtons}
      size="medium"
      iconType="info"
      showCloseButton={true}
      closeOnBackdropClick={!loading}
      dividers={true}
      fieldConfig={fieldConfig}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading}
      layout="two-column"
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: "block" }}
      >
        * Status remains unchanged unless explicitly modified
      </Typography>
    </CommonModal>
  );
};

export default UpdateAccountStatement;
