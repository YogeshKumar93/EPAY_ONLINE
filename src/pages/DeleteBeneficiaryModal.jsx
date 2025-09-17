import React, { useState } from "react";
import CommonModal from "../components/common/CommonModal";
import { Box, Typography } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import OtpInput from "./OtpInput";
import { useToast } from "../utils/ToastContext";

const DeleteBeneficiaryModal = ({
  open,
  onClose,
  beneficiary,
  sender,
  onSuccess,
}) => {
  const [step, setStep] = useState("confirm"); // confirm | otp
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [otpRefId, setOtpRefId] = useState(null);
  const [beneficiaryId, setBeneficiaryId] = useState(null);
  const { showToast } = useToast();

  if (!beneficiary) return null;

  // Step 1 → Call delete init API
  const handleDeleteInit = async () => {
    setLoading(true);
    try {
      const payload = {
        sender_id: sender?.id,
        rem_mobile: sender?.mobileNumber,
        ben_id: beneficiary?.bene_id,
      };

      const response = await apiCall(
        "post",
        ApiEndpoints.REMOVE_DMT1_BENEFICIARY,
        payload
      );
      console.log("🟢 Raw API Response:", response);

      if (response?.response?.message === "OTP sent successfully") {
        setOtpRefId(response?.response?.data?.otp_ref_id);
        setBeneficiaryId(response?.response?.data?.beneficiaryId);
        setStep("otp");
      } else {
        showToast(
          response?.error?.message || "Failed to initiate deletion",
          "error"
        );
      }
    } catch (err) {
      showToast(err.message || "Unexpected error", "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → Verify OTP & MPIN
  const handleVerifyOtp = async () => {
    if (!otp) return showToast("Please enter OTP", "error");
    if (!mpin || mpin.length !== 6)
      return showToast("Please enter 6-digit MPIN", "error");

    setLoading(true);
    try {
      const payload = {
        sender_id: sender?.id,
        rem_mobile: sender?.mobileNumber,
        referenceKey: otpRefId,
        ben_id: beneficiaryId,
        otp,
        mpin,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.REMOVE_DMT1_BENEFICIARY_VERIFY,
        payload
      );

      if (response) {
        okSuccessToast(response?.message || "Beneficiary deleted successfully");
        onSuccess?.();
        handleCloseAll();
      } else {
        showToast(error?.message || "OTP verification failed", "error");
      }
    } catch (err) {
      showToast(err.message || "Unexpected error", "error");
    } finally {
      setLoading(false);
    }
  };

  // Reset everything
  const handleCloseAll = () => {
    setStep("confirm");
    setOtp("");
    setMpin("");
    setOtpRefId(null);
    setBeneficiaryId(null);
    onClose();
  };

  return (
    <>
      {/* Step 1: Confirm deletion */}
      {step === "confirm" && (
        <CommonModal
          open={open}
          onClose={handleCloseAll}
          title="Delete Beneficiary"
          iconType="warning"
          size="small"
          dividers
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: handleCloseAll,
              disabled: loading,
            },
            {
              text: loading ? "Processing..." : "Delete",
              variant: "contained",
              color: "error",
              onClick: handleDeleteInit,
              disabled: loading,
            },
          ]}
        >
          <Box>
            <Typography variant="body2">
              Are you sure you want to delete{" "}
              <strong>{beneficiary?.beneficiary_name}</strong>?
            </Typography>
          </Box>
        </CommonModal>
      )}

      {/* Step 2: Enter OTP & MPIN */}
      {step === "otp" && (
        <CommonModal
          open={open}
          onClose={handleCloseAll}
          title="Enter OTP & MPIN"
          iconType="info"
          size="small"
          dividers
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: handleCloseAll,
              disabled: loading,
            },
            {
              text: loading ? "Verifying..." : "Verify OTP",
              variant: "contained",
              color: "primary",
              onClick: handleVerifyOtp,
              disabled: loading,
            },
          ]}
        >
          <Box>
            <Typography variant="body2" mb={2}>
              An OTP has been sent to your registered mobile number. Please
              enter it below along with your 6-digit MPIN to confirm deletion of{" "}
              <strong>{beneficiary?.beneficiary_name}</strong>.
            </Typography>

            {/* OTP Field */}
            <Typography variant="subtitle2" mt={1} mb={1}>
              Enter OTP
            </Typography>
            <OtpInput otp={otp} setOtp={setOtp} />

            {/* MPIN Field */}
            <Typography variant="subtitle2" mt={3} mb={1}>
              Enter 6-digit MPIN
            </Typography>
            <OtpInput otp={mpin} setOtp={setMpin} length={6} isMpin />
          </Box>
        </CommonModal>
      )}
    </>
  );
};

export default DeleteBeneficiaryModal;
