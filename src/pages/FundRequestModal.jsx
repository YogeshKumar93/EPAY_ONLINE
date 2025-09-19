import React, { useEffect, useState } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { CircularProgress, Box, Typography } from "@mui/material";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import numWords from "num-words";
import OtpInput from "./OtpInput";
const FundRequestModal = ({ open, handleClose, row, status, onFetchRef }) => {
  const [formData, setFormData] = useState({
    amount: "",
    amountInWords: "",
    remarks: "",
    status: "",
    id: "",
    mpin: "", // ✅ now handled via OtpInput
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Convert amount → words
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ API call
  const onSubmit = async () => {
    setLoading(true);
    const payload = {
      id: row?.id,
      status,
      amount: formData.amount,
      remarks: formData.remarks,
      mpin: formData.mpin,
    };

    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.UPDATE_FUND_REQUEST,
      payload
    );

    if (response) {
      okSuccessToast(response?.message);
      onFetchRef();
      handleClose();
    } else {
      handleClose();
      apiErrorToast(error?.message || "Fund request failed");
    }
    setLoading(false);
  };

  // ✅ Set defaults when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        amount: row?.amount || "1000",
        amountInWords: row?.amount ? numWords(row.amount) : "",
        remarks: row?.remarks || "",
        mpin: "",
      });
    }
  }, [open, row]);

  // ✅ Footer buttons
  const footerButtons = [
    // {
    //   text: "Cancel",
    //   variant: "outlined",
    //   onClick: handleClose,
    //   disabled: loading,
    // },
    {
      text: "Submit",
      variant: "contained",
      onClick: onSubmit,
      disabled: loading || formData.mpin.length !== 6,
      startIcon: loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : null,
    },
  ];

  // ✅ Normal fields
  const fieldConfig = [
    { name: "amount", label: "Amount", type: "number" },
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
      dividers={true}
      fieldConfig={fieldConfig}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading}
      // ✅ MPIN input section
      customContent={
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Enter MPIN
          </Typography>
          <OtpInput
            otp={formData.mpin}
            setOtp={(val) => setFormData((prev) => ({ ...prev, mpin: val }))}
          />
        </Box>
      }
    />
  );
};

export default FundRequestModal;
