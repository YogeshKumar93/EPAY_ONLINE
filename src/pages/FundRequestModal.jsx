import React, { useEffect, useState } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { CircularProgress } from "@mui/material";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import numWords from "num-words";

const FundRequestModal = ({ open, handleClose, row, status,onFetchRef }) => {
  const [formData, setFormData] = useState({
    amount: "",
    amountInWords: "",
    remarks: "",
    status:"",
    id:"",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.amount) {
      setFormData((prev) => ({
        ...prev,
        amountInWords: numWords(formData.amount),
      }));
    }
  }, [formData.amount]);

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
      const payload = {
        id: row?.id,
       
        status,
 
     
        amount: formData.amount,
        remarks: formData.remarks,
      };

      const response = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_FUND_REQUEST,
        payload
        
      );

      if (response) {
        okSuccessToast("Fund Request updated successfully!");
        onFetchRef();
        handleClose();
      } else {
        apiErrorToast("Failed to update Fund Request");
      }
    } catch (err) {
      console.error(err);
      apiErrorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (open) {
    setFormData({
      amount: row?.amount || "1000",
      amountInWords: row?.amount ? numWords(row.amount) : "",
      remarks: row?.remarks || "",
    });
  }
}, [open, row]);


  const footerButtons = [
    {
      text: "Cancel",
      variant: "outlined",
      onClick: handleClose,
      disabled: loading,
    },
    {
      text: "Submit",
      variant: "contained",
      onClick: onSubmit,
      disabled: loading,
      startIcon: loading ? <CircularProgress size={20} color="inherit" /> : null,
    },
  ];

  const fieldConfig = [
    {
      name: "amount",
      label: "Amount",
      type: "number",
      validation: { required: true, min: 1 },
    },
    {
      name: "amountInWords",
      label: "Amount in Words",
      type: "text",
      disabled: true,
    },
    {
      name: "remarks",
      label: "Remarks",
      type: "text",
      multiline: true,
      rows: 3,
      validation: { required: false, maxLength: 200 },
    },
  ];

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title={
        status === "approved"
          ? "Approve Fund Request"
          : status === "rejected"
          ? "Reject Fund Request"
          : status === "pending"
          ? "Reopen Fund Request"
          : "Fund Request"
      }
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

export default FundRequestModal;
