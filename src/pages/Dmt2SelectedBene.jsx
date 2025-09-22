import { useState, useContext } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import OTPInput from "react-otp-input";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";
import ResetMpin from "../components/common/ResetMpin";
import { showSuccessToast } from "../components/common/ShowSuccessToast";
import CommonModal from "../components/common/CommonModal";

const Dmt2SelectedBene = ({
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
  const { showToast } = useToast();

  const [transferMode, setTransferMode] = useState("IMPS");
  const [amount, setAmount] = useState("");
  const [otpRef, setOtpRef] = useState(null);
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);

  if (!beneficiary) return null;

  const username = `GURU1${user?.id}`;

  // --- API Handlers ---
  const handleGetOtp = async () => {
    if (!amount || parseFloat(amount) <= 0)
      return apiErrorToast("Enter a valid amount");

    setLoading(true);
    try {
      const payload = {
        referenceKey,
        beneficiary_id: beneficiary.id,
        amount,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        type: transferMode,
        number: senderMobile,
        ben_id: beneficiary?.bene_id,
      };
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.OTP_DMT2,
        payload
      );
      if (error) apiErrorToast(error);
      else {
        showToast("OTP sent successfully!", "success");
        setOtpRef(response?.data || null);
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
        beneficiary_id: beneficiary.id,
        amount,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        type: transferMode,
        number: senderMobile,
        ben_id: beneficiary?.bene_id,
      };
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.OTP_DMT2,
        payload
      );
      if (error) apiErrorToast(error);
      else {
        showToast("OTP resent successfully!", "success");
        setOtpRef(response?.data || null);
        setOtp("");
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setResendLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!otp || otp.length !== 4) return apiErrorToast("Enter the 4-digit OTP");
    if (!mpin || mpin.length !== 6)
      return apiErrorToast("Enter the 6-digit M-PIN");

    setLoading(true);
    try {
      const payload = {
        sender_id: senderId,
        ben_id: beneficiary?.bene_id,
        ben_name: beneficiary?.beneficiary_name,
        ben_acc: beneficiary?.account_number,
        ifsc: beneficiary?.ifsc_code,
        bank_name: beneficiary?.bank_name,
        number: sender.mobile,
        operator: 14,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        otp,
        stateresp: otpRef,
        type: transferMode,
        mpin,
        pf: "web",
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.DMT2_TXN,
        payload
      );
      if (response) {
        const txnDetails = {
          txnID: response?.data,
          amount,
          transferMode,
          senderMobile,
          beneficiary: {
            name: beneficiary.beneficiary_name,
            account: beneficiary.account_number,
            bank: beneficiary.bank_name,
            ifsc: beneficiary.ifsc_code,
            mobile: beneficiary.mobile_number,
          },
          date: new Date().toLocaleString(),
        };

        showSuccessToast({
          txnID: response?.data,
          message: response?.message,
          redirectUrl: "/print-dmt",
        });
        sessionStorage.setItem("txnData", JSON.stringify(txnDetails));
        setAmount("");
        setOtp("");
        setMpin("");
        setOtpRef(null);
        onClose();
      } else {
        showToast(error?.message, "error");
      }
    } catch (err) {
      apiErrorToast(err?.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Custom Content ---
  const customContent = (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Beneficiary Info */}
      <Box sx={{ bgcolor: "#f0f8ff", p: 2, borderRadius: 2 }}>
        {[
          { label: "Name", value: beneficiary.beneficiary_name },
          { label: "Account Number", value: beneficiary.account_number },
          { label: "Bank", value: beneficiary.bank_name },
          { label: "IFSC", value: beneficiary.ifsc_code },
        ].map((item, idx) => (
          <Box key={idx} display="flex" mb={1}>
            <Typography
              sx={{ width: "150px", fontWeight: 500, fontSize: "14px" }}
            >
              {item.label}:
            </Typography>
            <Typography sx={{ fontSize: "12px" }}>{item.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Transfer Mode */}
      <Box textAlign="center">
        <Typography variant="body2" fontWeight="bold" mb={0.5}>
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
            const limit = parseFloat(sender?.limit || 0);
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
                  sx={{
                    backgroundColor: "#5c3ac8",
                    minWidth: 60,
                    px: 1,
                    py: 0.5,
                  }}
                >
                  {loading ? "..." : "Get OTP"}
                </Button>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {/* OTP Input */}
          <Box>
            <Typography variant="body2" mb={0.5} sx={{ px: 2 }}>
              Enter OTP
            </Typography>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
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
              sx={{ mt: 1 }}
              onClick={handleResendOtp}
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </Button>
          </Box>

          {/* M-PIN Input */}
          <Box>
            <Typography variant="body2" mb={0.5} sx={{ px: 2 }}>
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
              sx={{ mt: 1 }}
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
        size="small"
        iconType="info"
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
            disabled: loading || !otpRef,
          },
        ]}
      />

      {/* ✅ Reset MPIN Modal */}
      <ResetMpin
        open={openResetModal}
        onClose={() => setOpenResetModal(false)}
        username={username}
      />
    </>
  );
};

export default Dmt2SelectedBene;
