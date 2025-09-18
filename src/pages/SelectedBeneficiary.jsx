import { useState, useContext } from "react";
import {
  Paper,
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
import {
  okSuccessToast,
  apiErrorToast,
  okSuccessToastAlt,
} from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";
import ResetMpin from "../components/common/ResetMpin";
import { showSuccessToast } from "../components/common/ShowSuccessToast";
import { useNavigate } from "react-router-dom";

const SelectedBeneficiary = ({
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
  console.log("sender linit ", sender.limitAvailable);
  const [openResetModal, setOpenResetModal] = useState(false);

  const username = `GURU1${user?.id}`;
  const navigate = useNavigate();

  if (!beneficiary) return null;

  const handleGetOtp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      apiErrorToast("Enter a valid amount");
      return;
    }
    console.log("referenceKey", referenceKey);

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
        referenceKey: referenceKey, // still pass original referenceKey
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
        setOtpRef(response?.data?.referenceKey || null); // 🔑 Save NEW referenceKey
        setOtp(""); // clear old OTP
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
    try {
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
        const txnDetails = {
          txnID: response?.data?.rrn,
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

        // okSuccessToastAlt(txnDetails); // pass full details
        showSuccessToast({
          txnID: response?.data?.rrn,
          message: response?.message,
        });
        sessionStorage.setItem("txnData", JSON.stringify(txnDetails));

// Open PrintDmt in a new tab
window.open("/print-dmt", "_blank");

          setAmount("");
        setOtp("");
        setMpin("");
        setOtpRef(null);
      } else {
        const txnDetails = {
          txnID: response?.message,
          amount,
          transferMode,
          beneficiary: {
            name: beneficiary.beneficiary_name,
            account: beneficiary.account_number,
            bank: beneficiary.bank_name,
            ifsc: beneficiary.ifsc_code,
          },
          date: new Date().toLocaleString(),
        };
        okSuccessToastAlt(txnDetails);
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 0, mt: 2, borderRadius: 2, overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#0078B6",
          color: "#fff",
          textAlign: "center",
          py: 1,
          px: 2,
        }}
      >
        {" "}
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="#fff"
          sx={{ textAlign: "left" }}
        >
          Selected Beneficiary
        </Typography>
      </Box>

      {/* Beneficiary Details */}
      <Box sx={{ mx: 2, my: 2, p: 1, bgcolor: "#f0f8ff", borderRadius: 2 }}>
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
      <Box textAlign="center" mb={0}>
        <Typography variant="body2" fontWeight="bold" mb={0}>
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
          variant="outlined"
          size="small"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            const limit = parseFloat(sender?.limitAvailable || 0);

            // ✅ Block invalid or over-limit values
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
                    minWidth: "60px",
                    px: 1,
                    py: 0.5,
                    fontSize: "0.75rem",
                    borderRadius: 1,
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
          {/* OTP */}
          <Box>
            <Typography variant="body2" mb={0.5} sx={{ px: 2 }}>
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
              sx={{ mt: 1 }}
              onClick={handleResendOtp}
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </Button>
          </Box>

          {/* M-PIN */}
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
              onClick={() => setOpenResetModal(true)} // ✅ open modal
            >
              Reset Mpin
            </Button>
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
      {/* ✅ Reset MPIN Modal */}
      <ResetMpin
        open={openResetModal}
        onClose={() => setOpenResetModal(false)}
        username={username}
      />
    </Paper>
  );
};

export default SelectedBeneficiary;
