import { useContext, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import OTPInput from "react-otp-input";
import { useToast } from "../utils/ToastContext";

const BeneficiaryDetails = ({ beneficiary, senderMobile, senderId ,sender}) => {
  const [transferMode, setTransferMode] = useState("IMPS");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpRef, setOtpRef] = useState(null);
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const { location } = useContext(AuthContext);
  const { showToast } = useToast();
  const [resendLoading, setResendLoading] = useState(false);

// console.log("sender rem_limit",sender.rem_limit);

  if (!beneficiary) return null;

  const handleGetOtp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      apiErrorToast("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        mobile_number: senderMobile,
        beneficiary_id: beneficiary.id,
        amount,
      };
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.PAYOUT_OTP,
        payload
      );
      if (error) {
        apiErrorToast(error);
      } else {
        showToast("OTP sent successfully!", "success");
        setOtpRef(response?.data?.otp_ref || null);
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
      mobile_number: senderMobile,
      beneficiary_id: beneficiary.id,
      amount,
    };
    const { error, response } = await apiCall("post", ApiEndpoints.PAYOUT_OTP, payload);

    if (error) {
      apiErrorToast(error);
    } else {
      showToast("OTP resent successfully!", "success");
      setOtpRef(response?.data?.otp_ref || null); // 🔑 update new reference
      setOtp(""); // clear old OTP input
    }
  } catch (err) {
    apiErrorToast(err);
  } finally {
    setResendLoading(false);
  }
};

  const handleProceed = async () => {
    if (!otp || otp.length !== 6) {
      apiErrorToast("Please enter the 6-digit OTP");
      return;
    }
    if (!mpin || mpin.length !== 6) {
      apiErrorToast("Please enter the 6-digit M-PIN");
      return;
    }

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
        operator: 11,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        otp,
        otp_ref: otpRef,
        mop: transferMode,
        mpin,
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
} else {
  apiErrorToast(error?.message);
}


    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
    }
  };
 
  // --- UI Section ---
  return (
    <Paper sx={{ p: 0, mt: 2, borderRadius: 2, overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#0078B6",
          color: "#fff",
          textAlign: "center",
          py: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Selected Beneficiary
        </Typography>
      </Box>{/* Beneficiary Details */}
<Box sx={{ mx: 2, my: 2, p: 2, bgcolor: "#f0f8ff", borderRadius: 2 }}>
  {[
    { label: "Name", value: beneficiary.beneficiary_name },
    { label: "Account Number", value: beneficiary.account_number },
    { label: "Bank", value: beneficiary.bank_name },
    { label: "IFSC", value: beneficiary.ifsc_code },
  ].map((item, index) => (
    <Box key={index} display="flex" mb={1}>
      {/* Label column with fixed width */}
      <Typography
        variant="body2"
        fontWeight="500"
        color="#4B5563"
        sx={{ width: "190px", flexShrink: 0 }}
      >
        {item.label}
      </Typography>

      {/* Value always starts aligned */}
      <Typography variant="body2" color="#111827">
        {item.value}
      </Typography>
    </Box>
  ))}
</Box>



      {/* Transfer Mode */}
      <Box mt={2} textAlign="center">
        <Typography variant="body2" fontWeight="bold" mb={0.5} color="#4B5563">
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

      {/* Amount + OTP / M-PIN */}
      {!otpRef ? (
        <Box mt={2} px={2} pb={2}>
      <TextField
  label="Amount"
  type="number"
  variant="outlined"
  size="small"
  fullWidth
  value={amount}
  onChange={(e) => {
    const value = e.target.value;
    // ✅ prevent exceeding rem_limit
    if (parseFloat(value) > parseFloat(sender?.rem_limit || 0)) {
      apiErrorToast(`Exceeds Rem Limit`);
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
        >
          {loading ? "Sending..." : "Get OTP"}
        </Button>
      </InputAdornment>
    ),
  }}
/>

        </Box>
      ) : (
        <Box mt={2} px={2} pb={2} display="flex" flexDirection="column" gap={2}>
          {/* OTP Input */}
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
    width: "40px",
    height: "40px",
    margin: "0 5px",
    fontSize: "18px",
    border: "1px solid #D0D5DD", // ✅ uniform border
    borderRadius: "6px",          // optional for rounded look
    outline: "none",
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
    border: "1px solid #D0D5DD", // ✅ uniform border
                outline: "none",
                borderRadius:"6px",
                textAlign: "center",
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="success"
            onClick={handleProceed}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed"}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default BeneficiaryDetails;
