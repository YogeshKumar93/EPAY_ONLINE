import { useState, useContext } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import OTPInput from "react-otp-input";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";
import ResetMpin from "../components/common/ResetMpin";
import { showSuccessToast } from "../components/common/ShowSuccessToast";
import { useNavigate } from "react-router-dom";
import CommonModal from "../components/common/CommonModal";

const SelectedBeneficiary = ({
  open,
  onClose,
  beneficiary,
  senderId,
  senderMobile,
  referenceKey,
  sender,
}) => {
  const { location } = useContext(AuthContext);
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [transferMode, setTransferMode] = useState("IMPS");
  const [amount, setAmount] = useState("");
  const [otpRef, setOtpRef] = useState(null);
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [resendLoading, setResendLoading] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);

  const username = `GURU1${user?.id}`;
  const navigate = useNavigate();

  if (!beneficiary) return null;

  const handleGetOtp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      apiErrorToast("Enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        referenceKey: referenceKey,
        number: senderMobile,
        beneficiary_id: beneficiary.id,
        amount,
      };
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.OTP_DMT1_BENEFICIARY,
        payload
      );
      if (error) apiErrorToast(error);
      else {
        showToast("OTP sent successfully!", "success");
        setOtpRef(response?.data?.referenceKey || null);
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const payload = {
        referenceKey,
        number: senderMobile,
        beneficiary_id: beneficiary.id,
        amount,
      };
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.OTP_DMT1_BENEFICIARY,
        payload
      );
      if (error) apiErrorToast(error);
      else {
        showToast("OTP resent successfully!", "success");
        setOtpRef(response?.data?.referenceKey || null);
        setOtp("");
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setResendLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!otp || otp.length !== 6) {
      apiErrorToast("Enter the 6-digit OTP");
      return;
    }
    if (!mpin || mpin.length !== 6) {
      apiErrorToast("Enter the 6-digit M-PIN");
      return;
    }

    setLoading(true);

    const payload = {
      sender_id: senderId,
      ben_id: beneficiary.bene_id,
      ben_name: beneficiary.beneficiary_name,
      ben_acc: beneficiary.account_number,
      ifsc: beneficiary.ifsc_code,
      bank_name: beneficiary.bank_name,
      mobile_number: beneficiary.mobile_number,
      operator: 13,
      latitude: location?.lat || "",
      longitude: location?.long || "",
      amount,
      otp,
      referenceKey: otpRef,
      type: transferMode,
      mpin,
      pf: "web",
    };

    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.DMT1_TXN,
      payload
    );
    if (response) {
      showSuccessToast({
        txnID: response?.data?.rrn,
        message: response?.message,
        redirectUrl: "/print-dmt",
      });
      setAmount("");
      setOtp("");
      setMpin("");
      setOtpRef(null);
      onClose();
    } else {
      showToast(error?.message, "error");
    }
  };

  const customContent = (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Beneficiary Details */}
      <Box sx={{ bgcolor: "#f0f8ff", p: 2, borderRadius: 2 }}>
        {[
          { label: "Name", value: beneficiary.beneficiary_name },
          { label: "Account Number", value: beneficiary.account_number },
          { label: "Bank", value: beneficiary.ifsc_code },
          { label: "IFSC", value: beneficiary.ifsc_code },
        ].map((item, idx) => (
          <Box key={idx} display="flex" mb={1}>
            <Typography sx={{ width: "150px", fontWeight: 500 }}>
              {item.label}:
            </Typography>
            <Typography>{item.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Transfer Mode */}
      <Box textAlign="center">
        <Typography variant="body2" fontWeight="bold">
          Transfer Mode
        </Typography>
        <RadioGroup
          row
          value={transferMode}
          onChange={(e) => setTransferMode(e.target.value)}
          sx={{ justifyContent: "center" }}
        >
          <FormControlLabel value="IMPS" control={<Radio />} label="IMPS" />
          <FormControlLabel value="NEFT" control={<Radio />} label="NEFT" />
        </RadioGroup>
      </Box>

      {/* Amount / OTP / M-PIN */}
      {!otpRef ? (
        <TextField
          label="Amount"
          type="number"
          fullWidth
          size="small"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            const limit = parseFloat(sender?.limitAvailable || 0);
            if (parseFloat(value) > limit) {
              apiErrorToast(`Amount cannot exceed available limit: ${limit}`);
              return;
            }
            setAmount(value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleGetOtp}
                  disabled={loading}
                  sx={{ backgroundColor: "#5c3ac8" }}
                >
                  {loading ? "..." : "Get OTP"}
                </Button>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography variant="body2" mb={0.5}>
              Enter OTP
            </Typography>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType="tel"
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: 40,
                height: 40,
                margin: "0 5px",
                fontSize: 18,
                border: "1px solid #D0D5DD",
                borderRadius: 6,
                textAlign: "center",
              }}
            />
            <Button
              variant="text"
              size="small"
              onClick={handleResendOtp}
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </Button>
          </Box>

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
                width: 40,
                height: 40,
                margin: "0 5px",
                fontSize: 18,
                border: "1px solid #D0D5DD",
                borderRadius: 6,
                textAlign: "center",
              }}
            />
            <Button
              variant="text"
              size="small"
              onClick={() => setOpenResetModal(true)}
            >
              Reset M-PIN
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <CommonModal
        open={open}
        onClose={onClose}
        title="Selected Beneficiary"
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

      <ResetMpin
        open={openResetModal}
        onClose={() => setOpenResetModal(false)}
        username={username}
      />
    </>
  );
};

export default SelectedBeneficiary;
