import React, { useState, useEffect } from "react";

import { TextField } from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../../components/common/CommonModal";
import { useToast } from "../../utils/ToastContext";

const SoliTechSenderRegister = ({
  open,
  onClose,
  mobile,
  onRegistered,
  fetchSender,
}) => {
  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",

    mobile_number: mobile || "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const isFormValid = () => {
    return (
      formData.f_name?.trim() &&
      formData.l_name?.trim() &&
      formData.mobile_number?.trim()
    );
  };

  // ✅ keep mobile in sync
  useEffect(() => {
    if (mobile) {
      setFormData((prev) => ({ ...prev, mobile_number: mobile }));
    }
  }, [mobile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setSubmitting(true);
    setErrors({});
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.SOLITECH_REMMITER_LOGIN,
        formData
      );

      if (response) {
        const otp_ref = response?.data?.otp_ref;
        const sender_id = response?.response?.data?.sender?.id;

        onRegistered?.({
          mobile_number: formData.mobile_number,
          otp_ref,
          sender_id,
        });

        onClose();
        fetchSender?.(mobile);
      } else {
        showToast(error || "Failed to register sender", "error");
      }
    } catch (err) {
      showToast(err, "error");
      setErrors(err?.response?.data?.errors || {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Register Sender"
      iconType="info"
      size="small"
      dividers
      loading={submitting}
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: onClose,
          disabled: submitting,
        },
        {
          text: submitting ? "Registering..." : "Register",
          variant: "contained",
          color: "primary",
          onClick: handleRegister,
          disabled: submitting || !isFormValid(),
        },
      ]}
    >
      {/* First Name Field */}
      <TextField
        fullWidth
        margin="dense"
        name="f_name"
        label="First Name"
        placeholder="Enter first name"
        value={formData.f_name}
        onChange={handleChange}
        error={!!errors.f_name}
        helperText={errors.f_name}
        required
      />

      {/* Last Name Field */}
      <TextField
        fullWidth
        margin="dense"
        name="l_name"
        label="Last Name"
        placeholder="Enter last name"
        value={formData.l_name}
        onChange={handleChange}
        error={!!errors.l_name}
        helperText={errors.l_name}
        required
      />

      {/* Mobile Number Field */}
      <TextField
        fullWidth
        margin="dense"
        name="mobile_number"
        label="Mobile Number"
        placeholder="Enter 10-digit mobile number"
        value={formData.mobile_number}
        onChange={handleChange}
        error={!!errors.mobile_number}
        helperText={errors.mobile_number}
        disabled
      />

    </CommonModal>
  );
};

export default SoliTechSenderRegister;
