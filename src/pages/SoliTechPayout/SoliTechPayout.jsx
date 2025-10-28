import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonLoader from "../../components/common/CommonLoader";
import { useToast } from "../../utils/ToastContext";
import SoliTechSenderDetails from "./SoliTechSenderDetails";
import SoliTechSenderRegister from "./SoliTechSenderRegister";
import SoliTechBeneficiaryList from "./SoliTechBeneficiaryList";
import SoliTechBeneficiaryDetails from "./SoliTechBeneficiaryDetails";
import SuperTransferReceipt from "../SuperTransferReceipt";

const SoliTechPayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobile, setMobile] = useState("");
  const [sender, setSender] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payoutResponse, setPayoutResponse] = useState(null); // ✅ New state for receipt
  const { showToast } = useToast();

  const handleFetchSender = async (number = mobile) => {
    if (!number) return;

    setLoading(true);
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.SOLITECH_GET_SENDER,
      {
        mobile_number: number,
      }
    );
    setLoading(false);

    if (response && response?.data) {
      const data = response?.data || response?.response?.data;
      if (data?.is_active === 1) {
        setSender(data);
        setOpenRegisterModal(false);
        setMobile(data?.mobile_number || number);
      } else {
        setSender(null);
        setOpenRegisterModal(true); // user not found → open register modal
      }
    } else if (error) {
      if (error?.message === "The number is inactive") {
        setSender(null);
        setOpenRegisterModal(false);

        setOtpData({
          mobile_number: error?.errors?.mobile_number || number,
          otp_ref: error?.errors?.otp_ref,
        });
        setOpenVerifyModal(true);
      } else {
        setSender(null);
        setOpenRegisterModal(true); // ensure modal opens on unknown user
        showToast(error?.message || "Something went wrong", "error");
      }
    } else {
      // If no response or error → open register modal
      setSender(null);
      setOpenRegisterModal(true);
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

  // ✅ New function to handle payout success
  const handlePayoutSuccess = (data) => {
    setPayoutResponse(data);
  };

  console.log("THe mobke ", payoutResponse);

  if (payoutResponse) {
    return (
      <SuperTransferReceipt
        payoutResponse={payoutResponse}
        onRepeat={() => setPayoutResponse(null)}
      />
    );
  }

  return (
    <Box>
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
        {
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
        }
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Box width="100%">
          <SoliTechSenderDetails sender={sender} />
        </Box>

        <Box width="100%">
          <SoliTechBeneficiaryList
            sender={sender}
            onSuccess={handleFetchSender}
            onSelect={(b) => setSelectedBeneficiary(b)}
            onPayoutSuccess={handlePayoutSuccess} // ✅ Pass callback
          />

          {selectedBeneficiary && (
            <SoliTechBeneficiaryDetails
              beneficiary={selectedBeneficiary}
              senderMobile={mobile}
              sender={sender}
              onPayoutSuccess={handlePayoutSuccess} // ✅ Pass callback
            />
          )}
        </Box>
      </Box>

      {openRegisterModal && mobile && (
        <SoliTechSenderRegister
          open={openRegisterModal}
          onClose={() => setOpenRegisterModal(false)}
          mobile={mobile}
          onRegistered={handleSenderRegistered}
          fetchSender={handleFetchSender}
        />
      )}
    </Box>
  );
};
export default SoliTechPayout;
