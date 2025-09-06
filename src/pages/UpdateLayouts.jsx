import React, { useEffect, useState } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { CircularProgress } from "@mui/material";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";

const UpdateLayouts = ({ open, handleClose, row }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    color_code: "",
    element_type: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Prefill data when modal opens
 useEffect(() => {
  if (open && row) {
    setFormData({
      id: row?.id || "",
      name: row?.name || "",
      color_code: row?.color_code || "",
      element_type: row?.element_type || "",
    });
  }
}, [open, row]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit update
  const onSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        id: formData.id,
        name: formData.name,
        color_code: formData.color_code,
        element_type: formData.element_type,
      };

      const response = await apiCall(
        "POST", // change to PUT/PATCH if backend expects
        ApiEndpoints.UPDATE_COLOUR,
        payload
      );

      if (response) {
        okSuccessToast("Layout updated successfully!");
        handleClose();
      } else {
        apiErrorToast("Failed to update layout");
      }
    } catch (err) {
      console.error(err);
      apiErrorToast("Something went wrong while updating layout");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Footer Buttons
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

  // ✅ Field Config
  const fieldConfig = [
    {
      name: "name",
      label: "Name",
      type: "text",
      validation: { required: true, maxLength: 100 },
    },
    {
      name: "color_code",
      label: "Colour Code",
      type: "color",
      validation: { required: true },
    },
    {
      name: "element_type",
      label: "Element Type",
      type: "text",
      validation: { required: true },
    },
  ];

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Update Layout"
      footerButtons={footerButtons}
      size="medium"
      iconType="info"
      layout="two-column"
      showCloseButton={true}
      closeOnBackdropClick={!loading}
      dividers={true}
      fieldConfig={fieldConfig}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading}
    />
  );
};

export default UpdateLayouts;
