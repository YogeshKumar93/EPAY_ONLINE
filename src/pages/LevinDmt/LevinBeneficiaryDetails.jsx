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
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../../utils/ToastUtil";
import AuthContext from "../../contexts/AuthContext";
import OTPInput from "react-otp-input";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../../components/common/CommonModal";
import ResetMpin from "../../components/common/ResetMpin";
import { convertNumberToWordsIndian } from "../../utils/NumberUtil";
import Loader from "../../components/common/Loader";
const LevinBeneficiaryDetails = ({
  open,
  onClose,
  beneficiary,
  senderMobile,
  senderId,
  sender,
  onPayoutSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [mpin, setMpin] = useState("");
  const [transferMode, setTransferMode] = useState("IMPS");
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [loadingPurposes, setLoadingPurposes] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const { location, loadUserProfile } = useContext(AuthContext);
  const { showToast } = useToast();

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
          const data = response?.data || [];
          setPurposes(data);
          if (data.length > 0) setSelectedPurpose(data[0].id);
        } else showToast(error || "Failed to load purposes", "error");
      } catch (err) {
        showToast("Error loading purposes", "error");
      } finally {
        setLoadingPurposes(false);
      }
    };
    fetchPurposes();
  }, []);

  // Step 1: Initiate OTP when amount is entered and proceed clicked
  const handleProceedToOtp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    if (!selectedPurpose) {
      showToast("Please select a purpose", "error");
      return;
    }

    if (
      sender?.rem_limit &&
      parseFloat(amount) > parseFloat(sender.rem_limit)
    ) {
      showToast(
        `Amount exceeds remaining limit of ${sender.rem_limit}`,
        "warning"
      );
      return;
    }

    setOtpLoading(true);
    try {
      const selectedPurposeObj = purposes.find(
        (p) => p.id === Number(selectedPurpose)
      );
      const purposeType = selectedPurposeObj?.type || "N/A";

      const otpPayload = {
        ben_name: beneficiary.beneficiary_name,
        bank_name: beneficiary.bank_name,
        ben_acc: beneficiary.account_number,
        ifsc: beneficiary.ifsc_code,
        operator: 14,
        type: transferMode,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        mobile_number: beneficiary.mobile_number || "",
        purpose: purposeType,
        purpose_id: selectedPurpose,
        sender_mobile: senderMobile,
        sender_id: senderId,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_DMT_TXN_OTP, // First call OTP API
        otpPayload
      );

      if (response) {
        // Store transaction data including the token for final transaction
        setOtpData({
          payload: otpPayload,
          token: response?.data, // This is your "17d7d440-9ff0-4351-b598-9b2e7dd0a812"
          encrypted_data: response?.encrypted_data,
        });
        setShowOtpModal(true);
        showToast(response?.message || "OTP sent successfully", "success");
      } else {
        showToast(error?.message || "Failed to send OTP", "error");
      }
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 2: Final transaction with OTP + MPIN + Token
  const handleFinalTransaction = async () => {
    if (!otp || otp.length !== 6) {
      showToast("Please enter the 6-digit OTP", "error");
      return;
    }

    if (!mpin || mpin.length !== 6) {
      showToast("Please enter the 6-digit M-PIN", "error");
      return;
    }

    setLoading(true);
    try {
      const finalPayload = {
        ...otpData.payload,
        otp: otp, // Include OTP
        mpin: mpin, // Include MPIN
        token: otpData.token, // Include the token from OTP API
        encrypted_data: otpData.encrypted_data,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_DMT_TRANSATION2, // Final transaction API with OTP + MPIN
        finalPayload
      );

      if (response) {
        showToast(response?.message || "Payout successful!", "success");
        loadUserProfile();

        const selectedPurposeObj = purposes.find(
          (p) => p.id === Number(selectedPurpose)
        );
        const purposeType = selectedPurposeObj?.type || "N/A";

        const payoutData = {
          ...(response?.data || {}),
          purpose: purposeType,
        };

        onPayoutSuccess(payoutData);
        setAmount("");
        setMpin("");
        setOtp("");
        setOtpData(null);
        setShowOtpModal(false);
        onClose();
      } else {
        showToast(error?.message || "Payout failed", "error");
      }
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle amount input
  const handleChangeAmount = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Reset states when modal closes
  const handleClose = () => {
    setAmount("");
    setMpin("");
    setOtp("");
    setOtpData(null);
    setShowOtpModal(false);
    onClose();
  };

  // Modal custom content
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
            onChange={(e) => setSelectedPurpose(e.target.value)}
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

      {/* Amount */}
      <TextField
        label="Amount"
        type="text"
        variant="outlined"
        size="small"
        fullWidth
        value={amount}
        onChange={handleChangeAmount}
        placeholder="Enter amount"
      />
    </Box>
  );

  return (
    <>
      <Loader loading={loading || otpLoading}>
        <CommonModal
          open={open}
          onClose={handleClose}
          title="Send Money"
          iconType="info"
          size="small"
          customContent={customContent}
          loading={loading || otpLoading}
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: handleClose,
              disabled: loading || otpLoading,
            },
            {
              text: otpLoading ? "Sending OTP..." : "Proceed",
              variant: "contained",
              color: "success",
              onClick: handleProceedToOtp,
              disabled: loading || otpLoading || !amount || !selectedPurpose,
            },
          ]}
        />
      </Loader>

      {/* OTP + MPIN Modal */}
      {showOtpModal && (
        <CommonModal
          open={showOtpModal}
          onClose={() => {
            setShowOtpModal(false);
            setOtp("");
            setMpin("");
          }}
          title="Enter OTP & MPIN"
          iconType="info"
          size="small"
          loading={loading}
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: () => {
                setShowOtpModal(false);
                setOtp("");
                setMpin("");
              },
              disabled: loading,
            },
            {
              text: loading ? "Processing..." : "Complete Transaction",
              variant: "contained",
              color: "primary",
              onClick: handleFinalTransaction,
              disabled: loading,
            },
          ]}
        >
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Enter the 6-digit OTP sent to your registered mobile number and
              your 6-digit MPIN
            </Typography>

            {/* OTP Input */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                OTP
              </Typography>
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                inputType="number"
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

            {/* MPIN Input */}
            <Box>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                MPIN
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
          </Box>
        </CommonModal>
      )}
    </>
  );
};
export default LevinBeneficiaryDetails;
