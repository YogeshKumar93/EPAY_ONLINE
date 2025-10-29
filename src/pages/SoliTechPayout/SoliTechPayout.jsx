import { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  InputAdornment,
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
import SearchIcon from "@mui/icons-material/Search";

const SoliTechPayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [accountNumber, setAccountNumber] = useState(""); // 👈 new state
  const [history, setHistory] = useState([]);
  const [mobile, setMobile] = useState("");
  const [sender, setSender] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payoutResponse, setPayoutResponse] = useState(null); // ✅ New state for receipt
  const { showToast } = useToast();
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [mobileList, setMobileList] = useState([]);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mobileNumbers") || "[]");
    setHistory(saved);
  }, []);

  const saveMobileToHistory = (number) => {
    if (!history.includes(number)) {
      const updated = [...history, number];
      setHistory(updated);
      localStorage.setItem("mobileNumbers", JSON.stringify(updated));
    }
  };
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

  const handleChange = (e, newValue) => {
    const value = (newValue || "").replace(/\D/g, "");

    if (value.length <= 10) {
      setMobile(value);

      if (value.length === 10) {
        saveMobileToHistory(value);
        handleFetchSender(value);
      } else {
        // clear data if input is not 10 digits
        setSender(null);
        setSelectedBeneficiary(null);
      }
    }
  };
  const handleFetchSenderByAccount = async (accNumber) => {
    if (!accNumber || accNumber.length < 9) return;
    setLoading(true);

    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.GET_SENDER_BY_ACC,
      {
        account_number: accNumber,
      }
    );

    setLoading(false);

    if (response) {
      const data = response?.data || response?.response?.data;
      if (Array.isArray(data) && data.length > 0) {
        setMobileList(data);
        setMobileListOpen(true); // 👈 open modal
      } else {
        showToast("No mobile numbers found for this account", "warning");
      }
    } else if (error) {
      showToast(
        error?.message || "Failed to fetch sender by account number",
        "error"
      );
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
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="center"
        gap={1}
        mb={1}
      >
        {" "}
        <Autocomplete
          freeSolo
          options={history}
          value={mobile}
          onInputChange={handleChange}
          sx={{ flex: 1 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Mobile Number"
              variant="outlined"
              inputProps={{ ...params.inputProps, maxLength: 10 }}
              fullWidth
            />
          )}
        />
        {/* <TextField
          label="Mobile Number"
          variant="outlined"
          fullWidth
          value={mobile}
          autoComplete="on" // <-- enable autocomplete for phone numbers
          onChange={handleChange}
          inputProps={{ maxLength: 10 }}
          sx={{ mb: 1 }}
        /> */}
        <TextField
          label="Account Number"
          variant="outlined"
          value={accountNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // allow only digits
            setAccountNumber(value);
          }}
          inputProps={{ maxLength: 18 }}
          sx={{ flex: 1 }}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={() => handleFetchSenderByAccount(accountNumber)}
                  disabled={!accountNumber || accountNumber.length < 9}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
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
