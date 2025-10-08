import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import {
  okSuccessToast,
  apiErrorToast,
  okSuccessToastAlt,
} from "../utils/ToastUtil";
import SenderDetails from "./SenderDetails";
import SenderRegisterModal from "./SenderRegisterModal";
import VerifySenderModal from "./VerifySenderModal";
import BeneficiaryDetails from "./BeneficiaryDetails";
import UpiBeneficiaryList from "./UpiBeneficiaryList";
import UpiBeneficiaryDetails from "./UpiBeneficiaryDetails";
import CommonLoader from "../components/common/CommonLoader";

const UpiTransfer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobile, setMobile] = useState("");
  const [sender, setSender] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch sender by mobile number
  const handleFetchSender = async (number = mobile) => {
    if (!number || number.length !== 10) return;

    setLoading(true); // start loader
    try {
      const response = await apiCall("post", ApiEndpoints.GET_SENDER, {
        mobile_number: number,
        type: "UPI",
      });
      setLoading(false); // stop loader
      const data = response?.data || response?.response?.data;

      if (response)
        if (data && data?.is_active === 1) {
          // okSuccessToast(response.message || "Sender fetched successfully");

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
    <Box p={0}>
      {/* Always show mobile input */}
      <Box position="relative">
        <TextField
          label="Mobile Number"
          variant="outlined"
          fullWidth
          value={mobile}
          onChange={handleChange}
          inputProps={{ maxLength: 10 }}
          sx={{ mb: 1 }}
          autoComplete="tel" // ✅ enables browser autocomplete
        />
        {loading && (
          <CommonLoader
            loading={loading}
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
            }}
          />
        )}
      </Box>

      {/* Sender Details - Full width */}
      <Box mb={1}>
        <SenderDetails sender={sender} />
      </Box>

      {/* Beneficiaries - 70/30 split */}
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={1}>
        {/* Left: Beneficiary List - 70% */}
        {/* Beneficiary List - Full width */}
        <Box width="100%">
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
