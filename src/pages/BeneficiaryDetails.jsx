import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  InputAdornment,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import OTPInput from "react-otp-input";
import { useToast } from "../utils/ToastContext";
import CommonModal from "../components/common/CommonModal";
import ResetMpin from "../components/common/ResetMpin";

const BeneficiaryDetails = ({
  open,
  onClose,
  beneficiary,
  senderMobile,
  senderId,
  sender,
  onPayoutSuccess,
}) => {
  const [transferMode, setTransferMode] = useState("IMPS");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpRef, setOtpRef] = useState(null);
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const { location } = useContext(AuthContext);
  const { showToast } = useToast();
  const [resendLoading, setResendLoading] = useState(false);
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [loadingPurposes, setLoadingPurposes] = useState(false);
  const [resetMpinModalOpen, setResetMpinModalOpen] = useState(false);

  if (!beneficiary) return null;

  useEffect(() => {
    const fetchPurposes = async () => {
      setLoadingPurposes(true);
      try {
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_PURPOSES
        );
        if (response) {
          const purposesData = response?.data || [];
          console.log("purposesData", purposesData);

          setPurposes(purposesData);
          if (purposesData.length > 0) setSelectedPurpose(purposesData[0].id);
        } else apiErrorToast(error);
      } catch (err) {
        apiErrorToast(err);
      } finally {
        setLoadingPurposes(false);
      }
    };
    fetchPurposes();
  }, []);
  const handleProceed = async () => {
    // if (!otp || otp.length !== 6)
    //   return apiErrorToast("Please enter the 6-digit OTP");
    if (!mpin || mpin.length !== 6) {
      return showToast("Please enter the 6-digit M-PIN", "error");
    }

    setLoading(true);
    try {
      const selectedPurposeType =
        purposes.find((p) => p.id === Number(selectedPurpose))?.type || "N/A";

      console.log("Selected Purpose Type:", selectedPurposeType);

      const payload = {
        sender_id: senderId,
        beneficiary_id: beneficiary.id,
        beneficiary_name: beneficiary.beneficiary_name,
        account_number: beneficiary.account_number,
        ifsc_code: beneficiary.ifsc_code,
        bank_name: beneficiary.bank_name,
        mobile_number: sender.mobile_number,
        operator: 11,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        // otp,
        // otp_ref: otpRef,
        mop: transferMode,
        mpin,
        purpose: selectedPurposeType, // ✅ send type here
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.PAYOUT,
        payload
      );
      console.log("PAYOUT RESPONSE:", response);
      if (response) {
        showToast(response?.message || "Payout successful!", "success");

        const purposeType =
          purposes.find((p) => p.id === selectedPurpose)?.type || "N/A";

        const payoutData = {
          ...(response?.data || {}),
          purpose: selectedPurposeType, // ✅ send type to parent
        };

        console.log("Purpose being sent to parent:", purposeType); // ✅ log purpose
        console.log("DATA SENT TO PARENT:", payoutData);

        onPayoutSuccess(payoutData); // send to parent
        setAmount("");
        setOtp("");
        setMpin("");
        setOtpRef(null);
        onClose();
      } else {
        showToast(error?.message || "Payout unsuccessfull", "error");
      }
    } catch (err) {
      showToast(err);
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
        ].map((item, index) => (
          <Box key={index} display="flex" mb={1}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ width: "160px" }}
            >
              {item.label}
            </Typography>
            <Typography variant="body2">{item.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Transfer Mode + Purpose */}
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Box>
          <Typography variant="body2" fontWeight="bold" mb={0.5}>
            Transfer Mode
          </Typography>
          <RadioGroup
            row
            value={transferMode}
            onChange={(e) => setTransferMode(e.target.value)}
          >
            <FormControlLabel value="IMPS" control={<Radio />} label="IMPS" />
            <FormControlLabel value="NEFT" control={<Radio />} label="NEFT" />
          </RadioGroup>
        </Box>

        <Box>
          <Typography variant="body2" fontWeight="bold" mb={0.5}>
            Purpose
          </Typography>
          <TextField
            select
            size="small"
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(Number(e.target.value))}
            sx={{ minWidth: "180px" }}
            SelectProps={{ native: true }}
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
        </Box>
      </Box>

      {/* Amount with OTP button */}
      <TextField
        label="Amount"
        type="text"
        variant="outlined"
        size="small"
        fullWidth
        value={amount}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            if (parseFloat(value) > parseFloat(sender?.rem_limit || 0)) {
              apiErrorToast("Exceeds Rem Limit");
              return;
            }
            setAmount(value);
          }
        }}
        InputProps={
          {
            // endAdornment: (
            //   <InputAdornment position="end">
            //     <Button
            //       variant="contained"
            //       size="small"
            //       onClick={handleGetOtp}
            //       disabled={loading}
            //       sx={{ backgroundColor: "#5c3ac8" }}
            //     >
            //       {loading ? "Sending..." : "Get OTP"}
            //     </Button>
            //   </InputAdornment>
            // ),
          }
        }
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
      </Box>
      {/* <Box sx={{ display: "flex", justifyContent: "center", ml: 32 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: "11px" }}
            onClick={() => setResetMpinModalOpen(true)}
          >
            Reset MPIN
          </Button>
        </Box>
        {resetMpinModalOpen && (
          <ResetMpin
            open={resetMpinModalOpen}
            onClose={() => setResetMpinModalOpen(false)}
            username={username}
          />
        )} */}
    </Box>
  );

  return (
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
  );
};

export default BeneficiaryDetails;
