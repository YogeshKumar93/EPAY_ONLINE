import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import OTPInput from "react-otp-input";
import { useToast } from "../utils/ToastContext";
import CommonModal from "../components/common/CommonModal";
import { convertNumberToWordsIndian } from "../utils/NumberUtil";
import Loader from "../components/common/Loader";

const LevinUpiBeneficiaryDetails = ({
  open,
  onClose,
  beneficiary,
  senderMobile,
  senderId,
  sender,
  onLevinSuccess,
}) => {
  const [transferMode, setTransferMode] = useState("IMPS");
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [uuid, setUuid] = useState(null);
  const { location, getUuid } = useContext(AuthContext);
  const { showToast } = useToast();
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [loadingPurposes, setLoadingPurposes] = useState(false);

  // 🔹 For M-PIN modal
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const [mpin, setMpin] = useState("");

  if (!beneficiary) return null;

  const amountInWords = amount
    ? `${convertNumberToWordsIndian(amount).replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )} Only`
    : "";

  // 🔹 Fetch purposes on mount
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
        } else showToast(error);
      } catch (err) {
        showToast(err);
      } finally {
        setLoadingPurposes(false);
      }
    };
    fetchPurposes();
  }, []);

  // 🔹 When M-PIN modal opens, call getUuid()
  useEffect(() => {
    if (mpinModalOpen) {
      const fetchUuid = async () => {
        try {
          const { error, response } = await getUuid();
          if (response) {
            setUuid(response);
          } else if (error) {
            showToast(error?.message || "Failed to generate UUID", "error");
            setMpinModalOpen(false);
          }
        } catch (err) {
          showToast("Error while generating UUID", "error");
          setMpinModalOpen(false);
        }
      };
      fetchUuid();
    }
  }, [mpinModalOpen]);

  // 🔹 Main Proceed opens M-PIN modal
  const handleOpenMpinModal = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }
    setMpinModalOpen(true);
  };

  // 🔹 Actual proceed logic
  const handleProceed = async () => {
    if (!mpin || mpin.length !== 6) {
      return showToast("Please enter the 6-digit M-PIN", "error");
    }
    setSubmitting(true);
    setLoading(true);
    try {
      const selectedPurposeType =
        purposes.find((p) => p.id === Number(selectedPurpose))?.type || "N/A";

      const payload = {
        sender_id: senderId,
        beneficiary_id: beneficiary.id,
        beneficiary_name: beneficiary.beneficiary_name,
        account_number: beneficiary.account_number,
        bank_name: beneficiary.bank_name,
        mobile_number: sender.mobile_number,
        operator: 20,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        // mop: transferMode,
        mpin,
        purpose: selectedPurposeType,
        client_ref: uuid,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_UPI_TRANSFER,
        payload
      );

      if (response) {
        showToast(response?.message || "Payout successful!", "success");
        const payoutData = {
          ...(response || {}),
          beneficiary,
          senderMobile,
          purpose: selectedPurposeType,
          transferMode,
        };
        onLevinSuccess(payoutData);
        setAmount("");
        setMpin("");
        onClose();
        setMpinModalOpen(false);
      } else {
        showToast(error?.message || "errror", "error");
        setMpinModalOpen(false);
        setMpin("");
      }
    } catch (err) {
      showToast(err);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (parseFloat(value) > parseFloat(sender?.rem_limit || 0)) {
        showToast("Exceeds Rem Limit", "error");
        return;
      }
      setAmount(value);
    }
  };

  // 🔹 Content for Main Modal
  const customContent = (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box sx={{ bgcolor: "#f0f8ff", p: 2, borderRadius: 2 }}>
        {[
          { label: "Name", value: beneficiary.beneficiary_name },
          { label: "VPA", value: beneficiary.account_number },
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
          fullWidth
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

      <TextField
        label="Amount"
        type="text"
        variant="outlined"
        size="small"
        fullWidth
        value={amount}
        onChange={handleChange}
      />
      {amount && (
        <Typography variant="body2" sx={{ color: "#555", fontWeight: 500 }}>
          {amountInWords}
        </Typography>
      )}
    </Box>
  );

  // 🔹 Content for M-PIN Modal
  const mpinContent = (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="body2">Enter your 6-digit M-PIN</Typography>
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
  );

  return (
    <Loader loading={submitting || loading}>
      {/* 🔹 Main Modal */}
      <CommonModal
        open={open}
        onClose={onClose}
        title="Send Money"
        iconType="info"
        size="small"
        customContent={customContent}
        loading={loading || submitting}
        footerButtons={[
          { text: "Cancel", variant: "outlined", onClick: onClose },
          {
            text: "Proceed",
            variant: "contained",
            color: "success",
            onClick: handleOpenMpinModal,
            disabled: loading || !amount,
          },
        ]}
      />

      {/* 🔹 M-PIN Modal */}
      <CommonModal
        open={mpinModalOpen}
        onClose={() => setMpinModalOpen(false)}
        title="Enter M-PIN"
        iconType="lock"
        size="small"
        customContent={mpinContent}
        loading={loading || submitting}
        footerButtons={[
          {
            text: "Cancel",
            variant: "outlined",
            onClick: () => setMpinModalOpen(false),
          },
          {
            text: loading ? "Processing..." : "Confirm",
            variant: "contained",
            color: "success",
            onClick: handleProceed,
            disabled: loading || mpin.length !== 6,
          },
        ]}
      />
    </Loader>
  );
};

export default LevinUpiBeneficiaryDetails;
