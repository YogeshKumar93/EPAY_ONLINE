import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
  Autocomplete,
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
import LevinRegisterRemitter from "./LevinUpiRegisterRemitter";
import LevinVerifySender from "./LevinUpiVerifySender";
import LevinBeneficiaryList from "./LevinUpiBeneficiaryList";
import LevinBeneficiaryDetails from "./LevinUpiBeneficiaryDetails";
import LevinTransferReceipt from "./LevinTransferReceipt";
import MobileNumberList from "./MobileNumberList";
import SearchIcon from "@mui/icons-material/Search";
import LevinUpiBeneficiaryList from "./LevinUpiBeneficiaryList";
import LevinUpiRegisterRemitter from "./LevinUpiRegisterRemitter";
import LevinUpiVerifySender from "./LevinUpiVerifySender";

const LevinUpiTransfer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobile, setMobile] = useState("");
  const [sender, setSender] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [levinResponse, setLevinResponse] = useState(null); // store API response
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [mobileList, setMobileList] = useState([]);
  const [history, setHistory] = useState([]);

  // Fetch sender by mobile number
  const handleFetchSender = async (number = mobile) => {
    if (!number || number.length !== 10) return;

    setLoading(true); // start loader

    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.GET_SENDER_UPI,
      {
        mobile_number: number,
        type: "LEVINUPI",
      }
    );
    // stop loader
    setLoading(false);
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
    }
  };
  const saveMobileToHistory = (number) => {
    if (!history.includes(number)) {
      const updated = [...history, number];
      setHistory(updated);
      localStorage.setItem("mobileNumbers", JSON.stringify(updated));
    }
  };
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mobileNumbers") || "[]");
    setHistory(saved);
  }, []);

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
        setSender(null);
        setSelectedBeneficiary(null);
      }
    }
  };

  const handleLevinSuccess = (data) => {
    console.log("Received in parent:", data);
    setLevinResponse(data);
  };
  useEffect(() => {
    if (levinResponse) {
      console.log("Updated levinResponse:", levinResponse);
    }
  }, [levinResponse]);
  const handleSenderRegistered = ({ number, state, sender_id }) => {
    setOtpData({
      mobile_number: number,
      state, // Add the state to otpData
      sender_id,
    });
    setOpenVerifyModal(true); // Open the verify modal
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
  const handleAccountChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // digits only
    setAccountNumber(value);

    if (value.length >= 9 && value.length <= 18) {
      handleFetchSenderByAccount(value);
    } else {
      setSender(null);
    }
  };

  return (
    <Box>
      {!levinResponse ? (
        <>
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

            {/* <TextField
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
            /> */}
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
            </Box>

            {/* Beneficiary List */}
            <Box width="100%">
              <LevinUpiBeneficiaryList
                sender={sender}
                onSuccess={() => handleFetchSender()}
                onSelect={(b) => setSelectedBeneficiary(b)}
                onLevinSuccess={handleLevinSuccess} // ✅ callback passed
              />
            </Box>
          </Box>
        </>
      ) : (
        //     <Box p={3} bgcolor="#e0ffe0" borderRadius={2} maxWidth={500} mx="auto">
        //       <Typography
        //         variant="h5"
        //         color="success.main"
        //         mb={2}
        //         textAlign="center"
        //         fontWeight="bold"
        //       >
        //         Payment Receipt
        //       </Typography>

        //       {/* Date */}
        //       <Typography variant="body2" mb={1}>
        //         <strong>Date:</strong> {new Date().toLocaleDateString()}
        //       </Typography>

        //       {/* Message */}
        //       <Typography variant="body2" color="success.main" mb={2}>
        //         {levinResponse?.message || "Transaction Successful"}
        //       </Typography>

        //       {/* Details */}
        //       <Box
        //         sx={{ bgcolor: "#f7fff7", p: 2, borderRadius: 2 }}
        //         id="receiptContent"
        //       >
        //         <Typography variant="body2" mb={0.5}>
        //           <strong>Sender Mobile:</strong>{" "}
        //           {levinResponse?.senderMobile || "---"}
        //         </Typography>
        //         <Typography variant="body2" mb={0.5}>
        //           <strong>Txn Id:</strong> {levinResponse?.data?.TxnID || "---"}
        //         </Typography>
        //         <Typography variant="body2" mb={0.5}>
        //           <strong>Beneficiary Name:</strong>{" "}
        //           {levinResponse?.data?.BeneName ||
        //             levinResponse?.beneficiary?.beneficiary_name ||
        //             "---"}
        //         </Typography>
        //         <Typography variant="body2" mb={0.5}>
        //           <strong>Beneficiary Account:</strong>{" "}
        //           {levinResponse?.beneficiary?.account_number || "---"}
        //         </Typography>
        //         {/* <Typography variant="body2" mb={0.5}>
        //           <strong>Account Number:</strong>{" "}
        //           {levinResponse?.response?.data?.beneficiaryAccount || "---"}
        //         </Typography>

        //         <Typography variant="body2" mb={0.5}>
        //           <strong>Purpose:</strong>
        //           {levinResponse?.purpose || "N/A"}{" "}
        //         </Typography> */}
        //         <Typography variant="body2" mb={0.5}>
        //           <strong>Transfer Mode:</strong>{" "}
        //           {levinResponse?.transferMode || "---"}
        //         </Typography>
        //         <Typography variant="body2" mb={0.5}>
        //           <strong>Amount:</strong>{" "}
        //           {levinResponse?.data?.AmountRequested || "---"}
        //         </Typography>
        //         <Typography variant="body2" mb={0.5}>
        //           <strong>UTR:</strong> {levinResponse?.data?.utr || "---"}
        //         </Typography>
        //       </Box>

        //       {/* Buttons */}
        //       <Box mt={3} display="flex" justifyContent="center" gap={2}>
        //         <Button
        //           variant="contained"
        //           sx={{ mt: 2 }}
        //           onClick={() => setLevinResponse(null)} // Reset for new transfer
        //         >
        //           New Transfer
        //         </Button>

        //         <Button
        //           variant="outlined"
        //           color="secondary"
        //           onClick={() => {
        //             const printContent = document.getElementById("receiptContent");
        //             if (!printContent) return;

        //             const newWin = window.open("", "_blank");
        //             const styles = Array.from(
        //               document.querySelectorAll("style, link[rel='stylesheet']")
        //             )
        //               .map((node) => node.outerHTML)
        //               .join("\n");

        //             newWin.document.write(`
        //   <html>
        //     <head>
        //       <title>Receipt</title>
        //       ${styles}
        //       <style>
        //         body { font-family: Roboto, sans-serif; padding: 20px; background-color: #fff; }
        //         #receiptContent { background-color: #f7fff7; padding: 16px; border-radius: 8px; }
        //         h5 { color: #388e3c; text-align: center; }
        //         p, strong { font-size: 14px; margin: 4px 0; }
        //       </style>
        //     </head>
        //     <body>
        //       <h5>Payment Receipt</h5>
        //       ${printContent.innerHTML}
        //     </body>
        //   </html>
        // `);
        //             newWin.document.close();
        //             newWin.focus();
        //             newWin.print();
        //             newWin.close();
        //           }}
        //         >
        //           Print Receipt
        //         </Button>
        //       </Box>
        //     </Box>
        <LevinTransferReceipt
          levinResponse={levinResponse}
          onRepeat={() => setLevinResponse(null)}
          sender={sender}
        />
      )}
      {/* Register Modal */}
      {openRegisterModal && (
        <LevinUpiRegisterRemitter
          open={openRegisterModal}
          onClose={() => setOpenRegisterModal(false)}
          mobile={mobile}
          onRegistered={handleSenderRegistered}
        />
      )}
      {mobileListOpen && (
        <MobileNumberList
          open={mobileListOpen}
          onClose={() => setMobileListOpen(false)}
          numbers={mobileList}
          onSelect={(selectedMobile) => {
            setMobile(selectedMobile);
            handleFetchSender(selectedMobile);
          }}
        />
      )}

      {/* Verify Modal */}
      {openVerifyModal && otpData && (
        <LevinUpiVerifySender
          open={openVerifyModal}
          onClose={() => setOpenVerifyModal(false)}
          mobile={otpData.mobile_number}
          otpRef={otpData.otp_ref}
          otpData={otpData}
          onSuccess={handleFetchSender}
          sender={sender}
        />
      )}
    </Box>
  );
};

export default LevinUpiTransfer;
