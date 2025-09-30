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
import CommonLoader from "../components/common/CommonLoader";
import { useToast } from "../utils/ToastContext";

const SuperTransfer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobile, setMobile] = useState("");
  const [sender, setSender] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [loading, setLoading] = useState(false);
 const {showToast} = useToast();
  // Fetch sender by mobile number
  const handleFetchSender = async (number = mobile) => {
    if (!number || number.length !== 10) return;

    setLoading(true); // start loader

    const { error, response } = await apiCall("post", ApiEndpoints.GET_SENDER, {
      mobile_number: number,
    });
  // stop loader

    if (response) {
      // ✅ success path
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
    } else if (error) {
      // ❌ error path
      console.log("error from API:", error);

      if (error?.message === "The number is inactive") {
        // 👉 open verify modal instead of register
        setSender(null);
        setOpenRegisterModal(false);

        setOtpData({
          mobile_number: error?.errors?.mobile_number || number,
          otp_ref: error?.errors?.otp_ref,
        });
        setOpenVerifyModal(true);
      } else {
        showToast(error?.message || "Something went wrong");
      }
        setLoading(false); 
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
    <Box>
      {/* Always show mobile input */}
      <Box>
        <TextField
          label="Mobile Number"
          variant="outlined"
          fullWidth
          value={mobile}
          autoComplete="on" // <-- enable autocomplete for phone numbers
          onChange={handleChange}
          inputProps={{ maxLength: 10 }}
          sx={{ mb: 1 }}
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
      <Box display="flex" flexDirection="column" gap={1}>
        {/* Sender Details */}
        <Box width="100%">
          <SenderDetails sender={sender} />

          {/* {selectedBeneficiary && (
      <BeneficiaryDetails
        beneficiary={selectedBeneficiary}
        senderMobile={mobile}
        sender={sender}
      />
    )} */}
        </Box>

        {/* Beneficiary List */}
        <Box width="100%">
          <BeneficiaryList
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

export default SuperTransfer;
