import React, { useContext, useState, useEffect } from "react";
import { Box, Typography, TextField } from "@mui/material";
import OTPInput from "react-otp-input";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";
import CommonModal from "../components/common/CommonModal";
import { convertNumberToWordsIndian } from "../utils/NumberUtil";
import Loader from "../components/common/Loader";

const UpiBeneficiaryDetails = ({
  open,
  onClose,
  beneficiary,
  senderId,
  sender,
}) => {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [loadingPurposes, setLoadingPurposes] = useState(false);
  const [openMpinModal, setOpenMpinModal] = useState(false);
  const [mpin, setMpin] = useState("");
  const [uuid, setUuid] = useState(null);

  const { location, getUuid, user } = useContext(AuthContext);
  const { showToast } = useToast();

  const amountInWords = amount
    ? `${convertNumberToWordsIndian(amount).replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )} Only`
    : "";

  if (!beneficiary) return null;

  // fetch purposes
  useEffect(() => {
    const fetchPurposes = async () => {
      setLoadingPurposes(true);
      try {
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_PURPOSES
        );
        if (error) showToast(error?.message, "error");
        else {
          const purposesData = response?.data || [];
          setPurposes(purposesData);
          if (purposesData.length > 0) setSelectedPurpose(purposesData[0].id);
        }
      } catch (err) {
        showToast(err);
      } finally {
        setLoadingPurposes(false);
      }
    };
    fetchPurposes();
  }, []);

  // fetch UUID when main modal opens
  useEffect(() => {
    if (openMpinModal) {
      const fetchUuid = async () => {
        try {
          const { error, response } = await getUuid();
          if (response) {
            setUuid(response);
          } else if (error) {
            showToast(error?.message || "Failed to generate UUID", "error");
            setOpenMpinModal(false);
          }
        } catch (err) {
          showToast("Error while generating UUID", "error");
        }
      };
      fetchUuid();
    }
  }, [openMpinModal]);

  // handle amount change
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

  // step 1: open M-PIN modal
  const handleProceed = () => {
    if (!amount) return showToast("Please enter amount", "error");
    setOpenMpinModal(true);
  };

  // step 2: call payout API
  const handleConfirmMpin = async () => {
    if (!mpin || mpin.length !== 6)
      return showToast("Please enter the 6-digit M-PIN", "error");
    setSubmitting(true);
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
        operator: 12,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        mop: "UPI",
        mpin,
        purpose_id: selectedPurpose,
        client_ref: uuid,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.PAYOUT,
        payload
      );

      if (response) {
        okSuccessToast(response?.message);
        setAmount("");
        setMpin("");
        setOpenMpinModal(false);
        onClose();
      } else {
        showToast(error?.message || "Something went wrong", "error");
        setOpenMpinModal(false);
        setMpin("");
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const customContent = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ bgcolor: "#f0f8ff", p: 2, borderRadius: 2 }}>
        <Box display="flex" mb={1}>
          <Typography variant="body2" fontWeight={500} sx={{ width: "120px" }}>
            Name
          </Typography>
          <Typography variant="body2">
            {beneficiary.beneficiary_name}
          </Typography>
        </Box>
        <Box display="flex">
          <Typography variant="body2" fontWeight={500} sx={{ width: "120px" }}>
            VPA
          </Typography>
          <Typography variant="body2">{beneficiary.account_number}</Typography>
        </Box>
      </Box>

      <TextField
        label="Purpose"
        select
        size="small"
        value={selectedPurpose}
        onChange={(e) => setSelectedPurpose(e.target.value)}
        SelectProps={{ native: true }}
        fullWidth
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

  return (
    <>
      <Loader loading={submitting || loading}>
        {/* Main modal */}
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
              disabled: loading || submitting,
            },
            {
              text: loading || submitting ? "Processing..." : "Proceed",
              variant: "contained",
              color: "success",
              onClick: handleProceed,
              disabled: loading || submitting || !amount,
            },
          ]}
        />

        {/* MPIN confirmation modal */}
        <CommonModal
          open={openMpinModal}
          onClose={() => setOpenMpinModal(false)}
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
              <Typography variant="body2">
                Please enter your 6-digit M-PIN to confirm transaction
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
          }
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: () => setOpenMpinModal(false),
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
      </Loader>
    </>
  );
};

export default UpiBeneficiaryDetails;
