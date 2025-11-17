import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";
import CommonModal from "../components/common/CommonModal";
import OTPInput from "react-otp-input";
import Loader from "../components/common/Loader";
import { convertNumberToWordsIndian } from "../utils/NumberUtil";

const LevinBeneficiaryDetails = ({
  open,
  onClose,
  beneficiary,
  senderMobile,
  senderId,
  sender,
  onLevinSuccess,
}) => {
  const [transferMode, setTransferMode] = useState("IMPS");
  const [amount, setAmount] = useState("");
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [loadingPurposes, setLoadingPurposes] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [openMpinModal, setMpinModalOpen] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const [mpinError, setMpinError] = useState("");

  const { location, getUuid } = useContext(AuthContext);
  const { showToast } = useToast();

  const [uuid, setUuid] = useState(null);
  const [mpin, setMpin] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!beneficiary) return null;

  // Fetch purposes
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
        } else showToast(error?.message || "Failed to load purposes", "error");
      } catch (err) {
        showToast("Error while loading purposes", "error");
      } finally {
        setLoadingPurposes(false);
      }
    };
    fetchPurposes();
  }, []);

  const amountInWords = amount
    ? `${convertNumberToWordsIndian(amount).replace(/\b\w/g, (c) =>
        c.toUpperCase()
      )} Only`
    : "";

  const handleChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      if (parseFloat(val) > parseFloat(sender?.rem_limit || 0)) {
        showToast("Exceeds Rem Limit", "error");
        return;
      }
      setAmount(val);
    }
  };

  // ✅ Trigger MPIN modal
  const handleProceed = () => {
    if (!amount || parseFloat(amount) <= 0)
      return showToast("Please enter a valid amount", "error");
    setMpinModalOpen(true);
  };

  // ✅ When M-PIN modal opens, fetch UUID
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
        }
      };
      fetchUuid();
    }
  }, [mpinModalOpen]);
  const handleMpinChange = (value) => {
    // Check if the input contains non-numeric characters
    if (/[^0-9]/.test(value)) {
      setMpinError("Only numbers are allowed in MPIN");
    } else {
      setMpinError("");
    }

    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    setMpin(numericValue);
  };
  // ✅ Final API call after M-PIN entered
  const handleConfirmMpin = async () => {
    if (!mpin || mpin.length !== 6)
      return showToast("Please enter a 6-digit M-PIN", "error");

    setSubmitting(true);
    try {
      const selectedPurposeType =
        purposes.find((p) => p.id === Number(selectedPurpose))?.type || "N/A";

      const payload = {
        sender_id: senderId,
        beneficiary_id: beneficiary.id,
        beneficiary_name: beneficiary.beneficiary_name,
        account_number: beneficiary.account_number,
        ifsc_code: beneficiary.ifsc_code,
        bank_name: beneficiary.bank_name,
        mobile_number: sender.mobile_number,
        operator: 81,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        mop: transferMode,
        mpin,
        purpose: selectedPurposeType,
        client_ref: uuid,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_TXN,
        payload
      );

      if (response) {
        showToast(response?.message || "Payout successful!", "success");
        onLevinSuccess({
          ...(response || {}),
          beneficiary,
          senderMobile,
          purpose: selectedPurposeType,
          transferMode,
        });
        setAmount("");
        setMpin("");
        setMpinModalOpen(false);
        onClose();
      } else {
        showToast(error?.message || "Payout failed", "error");
        setMpinModalOpen(false);
        setMpin("");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Main Modal Content ---
  const customContent = (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Beneficiary Info */}
      <Box sx={{ bgcolor: "#f0f8ff", p: 2, borderRadius: 2 }}>
        {[
          { label: "Name", value: beneficiary.beneficiary_name },
          { label: "Account Number", value: beneficiary.account_number },
          { label: "Bank", value: beneficiary.bank_name },
          { label: "IFSC", value: beneficiary.ifsc_code },
        ].map((item, i) => (
          <Box key={i} display="flex" mb={1}>
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
        onChange={handleChange}
      />

      {amount && (
        <Typography variant="body2" sx={{ color: "#555", fontWeight: 500 }}>
          {amountInWords}
        </Typography>
      )}
    </Box>
  );

  // --- MPIN Modal Content ---
  const mpinContent = (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="body1" fontWeight={600}>
        Enter 6-digit M-PIN to Confirm
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
  );

  return (
    <>
      <Loader loading={submitting || loading}>
        <CommonModal
          open={open}
          onClose={onClose}
          title="Send Money"
          iconType="info"
          size="small"
          customContent={customContent}
          loading={loading || submitting}
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
              onClick: () => setMpinModalOpen(true), // ✅ open MPIN modal instead of direct call
              disabled:
                loading || submitting || !amount || parseFloat(amount) <= 0,
            },
          ]}
        />
      </Loader>

      {/* ✅ MPIN Modal */}
      <CommonModal
        open={mpinModalOpen}
        onClose={() => setMpinModalOpen(false)}
        title="Enter M-PIN"
        iconType="lock"
        size="small"
        customContent={
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Box
              sx={{
                bgcolor: "#f8f9fc",
                p: 2,
                mb: 1,
                borderRadius: 2,
                width: "100%",
                textAlign: "center",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="body2" fontWeight="600">
                Confirm Transfer
              </Typography>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                ₹{amount}
              </Typography>

              <Typography variant="body2" sx={{ mt: 0.5, color: "#555" }}>
                to <strong>{beneficiary.beneficiary_name}</strong>
              </Typography>

              <Typography variant="body2" sx={{ color: "#777" }}>
                A/C: {beneficiary.account_number}
              </Typography>
            </Box>
            <Typography variant="body2">
              Please enter your 6-digit M-PIN to confirm transaction
            </Typography>
            <div>
              <OTPInput
                value={mpin}
                onChange={handleMpinChange}
                numInputs={6}
                inputType="password"
                isInputNum={true}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: "40px",
                  height: "40px",
                  margin: "0 5px",
                  fontSize: "18px",
                  border: mpinError ? "1px solid #ff0000" : "1px solid #D0D5DD",
                  borderRadius: "6px",
                  textAlign: "center",
                  backgroundColor: mpinError ? "#fff5f5" : "white",
                }}
              />
              {mpinError && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{
                    display: "block",
                    mt: 1,
                    textAlign: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  {mpinError}
                </Typography>
              )}
            </div>
          </Box>
        }
        footerButtons={[
          {
            text: "Cancel",
            variant: "outlined",
            onClick: () => setMpinModalOpen(false),
            disabled: loading,
          },
          {
            text: loading ? "Processing..." : "Confirm",
            variant: "contained",
            color: "success",
            onClick: handleConfirmMpin,
            disabled: loading || mpin.length !== 6,
          },
        ]}
      />
    </>
  );
};

export default LevinBeneficiaryDetails;
