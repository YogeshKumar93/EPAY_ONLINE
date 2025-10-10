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
  Paper,
  Grid,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import CommonLoader from "../components/common/CommonLoader";
import SenderDetails from "./SenderDetails";
import BeneficiaryList from "./BeneficiaryList";
import SenderRegisterModal from "./SenderRegisterModal";
import VerifySenderModal from "./VerifySenderModal";
import SuperTransferReceipt from "./SuperTransferReceipt";

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
  const [payoutResponse, setPayoutResponse] = useState(null);
  const { showToast } = useToast();

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
      if (data?.is_active === 1) {
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
    setPayoutResponse(data);
  };

  return (
    <Box>
      {!payoutResponse ? (
        <>
          {/* Mobile and Account Inputs */}
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

          <SenderDetails sender={sender} />
          <BeneficiaryList
            sender={sender}
            onSuccess={() => handleFetchSender()}
            onSelect={(b) => setSelectedBeneficiary(b)}
            onPayoutSuccess={handlePayoutSuccess}
          />
        </>
      ) : (
        // <Box
        //   p={3}
        //   bgcolor="#f9faff"
        //   borderRadius={3}
        //   boxShadow={3}
        //   maxWidth={900}
        //   mx="auto"
        //   mt={3}
        //   id="receiptContent"
        // >
        //   {/* Header Section */}
        //   <Box textAlign="center" mb={3}>
        //     <Typography variant="h5" fontWeight="bold" color="primary.main">
        //       Payment Receipt
        //     </Typography>
        //     <Typography variant="body2" color="text.secondary">
        //       Date: {new Date().toLocaleDateString()} &nbsp;
        //       {/* | &nbsp; Time:{" "} */}
        //       {/* {new Date().toLocaleTimeString()} */}
        //     </Typography>

        //     <Typography
        //       variant="subtitle1"
        //       sx={{
        //         mt: 1,
        //         color:
        //           payoutResponse?.response?.status === "FAILED"
        //             ? "red"
        //             : "green",
        //         fontWeight: "bold",
        //       }}
        //     >
        //       {payoutResponse?.response?.message || "Transaction Successful"}
        //     </Typography>
        //   </Box>

        //   {/* Tabular Section */}
        //   <Paper
        //     variant="outlined"
        //     sx={{
        //       borderRadius: 2,
        //       overflowX: "auto",
        //       background: "#fff",
        //     }}
        //   >
        //     <table
        //       style={{
        //         width: "100%",
        //         borderCollapse: "collapse",
        //         textAlign: "left",
        //         fontFamily: "Arial, sans-serif",
        //       }}
        //     >
        //       <thead
        //         style={{
        //           background: "#f0f4ff",
        //           borderBottom: "2px solid #ccc",
        //         }}
        //       >
        //         <tr>
        //           <th style={{ padding: "12px 16px", width: "30%" }}>Field</th>
        //           <th style={{ padding: "12px 16px", width: "70%" }}>Value</th>
        //         </tr>
        //       </thead>
        //       <tbody>
        //         {[
        //           [
        //             "Sender Mobile",
        //             payoutResponse?.response?.data?.mobileNumber,
        //           ],
        //           ["Sender Name", payoutResponse?.sender_name],
        //           [
        //             "Beneficiary Name",
        //             payoutResponse?.response?.data?.beneficiaryName,
        //           ],
        //           [
        //             "Account Number",
        //             payoutResponse?.response?.data?.beneficiaryAccount,
        //           ],
        //           [
        //             "Amount",
        //             `₹${payoutResponse?.response?.data?.transferAmount}`,
        //           ],
        //           [
        //             "Transfer Mode",
        //             payoutResponse?.response?.data?.transferMode,
        //           ],
        //           ["Purpose", payoutResponse?.purpose || "N/A"],
        //           ["UTR", payoutResponse?.operator_id],
        //         ].map(([label, value], index) => (
        //           <tr
        //             key={index}
        //             style={{
        //               backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
        //               borderBottom: "1px solid #e0e0e0",
        //             }}
        //           >
        //             <td
        //               style={{
        //                 padding: "12px 16px",
        //                 fontWeight: "bold",
        //                 color: "#555",
        //                 borderRight: "1px solid #ddd",
        //               }}
        //             >
        //               {label}
        //             </td>
        //             <td
        //               style={{
        //                 padding: "12px 16px",
        //                 color: "#222",
        //                 wordBreak: "break-word",
        //               }}
        //             >
        //               {value || "---"}
        //             </td>
        //           </tr>
        //         ))}
        //       </tbody>
        //     </table>
        //   </Paper>

        //   {/* Buttons */}
        //   <Box mt={3} display="flex" justifyContent="center" gap={2}>
        //     <Button
        //       variant="contained"
        //       color="primary"
        //       onClick={() => setPayoutResponse(null)}
        //     >
        //       Repeat Txn
        //     </Button>

        //     <Button
        //       variant="outlined"
        //       color="secondary"
        //       onClick={() => {
        //         const printWin = window.open("", "_blank");
        //         const html = `
        //   <html>
        //     <head>
        //       <title>Payment Receipt</title>
        //       <style>
        //         body { font-family: Arial; padding: 20px; background: #f9faff; }
        //         h2 { color: #1976d2; text-align: center; }
        //         table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        //         th, td { border: 1px solid #ccc; padding: 10px 14px; text-align: left; }
        //         th { background: #f1f5ff; }
        //         tr:nth-child(even) { background: #fafafa; }
        //       </style>
        //     </head>
        //     <body>
        //       <h2>Payment Receipt</h2>
        //       <p><strong>Date:</strong> ${new Date().toLocaleDateString()} &nbsp; | &nbsp; <strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
        //       <table>
        //         ${[
        //           [
        //             "Sender Mobile",
        //             payoutResponse?.response?.data?.mobileNumber,
        //           ],
        //           [
        //             "Beneficiary Name",
        //             payoutResponse?.response?.data?.beneficiaryName,
        //           ],
        //           [
        //             "Account Number",
        //             payoutResponse?.response?.data?.beneficiaryAccount,
        //           ],
        //           [
        //             "Amount",
        //             `₹${payoutResponse?.response?.data?.transferAmount}`,
        //           ],
        //           [
        //             "Transfer Mode",
        //             payoutResponse?.response?.data?.transferMode,
        //           ],
        //           ["Purpose", payoutResponse?.purpose || "N/A"],
        //           ["UTR", payoutResponse?.operator_id],
        //         ]
        //           .map(
        //             ([label, value]) =>
        //               `<tr><th>${label}</th><td>${value || "---"}</td></tr>`
        //           )
        //           .join("")}
        //       </table>
        //     </body>
        //   </html>
        // `;
        //         printWin.document.write(html);
        //         printWin.document.close();
        //         printWin.print();
        //       }}
        //     >
        //       Print Receipt
        //     </Button>
        //   </Box>
        // </Box>
        <SuperTransferReceipt
          payoutResponse={payoutResponse}
          onRepeat={() => setPayoutResponse(null)}
          onNewTxn={() => {
            setPayoutResponse(null);
            setMobile(""); // reset sender number
            setSender(null); // reset sender
            setSelectedBeneficiary(null); // reset selected beneficiary
          }}
        />
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
