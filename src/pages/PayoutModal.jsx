import { useEffect, useState, useContext } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useSchemaForm } from "../hooks/useSchemaForm";
import AuthContext from "../contexts/AuthContext"; // ✅ import auth context

const PayoutModal = ({ open, onClose, senderId, beneficiary, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);

  // ✅ access latitude & longitude from AuthContext
  const { location } = useContext(AuthContext);

  const { schema, formData, handleChange, errors, setErrors, loading, setFormData } =
    useSchemaForm(ApiEndpoints.PAYOUT_SCHEMA, open, {});

  // Prefill the form with beneficiary and sender data when modal opens
  useEffect(() => {
    if (open && beneficiary) {
      setFormData({
        sender_id: senderId,
        beneficiary_id: beneficiary.id,
        beneficiary_name: beneficiary.beneficiary_name,
        account_number: beneficiary.account_number,
        ifsc_code: beneficiary.ifsc_code,
        bank_name: beneficiary.bank_name,
        mobile_number: beneficiary.mobile_number,
        operator: "Vendor Payment",
        latitude: location?.lat || "",   // ✅ add latitude
        longitude: location?.long || "", // ✅ add longitude
      });
    }
  }, [open, beneficiary, senderId, location, setFormData]);

  // ✅ submit payout
  const handleSubmit = async () => {
    setSubmitting(true);
    setErrors({});
      const payload = {
        ...formData,
        latitude: location?.lat || "",
        longitude: location?.long || "",
      };

      const res = await apiCall("post", ApiEndpoints.PAYOUT, payload);

      if (res) {
        okSuccessToast(res?.message || "Payout successful");
        onClose();
        if (onSuccess) onSuccess();
      } else {
        apiErrorToast(res?.message || "Payout failed");
      }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={`Payout to ${beneficiary?.beneficiary_name || ""}`}
      iconType="payment"
      size="small"
      dividers
      fieldConfig={schema}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading || submitting}
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: onClose,
          disabled: submitting,
        },
        {
          text: submitting ? "Processing..." : "Pay",
          variant: "contained",
          color: "primary",
          onClick: handleSubmit,
          disabled: submitting,
        },
      ]}
    />
  );
};

export default PayoutModal;
