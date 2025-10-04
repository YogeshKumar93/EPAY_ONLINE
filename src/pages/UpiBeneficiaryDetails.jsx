import React, { useContext, useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import OTPInput from "react-otp-input";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";
import ResetMpin from "../components/common/ResetMpin";
import CommonModal from "../components/common/CommonModal";

const UpiBeneficiaryDetails = ({
  open,
  onClose,
  beneficiary,
  senderMobile,
  senderId,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpRef, setOtpRef] = useState(null);
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [loadingPurposes, setLoadingPurposes] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);

  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const { location } = useContext(AuthContext);
  const { showToast } = useToast();

  if (!beneficiary) return null;
  const username = `GURU1${user?.id}`;

  useEffect(() => {
    const fetchPurposes = async () => {
      setLoadingPurposes(true);
      try {
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_PURPOSES
        );
        if (error) apiErrorToast(error);
        else {
          const purposesData = response?.data || [];
          setPurposes(purposesData);
          if (purposesData.length > 0) setSelectedPurpose(purposesData[0].id);
        }
      } catch (err) {
        apiErrorToast(err);
      } finally {
        setLoadingPurposes(false);
      }
    };
    fetchPurposes();
  }, []);

  const handleProceed = async () => {
    if (!mpin || mpin.length !== 6)
      return apiErrorToast("Please enter the 6-digit M-PIN");

    setLoading(true);
    try {
      const payload = {
        sender_id: senderId,
        beneficiary_id: beneficiary.id,
        beneficiary_name: beneficiary.beneficiary_name,
        account_number: beneficiary.account_number,
        ifsc_code: beneficiary.ifsc_code,
        bank_name: beneficiary.bank_name,
        mobile_number: beneficiary.mobile_number,
        operator: 12,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        mop: "UPI",
        mpin,
        purpose_id: selectedPurpose,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.PAYOUT,
        payload
      );
      if (response) {
        okSuccessToast("Payout successful!");
        setAmount("");
        setOtp("");
        setMpin("");
        setOtpRef(null);
        onClose();
      } else {
        showToast(error?.message || "Something went wrong", "error");
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
    }
  };

  const customContent = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ bgcolor: "#f0f8ff", p: 2, borderRadius: 2 }}>
        <Box display="flex" mb={1}>
          <Typography variant="body2" fontWeight={500} sx={{ width: "120px" }}>
            Name
          </Typography>
          <Typography variant="body2">
            {beneficiary.beneficiary_name}
          </Typography>
        </Box>
        <Box display="flex">
          <Typography variant="body2" fontWeight={500} sx={{ width: "120px" }}>
            VPA
          </Typography>
          <Typography variant="body2">{beneficiary.account_number}</Typography>
        </Box>
      </Box>

      <TextField
        label="Purpose"
        select
        size="small"
        value={selectedPurpose}
        onChange={(e) => setSelectedPurpose(e.target.value)}
        SelectProps={{ native: true }}
        fullWidth
      >
        {loadingPurposes ? (
          <option>Loading...</option>
        ) : (
          purposes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.type}
            </option>
          ))
        )}
      </TextField>

      <TextField
        label="Amount"
        type="number"
        size="small"
        fullWidth
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <Box>
        <Typography variant="body2" mb={0.5}>
          Enter M-PIN
        </Typography>
        <OTPInput
          value={mpin}
          onChange={setMpin}
          numInputs={6}
          inputType="password"
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            width: "40px",
            height: "40px",
            margin: "0 5px",
            fontSize: "18px",
            border: "1px solid #D0D5DD",
            borderRadius: "6px",
            textAlign: "center",
          }}
        />
        {/* <Button variant="text" size="small" onClick={() => setOpenResetModal(true)}>Reset M-PIN</Button> */}
      </Box>
    </Box>
  );

  return (
    <>
      <CommonModal
        open={open}
        onClose={onClose}
        title="Send Money"
        iconType="info"
        size="small"
        customContent={customContent}
        footerButtons={[
          {
            text: "Cancel",
            variant: "outlined",
            onClick: onClose,
            disabled: loading,
          },
          {
            text: loading ? "Processing..." : "Proceed",
            variant: "contained",
            color: "success",
            onClick: handleProceed,
            disabled: loading,
          },
        ]}
      />

      {/* <ResetMpin
        open={openResetModal}
        onClose={() => setOpenResetModal(false)}
        username={username}
      /> */}
    </>
  );
};

export default UpiBeneficiaryDetails;
