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
        <Box p={3} bgcolor="#e0ffe0" borderRadius={2} maxWidth={500} mx="auto">
          <Typography
            variant="h5"
            color="success.main"
            mb={2}
            textAlign="center"
            fontWeight="bold"
          >
            Payment Receipt
          </Typography>

          {/* Date */}
          <Typography variant="body2" mb={1}>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </Typography>

          {/* Message */}
          <Typography variant="body2" color="success.main" mb={2}>
            {payoutResponse?.response?.message || "Transaction Successful"}
          </Typography>

          {/* Details */}
          <Box
            sx={{ bgcolor: "#f7fff7", p: 2, borderRadius: 2 }}
            id="receiptContent"
          >
            <Typography variant="body2" mb={0.5}>
              <strong>Sender Mobile:</strong>{" "}
              {payoutResponse?.response?.data?.mobileNumber || "---"}
            </Typography>
            <Typography variant="body2" mb={0.5}>
              <strong>Beneficiary Name:</strong>{" "}
              {payoutResponse?.response?.data?.beneficiaryName || "---"}
            </Typography>
            <Typography variant="body2" mb={0.5}>
              <strong>Account Number:</strong>{" "}
              {payoutResponse?.response?.data?.beneficiaryAccount || "---"}
            </Typography>

            <Typography variant="body2" mb={0.5}>
              <strong>Amount:</strong>{" "}
              {payoutResponse?.response?.data?.transferAmount || "---"}
            </Typography>
            <Typography variant="body2" mb={0.5}>
              <strong>Transfer Mode:</strong>{" "}
              {payoutResponse?.response?.data?.transferMode || "---"}
            </Typography>
            <Typography variant="body2" mb={0.5}>
              <strong>Purpose:</strong>
              {payoutResponse?.purpose || "N/A"}{" "}
            </Typography>
            <Typography variant="body2" mb={0.5}>
              <strong>UTR:</strong> {payoutResponse?.operator_id || "---"}
            </Typography>
          </Box>

          {/* Buttons */}
          <Box mt={3} display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPayoutResponse(null)}
            >
              Repeat Txn
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                const printContent = document.getElementById("receiptContent");
                if (!printContent) return;

                const newWin = window.open("", "_blank");
                const styles = Array.from(
                  document.querySelectorAll("style, link[rel='stylesheet']")
                )
                  .map((node) => node.outerHTML)
                  .join("\n");

                newWin.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          ${styles} 
          <style>
            body { font-family: Roboto, sans-serif; padding: 20px; background-color: #fff; }
            #receiptContent { background-color: #f7fff7; padding: 16px; border-radius: 8px; }
            h5 { color: #388e3c; text-align: center; }
            p, strong { font-size: 14px; margin: 4px 0; }
          </style>
        </head>
        <body>
          <h5>Payment Receipt</h5>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
                newWin.document.close();
                newWin.focus();
                newWin.print();
                newWin.close();
              }}
            >
              Print Receipt
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
