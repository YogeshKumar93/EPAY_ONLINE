import React, { useEffect, useState, useContext } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import numWords from "num-words";
import ResetMpin from "../components/common/ResetMpin";
import AuthContext from "../contexts/AuthContext";

// Inline OtpInput component for 6 MPIN boxes
const OtpInput = ({ otp, setOtp }) => {
  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const otpArr = otp.split("");
      otpArr[index] = val;
      setOtp(otpArr.join(""));

      if (val && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }

      if (!val && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <TextField
          key={i}
          id={`otp-${i}`}
          type="password"
          value={otp[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          inputProps={{
            maxLength: 1,
            style: { textAlign: "center", height: 30, width: 20, fontSize: 18 },
          }}
          sx={{ "& .MuiInputBase-root": { height: 40 } }}
        />
      ))}
    </Box>
  );
};

const FundRequestModal = ({ open, handleClose, row, status, onFetchRef }) => {
  const authCtx = useContext(AuthContext);
  const username = `TRANS${authCtx?.user?.id}`;

  const [formData, setFormData] = useState({
    amount: "",
    amountInWords: "",
    remarks: "",
    status: "",
    id: "",
    mpin: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [resetMpinModalOpen, setResetMpinModalOpen] = useState(false);

  useEffect(() => {
    if (formData.amount) {
      setFormData((prev) => ({
        ...prev,
        amountInWords: numWords(formData.amount),
      }));
    }
  }, [formData.amount]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const footerButtons = [
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
    <>
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
        customContent={
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Enter MPIN
            </Typography>
            <OtpInput
              otp={formData.mpin}
              setOtp={(val) => setFormData((prev) => ({ ...prev, mpin: val }))}
            />
            <Box
              mt={1.5}
              sx={{ display: "flex", justifyContent: "center", ml: 30 }}
            >
              <Button
                variant="contained"
                size="small"
                sx={{ fontSize: "11px" }}
                onClick={() => setResetMpinModalOpen(true)}
              >
                Reset MPIN
              </Button>
            </Box>
          </Box>
        }
      />

      {resetMpinModalOpen && (
        <ResetMpin
          open={resetMpinModalOpen}
          onClose={() => setResetMpinModalOpen(false)}
          username={username}
        />
      )}
    </>
  );
};

export default FundRequestModal;
