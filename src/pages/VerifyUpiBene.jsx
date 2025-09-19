import React, { useContext, useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import MpinInput from "./MpinInput";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";

const VerifyUpiBene = ({
  open,
  onClose,
  mobile,
  beneficiary,
  onSuccess,
  beneaccnumber,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const { location } = useContext(AuthContext);

  const handleVerify = async (pin) => {
    if (pin.length !== 6) {
      setError("Please enter a valid 6-digit MPIN");
      return;
    }

    setSubmitting(true);
    setError("");

    const payload = {
      mobile_number: mobile,
      bene_id: beneficiary?.id,
      mpin: pin,
      latitude: location?.lat || "",
      longitude: location?.long || "",
      account_number: beneaccnumber,
      operator: 21,
    };

    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.VERIFY_UPI_BENEFICIARY,
      payload
    );

    if (response) {
      okSuccessToast(response?.data || "Beneficiary verified successfully");
      onClose();
      onSuccess?.();
    } else {
      showToast(error?.message || "Failed to verify beneficiary", "error");
    }
  };

  return (
    <MpinInput
      open={open}
      onClose={onClose}
      title="Verify Beneficiary"
      onSubmit={handleVerify}
      submitting={submitting}
      errorMsg={error}
    />
  );
};

export default VerifyUpiBene;
