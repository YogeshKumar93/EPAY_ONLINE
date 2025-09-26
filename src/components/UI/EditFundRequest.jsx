import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Card,
  CardMedia,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import CommonMpinModal from "../common/CommonMpinModal";
const EditFundRequest = ({ open, handleClose, row, onFetchRef }) => {
  const { showToast } = useToast();

  // Use schema form hook like in create modal
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    loading: schemaLoading,
    setFormData,
  } = useSchemaForm(ApiEndpoints.GET_FUNDREQUEST_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const handleSendClick = () => {
    setMpinModalOpen(true);
  };

  // ✅ Initialize form data when modal opens with row data
  useEffect(() => {
    if (open && row && schema.length > 0) {
      const initialData = {
        bank_name: row.bank_name || "",
        mode: row.mode || "",
        remarks: row.remarks || row.remark || "",
        bank_ref_id: row.bank_ref_id || "",
        amount: row.amount || "",
        date: row.date || "",
        receipt: null, // For new file upload
      };

      setFormData(initialData);
      setImagePreview(row.receipt_image || row.receipt || null);
    }
  }, [open, row, schema, setFormData]);

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.bank_name) newErrors.bank_name = "Bank is required";
    if (!formData.mode) newErrors.mode = "Mode is required";
    if (!formData.bank_ref_id)
      newErrors.bank_ref_id = "Reference ID is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = "Enter a valid amount";
    }
    if (formData.remarks && formData.remarks.length > 200) {
      newErrors.remarks = "Remarks cannot exceed 200 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (mpin) => {
    if (!validateForm()) return;

    setSubmitting(true);

    const formDataToSend = new FormData();

    formDataToSend.append("id", row.id);
    formDataToSend.append("bank_name", formData.bank_name);
    formDataToSend.append("mode", formData.mode);
    formDataToSend.append("remarks", formData.remarks);
    formDataToSend.append("bank_ref_id", formData.bank_ref_id);
    formDataToSend.append("amount", formData.amount);
    formDataToSend.append("date", formData.date);

    if (formData.receipt) {
      formDataToSend.append("receipt", formData.receipt);
    }

    // Add mpin as extra field
    formDataToSend.append("mpin", mpin);

    // ✅ Directly send FormData, not wrapped in object
    const { response, error } = await apiCall(
      "POST",
      ApiEndpoints.EDIT_FUND_REQUEST,
      formDataToSend
    );

    if (response) {
      showToast("Fund request updated successfully", "success");
      onFetchRef();
      handleClose();
    } else {
      showToast(error?.message || "Update failed", "error");
    }

    setSubmitting(false);
  };

  // ✅ Define which fields to show (similar to create modal)
  const requiredFields = [
    "bank_name",
    "mode",
    "bank_ref_id",
    "date",
    "amount",
    "remarks",
    "receipt",
  ];

  // ✅ Filter and customize fields from schema
  let visibleFields = schema
    .filter((field) => requiredFields.includes(field.name))
    .map((field) => {
      // Customize fields based on edit mode requirements
      const baseField = { ...field };

      // Make non-editable fields disabled based on status
      if (row?.status !== "pending" && field.name !== "remarks") {
        baseField.props = { ...baseField.props, disabled: true };
      }

      // Customize date field
      if (field.name === "date") {
        return {
          ...baseField,
          type: "datepicker",
          props: {
            ...baseField.props,
            disableFuture: true,
            format: "DD/MM/YYYY",
          },
        };
      }

      // Customize remarks field (always editable)
      if (field.name === "remarks") {
        return {
          ...baseField,
          props: {
            ...baseField.props,
            multiline: true,
            rows: 3,
          },
        };
      }

      return baseField;
    });

  // ✅ Add read-only fields for display
  const readOnlyFields = [
    {
      name: "requester_name",
      label: "Requester Name",
      type: "text",
      value: row?.name || "",
      props: { disabled: true },
    },
    {
      name: "status",
      label: "Current Status",
      type: "text",
      value: row?.status || "",
      props: { disabled: true },
    },
    {
      name: "current_amount",
      label: "Amount",
      type: "text",
      value: row?.amount ? `₹${row.amount}` : "",
      props: { disabled: true },
    },
  ];

  return (
    <>
      <CommonModal
        open={open}
        onClose={handleClose}
        title="Edit Fund Request"
        iconType="edit"
        size="medium"
        layout="two-column"
        dividers
        fieldConfig={[
          ...visibleFields,

          // ...readOnlyFields,
        ]}
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        loading={schemaLoading || submitting}
        customContent={
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Receipt Images
            </Typography>
            <Box display="flex" gap={3}>
              {/* Current Receipt */}
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                {row?.receipt_image || row?.receipt ? (
                  <Card variant="outlined" sx={{ width: "100%" }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={row.receipt_image || row.receipt}
                      alt="Current Receipt"
                      sx={{ objectFit: "contain" }}
                    />
                    <Box p={1} display="flex" justifyContent="center">
                      <Chip
                        label="Current Receipt"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Card>
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={1}
                    p={2}
                    border="1px dashed #ccc"
                    borderRadius={1}
                    width="100%"
                  >
                    <ImageIcon color="disabled" fontSize="large" />
                    <Typography variant="body2" color="textSecondary">
                      No receipt image uploaded
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        }
        footerButtons={[
          {
            text: "Cancel",
            variant: "outlined",
            onClick: handleClose,
            disabled: submitting,
          },
          {
            text: submitting ? "Saving..." : "Save Changes",
            variant: "contained",
            color: "primary",
            onClick: handleSendClick,
            disabled: submitting,
          },
        ]}
      />

      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Enter MPIN"
        mPinCallBack={handleSave} // MPIN entered -> create transfer
      />
    </>
  );
};

export default EditFundRequest;
