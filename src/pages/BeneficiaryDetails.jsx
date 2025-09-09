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

const BeneficiaryDetails = ({ beneficiary, senderMobile, senderId }) => {
  const [transferMode, setTransferMode] = useState("IMPS");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpRef, setOtpRef] = useState(null);
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const { location } = useContext(AuthContext);

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
        okSuccessToast("OTP sent successfully!");
        setOtpRef(response?.data?.otp_ref || null);
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
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
        operator: 11, // keep as you set
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        otp,
        otp_ref: otpRef,
        mop: transferMode,
        mpin,
      };

      const { error, response } = await apiCall("post", ApiEndpoints.PAYOUT, payload);

      if (response) {
        okSuccessToast("Payout successful!");
        setAmount("");
        setOtp("");
        setMpin("");
        setOtpRef(null);
      } else {
        apiErrorToast(error || "Something went wrong");
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Paper sx={{ p: 2, mt: 2, borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
        Selected Beneficiary
      </Typography>
      <Typography variant="body2">Name: {beneficiary.beneficiary_name}</Typography>
      <Typography variant="body2">Account Number: {beneficiary.account_number}</Typography>
      <Typography variant="body2">Bank: {beneficiary.bank_name}</Typography>
      <Typography variant="body2">IFSC: {beneficiary.ifsc_code}</Typography>

      <Box mt={2}>
        <Typography variant="body2" fontWeight="medium" mb={0.5}>
          Transfer Mode
        </Typography>
        <RadioGroup row value={transferMode} onChange={(e) => setTransferMode(e.target.value)}>
          <FormControlLabel value="IMPS" control={<Radio />} label="IMPS" />
          <FormControlLabel value="NEFT" control={<Radio />} label="NEFT" />
        </RadioGroup>
      </Box>

      {!otpRef && (
        <Box mt={2}>
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button variant="contained" size="small" onClick={handleGetOtp} disabled={loading}>
                    {loading ? "Sending..." : "Get OTP"}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {otpRef && (
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {/* OTP (visible digits) */}
          <Box>
            <Typography variant="body2" mb={0.5}>
              Enter OTP
            </Typography>
            <OTPInput
  value={otp}
  onChange={setOtp}
  numInputs={6}
  inputType="tel"
                isInputSecure={true}
              renderInput={(props) => <input {...props} />}
inputStyle={{
                width: "40px",
                height: "40px",
                margin: "0 5px",
                fontSize: "18px",
                borderBottom: "2px solid #000",
                outline: "none",
                textAlign: "center",
              }}
              />

          </Box>

          {/* M-PIN (masked) */}
          <Box>
            <Typography variant="body2" mb={0.5}>
              Enter M-PIN
            </Typography>
        
<OTPInput
  value={mpin}
  onChange={setMpin}
  numInputs={6}
  inputType="password"
                isInputSecure={true}
              renderInput={(props) => <input {...props} />}
inputStyle={{
                width: "40px",
                height: "40px",
                margin: "0 5px",
                fontSize: "18px",
                borderBottom: "2px solid #000",
                outline: "none",
                textAlign: "center",
              }}/>
          </Box>

          <Button variant="contained" color="success" onClick={handleProceed} disabled={loading}>
            {loading ? "Processing..." : "Proceed"}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default BeneficiaryDetails;