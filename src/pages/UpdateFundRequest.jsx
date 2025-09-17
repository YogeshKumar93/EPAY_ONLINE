import React, { useState, useEffect } from 'react';
import CommonModal from '../components/common/CommonModal';
import { apiCall } from '../api/apiClient';
import ApiEndpoints from '../api/ApiEndpoints';
import { CircularProgress } from '@mui/material';

const UpdateFundRequest = ({ open, handleClose, handleSave, selectedFundRequest }) => {
  const [formData, setFormData] = useState({
    bank_name: "",
    status: "",
    asm_id: "",
    user_id: "",
    name: "",
    mode: "",
    bank_ref_id: "",
    date: "",
    amount: "",
    remark: "",
    txn_id: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Pre-fill data when modal opens
  useEffect(() => {
    if (selectedFundRequest) {
      setFormData({
        bank_name: selectedFundRequest.bank_name || "",
        status: selectedFundRequest.status || "",
        asm: selectedFundRequest.asm_id || "",
        user_id: selectedFundRequest.user_id || "",
        name: selectedFundRequest.name || "",
        mode: selectedFundRequest.mode || "",
        bank_ref_id: selectedFundRequest.bank_ref_id || "",
        date: selectedFundRequest.date || "",
        amount: selectedFundRequest.amount || "",
        remark: selectedFundRequest.remark || "",
        txn_id: selectedFundRequest.txn_id || "",
      });
    }
  }, [selectedFundRequest, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        `${ApiEndpoints.UPDATE_FUND_REQUEST} `,
        formData
      );

      if (response) {
        handleSave(response.data);
        handleClose();
      } else {
        console.error("Failed to update fund request:", error || response);
      }
    } catch (err) {
      console.error("Error updating fund request:", err);
      alert("Something went wrong while updating fund request.");
    } finally {
      setLoading(false);
    }
  };

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

  const fieldConfig = [
    { name: "bank_name", label: "Bank Name", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "failed", label: "Failed" },
        { value: "success", label: "Success" },
      ],
    },
    // { name: "asm_id", label: "Asm Id", type: "text" },
    // { name: "user_id", label: "User Id", type: "text" },
    { name: "name", label: "Merchant Name", type: "text" },
    { name: "mode", label: "Account / Mode", type: "text" },
    { name: "bank_ref_id", label: "Bank Ref Id", type: "text" },
    { name: "date", label: "Date", type: "text" },
    { name: "amount", label: "Amount", type: "text" },
    { name: "remark", label: "Remarks", type: "text" },
    { name: "txn_id", label: "TXN ID", type: "text" },
  ];

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Update Fund Request"
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

export default UpdateFundRequest;
