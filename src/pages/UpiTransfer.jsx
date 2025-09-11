import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import BeneficiaryList from "./BeneficiaryList";
import SenderDetails from "./SenderDetails";
import SenderRegisterModal from "./SenderRegisterModal";
import VerifySenderModal from "./VerifySenderModal";
import BeneficiaryDetails from "./BeneficiaryDetails";
import UpiBeneficiaryList from "./UpiBeneficiaryList";
import UpiBeneficiaryDetails from "./UpiBeneficiaryDetails";

const UpiTransfer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobile, setMobile] = useState("");
  const [sender, setSender] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  // Fetch sender by mobile number
  const handleFetchSender = async (number = mobile) => {
    if (!number || number.length !== 10) return;

    try {
      const response = await apiCall("post", ApiEndpoints.GET_SENDER, {
        mobile_number: number,
      });

      const data = response?.data || response?.response?.data;

      if (response?.status)
        okSuccessToast(response.message || "Sender fetched successfully");

      if (data && data?.is_active === 1) {
        setSender(data);
        setOpenRegisterModal(false);
      } else {
        setSender(null);
        setOpenRegisterModal(true);
      }
    } catch (error) {
      apiErrorToast(error);
      console.error("Error fetching sender:", error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits allowed

    if (value.length <= 10) {
      setMobile(value);

      if (value.length === 10) {
        handleFetchSender(value);
      } else {
        // clear data if input is not 10 digits
        setSender(null);
        setSelectedBeneficiary(null);
      }
    }
  };

  const handleSenderRegistered = ({ mobile_number, otp_ref, sender_id }) => {
    setOtpData({ mobile_number, otp_ref, sender_id });
    setOpenVerifyModal(true);
  };

  return (
    <Box p={3}>
      {/* Always show mobile input */}
      <TextField
        label="Mobile Number"
        variant="outlined"
        fullWidth
        value={mobile}
        autoComplete="on" // <-- enable autocomplete for phone numbers
        onChange={handleChange}
        inputProps={{ maxLength: 10 }}
        sx={{ mb: 2 }}
      />

      {/* Main Content (Sender + Beneficiaries) */}
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={1}>
        {/* Left: Sender Details + Selected Beneficiary */}
        <Box flex={isMobile ? "1 1 100%" : "0 0 30%"}>
          <SenderDetails sender={sender} />

          {selectedBeneficiary && (
            <UpiBeneficiaryDetails
              beneficiary={selectedBeneficiary}
              senderMobile={mobile}
            />
          )}
        </Box>

        {/* Right: Beneficiary List */}
        <Box flex={isMobile ? "1 1 100%" : "0 0 70%"}>
          <UpiBeneficiaryList
            sender={sender}
            onSuccess={() => handleFetchSender()}
            onSelect={(b) => setSelectedBeneficiary(b)}
          />
        </Box>
      </Box>

      {/* Register Modal */}
      {openRegisterModal && (
        <SenderRegisterModal
          open={openRegisterModal}
          onClose={() => setOpenRegisterModal(false)}
          mobile={mobile}
          onRegistered={handleSenderRegistered}
        />
      )}

      {/* Verify Modal */}
      {openVerifyModal && otpData && (
        <VerifySenderModal
          open={openVerifyModal}
          onClose={() => setOpenVerifyModal(false)}
          mobile={otpData.mobile_number}
          otpRef={otpData.otp_ref}
          otpData={otpData}
        />
      )}
    </Box>
  );
};

export default UpiTransfer;
