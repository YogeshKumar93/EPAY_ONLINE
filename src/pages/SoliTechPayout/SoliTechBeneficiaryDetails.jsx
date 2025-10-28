import { useContext, useEffect, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { okSuccessToast } from "../../utils/ToastUtil";
import CommonLoader from "../../components/common/CommonLoader";
import { useToast } from "../../utils/ToastContext";
import OTPInput from "react-otp-input";
const SoliTechBeneficiaryDetails = ({
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
  const { location } = useContext(AuthContext);
  const { showToast } = useToast();
  const authCtx = useContext(AuthContext);
  const username = `TRANS${authCtx?.user?.id}`;
  const loadUserProfile = authCtx.loadUserProfile;
  // Fetch purposes on component mount
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
          setPurposes(purposesData);
          if (purposesData.length > 0) setSelectedPurpose(purposesData[0].id);
        } else {
          showToast(error || "Failed to load purposes", "error");
        }
      } catch (err) {
        showToast("Error loading purposes", "error");
      } finally {
        setLoadingPurposes(false);
      }
    };

    fetchPurposes();
  }, []);

  if (!beneficiary) return null;

  const handleProceed = async () => {
    if (!mpin || mpin.length !== 6) {
      showToast("Please enter the 6-digit M-PIN", "error");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    if (!selectedPurpose) {
      showToast("Please select a purpose", "error");
      return;
    }

    setLoading(true);
    try {
      // Find the selected purpose object to get the type
      const selectedPurposeObj = purposes.find(
        (p) => p.id === Number(selectedPurpose)
      );
      const purposeType = selectedPurposeObj?.type || "N/A";

      const payload = {
        mpin: mpin,
        beneficiary_name: beneficiary.beneficiary_name,
        bank_name: beneficiary.bank_name,
        account_number: beneficiary.account_number,
        ifsc_code: beneficiary.ifsc_code,
        operator: 89,
        mop: transferMode,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount: amount,
        soliteck_id: beneficiary.soliteck_id,
        mobile_number: senderMobile,
        purpose: purposeType, // Add purpose type to payload
        purpose_id: selectedPurpose, // Add purpose ID to payload
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.SOLITECH_PAYOUT,
        payload
      );

      if (response) {
        showToast(response?.message || "Payout successful!", "success");

        // Include purpose in the success data
        const payoutData = {
          ...(response?.data || {}),
          purpose: purposeType,
        };
        loadUserProfile();
        onPayoutSuccess(payoutData);
        setAmount("");
        setMpin("");
      } else {
        showToast(error || "Payout failed", "error");
      }
    } catch (err) {
      showToast("An error occurred during payout", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 0, mt: 2, borderRadius: 2, overflow: "hidden" }}>
      <CommonLoader loading={loading} />
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#2275b7",
          color: "#fff",
          textAlign: "center",
          py: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Selected Beneficiary
        </Typography>
      </Box>

      {/* Beneficiary Details */}
      <Box sx={{ mx: 2, my: 2, p: 2, bgcolor: "#f0f8ff", borderRadius: 2 }}>
        {[
          { label: "Name", value: beneficiary.beneficiary_name },
          { label: "Account Number", value: beneficiary.account_number },
          { label: "Bank", value: beneficiary.bank_name },
          { label: "IFSC", value: beneficiary.ifsc_code },
        ].map((item, index) => (
          <Box key={index} display="flex" mb={1}>
            <Typography
              variant="body2"
              fontWeight="500"
              color="#4B5563"
              sx={{ width: "140px", flexShrink: 0 }}
            >
              {item.label}
            </Typography>
            <Typography variant="body2" color="#111827" fontWeight="500">
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Transfer Mode and Purpose Selection */}
      <Box sx={{ px: 2, pt: 1 }} display="flex" gap={3} alignItems="flex-start">
        {/* Transfer Mode */}
        <Box flex={1}>
          <Typography variant="body2" fontWeight="500" mb={1} color="#4B5563">
            Transfer Mode
          </Typography>
          <RadioGroup
            row
            value={transferMode}
            onChange={(e) => setTransferMode(e.target.value)}
          >
            <FormControlLabel
              value="IMPS"
              control={<Radio size="small" />}
              label="IMPS"
            />
            <FormControlLabel
              value="NEFT"
              control={<Radio size="small" />}
              label="NEFT"
            />
          </RadioGroup>
        </Box>

        {/* Purpose Dropdown */}
        <Box flex={1}>
          <Typography variant="body2" fontWeight="500" mb={1} color="#4B5563">
            Purpose
          </Typography>
          <TextField
            select
            size="small"
            fullWidth
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value)}
            disabled={loadingPurposes}
          >
            {loadingPurposes ? (
              <MenuItem value="">
                <em>Loading purposes...</em>
              </MenuItem>
            ) : (
              purposes.map((purpose) => (
                <MenuItem key={purpose.id} value={purpose.id}>
                  {purpose.type}
                </MenuItem>
              ))
            )}
          </TextField>
        </Box>
      </Box>

      {/* Amount Input */}
      <Box sx={{ px: 2, pb: 2 }}>
        <TextField
          label="Amount"
          type="text"
          variant="outlined"
          size="small"
          fullWidth
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            // Allow only numbers
            if (/^\d*$/.test(value)) {
              // Check if amount exceeds remaining limit
              if (
                sender?.rem_limit &&
                parseFloat(value) > parseFloat(sender.rem_limit)
              ) {
                showToast(
                  `Amount exceeds remaining limit of ${sender.rem_limit}`,
                  "warning"
                );
                return;
              }
              setAmount(value);
            }
          }}
          placeholder="Enter amount"
          inputProps={{
            maxLength: 10,
          }}
          sx={{ mt: 2 }}
        />

        {/* M-PIN Input - Show only when amount is entered */}
        {amount && parseFloat(amount) > 0 && (
          <Box mt={2}>
            <Typography variant="body2" fontWeight="500" mb={1} color="#4B5563">
              Enter 6-digit M-PIN
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
                margin: "0 4px",
                fontSize: "18px",
                border: "1px solid #D0D5DD",
                outline: "none",
                borderRadius: "6px",
                textAlign: "center",
                backgroundColor: "#fff",
              }}
              containerStyle={{
                justifyContent: "center",
              }}
            />
          </Box>
        )}

        {/* Proceed Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleProceed}
          disabled={loading || !amount || mpin.length !== 6 || !selectedPurpose}
          sx={{ mt: 2, py: 1 }}
        >
          {loading ? "Processing..." : "Send Money"}
        </Button>
      </Box>
    </Paper>
  );
};

export default SoliTechBeneficiaryDetails;
