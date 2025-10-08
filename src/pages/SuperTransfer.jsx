import { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
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
  const [history, setHistory] = useState([]);
  const [sender, setSender] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ New state
  const { showToast } = useToast();
  const [payoutResponse, setPayoutResponse] = useState(null); // store API response

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
    if (!number || number.length !== 10) return;

    setLoading(true);
    const { error, response } = await apiCall("post", ApiEndpoints.GET_SENDER, {
      mobile_number: number,
    });
    setLoading(false);

    if (response) {
      const data = response?.data || response?.response?.data;

      if (data && data?.is_active === 1) {
        setSender(data);
        setOpenRegisterModal(false);
      } else {
        setSender(null);
        setOpenRegisterModal(true);
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
        showToast(error?.message || "Something went wrong");
      }
    }
  };

  const handleChange = (e, newValue) => {
    const value = (newValue || "").replace(/\D/g, "");
    if (value.length <= 10) {
      setMobile(value);

      if (value.length === 10) {
        saveMobileToHistory(value);
        handleFetchSender(value);
      } else {
        setSender(null);
        setSelectedBeneficiary(null);
      }
    }
  };

  const handleSenderRegistered = ({ mobile_number, otp_ref, sender_id }) => {
    setOtpData({ mobile_number, otp_ref, sender_id });
    setOpenVerifyModal(true);
  };

  const handlePayoutSuccess = (data) => {
    console.log("Received in parent:", data);
    setPayoutResponse(data);
  };
  useEffect(() => {
    if (payoutResponse) {
      console.log("Updated payoutResponse:", payoutResponse);
    }
  }, [payoutResponse]);

  return (
    <Box>
      {!payoutResponse ? (
        <>
          {/* Mobile Input + Account Number */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems="center"
            gap={1}
            mb={1}
          >
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

            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "center",
                width: "100%",
                my: 0.5,
              }}
            >
              <Divider sx={{ width: "30%", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
            </Box>

            <TextField
              label="Account Number"
              variant="outlined"
              inputProps={{ maxLength: 18 }}
              sx={{ flex: 1 }}
              fullWidth
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
            <SenderDetails sender={sender} />
            {/* {selectedBeneficiary && (
              <BeneficiaryDetails
                open={!!selectedBeneficiary}
                beneficiary={selectedBeneficiary}
                senderMobile={mobile}
                sender={sender}
                senderId={sender?.id}
                onPayoutSuccess={handlePayoutSuccess} // pass callback
              />
            )} */}
            <BeneficiaryList
              sender={sender}
              onSuccess={() => handleFetchSender()}
              onSelect={(b) => setSelectedBeneficiary(b)}
              onPayoutSuccess={handlePayoutSuccess} // ✅ callback passed
            />
          </Box>
        </>
      ) : (
        <Box p={3} bgcolor="#e0ffe0" borderRadius={2}>
          <Typography variant="h6" color="success.main" mb={1}>
            {payoutResponse?.message || "Transaction Successful"}
          </Typography>
          <Typography variant="body2">
            <strong>Sender Mobile:</strong> {payoutResponse?.data?.mobileNumber}
          </Typography>
          <Typography variant="body2">
            <strong>Beneficiary Name:</strong>{" "}
            {payoutResponse?.data?.beneficiaryName}
          </Typography>
          <Typography variant="body2">
            <strong>Account Number:</strong>{" "}
            {payoutResponse?.data?.beneficiaryAccount}
          </Typography>
          <Typography variant="body2">
            <strong>IFSC:</strong> {payoutResponse?.data?.ifscCode}
          </Typography>
          <Typography variant="body2">
            <strong>Amount:</strong> {payoutResponse?.data?.transferAmount}
          </Typography>
          <Typography variant="body2">
            <strong>Transfer Mode:</strong> {payoutResponse?.data?.transferMode}
          </Typography>

          <Typography variant="body2">
            <strong>Running Balance:</strong>{" "}
            {payoutResponse?.data?.runningBalance}
          </Typography>

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPayoutResponse(null)} // reset to allow new transaction
            >
              Repeat Txn
            </Button>
          </Box>
        </Box>
      )}

      {openRegisterModal && (
        <SenderRegisterModal
          open={openRegisterModal}
          onClose={() => setOpenRegisterModal(false)}
          mobile={mobile}
          onRegistered={handleSenderRegistered}
        />
      )}

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
