import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import OTPInput from "react-otp-input";
import AuthContext from "../../contexts/AuthContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../../components/common/CommonModal";
import Loader from "../../components/common/Loader";

const SoliTechBeneficiaryDetails = ({
  open,
  onClose,
  beneficiary,
  senderMobile,
  sender,
  onPayoutSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferMode, setTransferMode] = useState("IMPS");
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [loadingPurposes, setLoadingPurposes] = useState(false);
  const [openMpinModal, setOpenMpinModal] = useState(false);
  const [uuid, setUuid] = useState(null);
  const { location, loadUserProfile, getUuid } = useContext(AuthContext);
  const { showToast } = useToast();

  if (!beneficiary) return null;

  // Fetch purposes on mount
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
      } catch {
        showToast("Error loading purposes", "error");
      } finally {
        setLoadingPurposes(false);
      }
    };
    fetchPurposes();
  }, []);

  // Handle amount input
  const handleChangeAmount = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
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
  };

  // Proceed clicked -> open MPIN modal
  const handleProceed = async () => {
    if (!amount || parseFloat(amount) <= 0)
      return showToast("Please enter a valid amount", "error");

    if (!selectedPurpose) return showToast("Please select a purpose", "error");

    try {
      const { error, response } = await getUuid();
      if (response) {
        setUuid(response);
        setOpenMpinModal(true); // ✅ open MPIN modal only now
      } else {
        showToast(error?.message || "Failed to generate UUID", "error");
      }
    } catch {
      showToast("Error while generating UUID", "error");
    }
  };

  // Submit payout (called from MPIN modal)
  const handleMpinSubmit = async (mpin) => {
    setLoading(true);
    try {
      const selectedPurposeObj = purposes.find(
        (p) => p.id === Number(selectedPurpose)
      );
      const purposeType = selectedPurposeObj?.type || "N/A";

      const payload = {
        mpin,
        beneficiary_name: beneficiary.beneficiary_name,
        bank_name: beneficiary.bank_name,
        account_number: beneficiary.account_number,
        ifsc_code: beneficiary.ifsc_code,
        operator: 89,
        mop: transferMode,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        soliteck_id: beneficiary.soliteck_id,
        mobile_number: senderMobile,
        purpose: purposeType,
        purpose_id: selectedPurpose,
        client_ref: uuid,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.SOLITECH_PAYOUT,
        payload
      );

      if (response) {
        showToast(response?.message || "Payout successful!", "success");
        loadUserProfile();
        const payoutData = {
          ...(response?.data || {}),
          purpose: purposeType,
        };
        onPayoutSuccess(payoutData);
        setAmount("");
        onClose();
      } else {
        showToast(error?.message || "Payout failed", "error");
      }
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
      setOpenMpinModal(false);
    }
  };

  // Main Modal (No MPIN here)
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
            <Typography variant="body2" fontWeight={500} sx={{ width: 160 }}>
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
            sx={{ minWidth: 180 }}
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
      />
    </Box>
  );

  return (
    <Loader loading={loading}>
      {/* Main modal */}
      <CommonModal
        open={open}
        onClose={onClose}
        title="Send Money"
        iconType="info"
        size="small"
        customContent={customContent}
        loading={loading}
        footerButtons={[
          { text: "Cancel", variant: "outlined", onClick: onClose },
          {
            text: "Proceed",
            variant: "contained",
            color: "success",
            onClick: handleProceed,
            disabled: loading || !amount || parseFloat(amount) <= 0,
          },
        ]}
      />

      {/* MPIN Modal */}
      <MpinModal
        open={openMpinModal}
        onClose={() => setOpenMpinModal(false)}
        onSubmit={handleMpinSubmit}
      />
    </Loader>
  );
};

// 🔐 Separate MPIN Modal component
const MpinModal = ({ open, onClose, onSubmit }) => {
  const [mpin, setMpin] = useState("");

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Enter M-PIN"
      iconType="lock"
      size="small"
      customContent={
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
      }
      footerButtons={[
        { text: "Cancel", variant: "outlined", onClick: onClose },
        {
          text: "Confirm",
          variant: "contained",
          color: "success",
          onClick: () => {
            if (mpin.length !== 6)
              return alert("Please enter a valid 6-digit MPIN");
            onSubmit(mpin);
          },
          disabled: mpin.length !== 6,
        },
      ]}
    />
  );
};

export default SoliTechBeneficiaryDetails;
