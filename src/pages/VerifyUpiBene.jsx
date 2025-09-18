import React, { useState, useEffect, useRef } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { Box, Typography } from "@mui/material";

const VerifyUpiBene = ({ open, onClose, mobile, beneficiary, onSuccess }) => {
  const [mpin, setMpin] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!open) {
      setMpin(["", "", "", "", "", ""]);
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only allow 1 digit
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    // move focus
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const pin = mpin.join("");
    if (pin.length !== 6) {
      setError("Please enter a valid 6-digit MPIN");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        mobile_number: mobile,
        bene_id: beneficiary?.id,
        mpin: pin,
      };

      console.log("VERIFY_UPI_BENEFICIARY payload:", payload);

      const res = await apiCall(
        "post",
        ApiEndpoints.VERIFY_UPI_BENEFICIARY,
        payload
      );

      if (res) {
        okSuccessToast(res?.message || "Beneficiary verified successfully");
        onClose();
        onSuccess?.();
      } else {
        apiErrorToast(res?.message || "Failed to verify beneficiary");
      }
    } catch (err) {
      apiErrorToast(err?.message || "Error verifying beneficiary");
    } finally {
      setSubmitting(false);
    }
  };

  // Custom fieldConfig for 6-box MPIN input
  const fieldConfig = [
    {
      name: "mpin",
      label: "Enter 6-digit MPIN",
      type: "custom",
      component: (
        <Box display="flex" justifyContent="center" gap={1.5} mb={1}>
          {mpin.map((digit, index) => (
            <input
              key={index}
              type="password"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(index, e.target.value)}
              style={{
                width: 40,
                height: 50,
                textAlign: "center",
                fontSize: "1.5rem",
                borderRadius: 6,
                border: error ? "2px solid red" : "1px solid #ccc",
              }}
            />
          ))}
        </Box>
      ),
      helperText: error,
      error: !!error,
    },
  ];

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Verify Beneficiary"
      iconType="info"
      size="small"
      dividers
      fieldConfig={fieldConfig}
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: onClose,
          disabled: submitting,
        },
        {
          text: submitting ? "Verifying..." : "Verify",
          variant: "contained",
          color: "primary",
          onClick: handleVerify,
          disabled: submitting,
        },
      ]}
    />
  );
};

export default VerifyUpiBene;
