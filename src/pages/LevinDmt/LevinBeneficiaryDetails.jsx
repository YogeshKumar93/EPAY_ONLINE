import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Card,
  IconButton,
  CardContent,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  CheckCircle,
  Error,
  Schedule,
  Send,
  AccountBalance,
  Add,
  Print,
} from "@mui/icons-material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../../utils/ToastUtil";
import AuthContext from "../../contexts/AuthContext";
import OTPInput from "react-otp-input";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../../components/common/CommonModal";
import ResetMpin from "../../components/common/ResetMpin";
import Loader from "../../components/common/Loader";
import {
  abhy2,
  airtel2,
  axis2,
  bandhan2,
  bob2,
  bom2,
  canara2,
  cbi2,
  dbs2,
  hdfc2,
  icici2,
  idbi2,
  idib2,
  indus2,
  jk2,
  kotak2,
  pnb2,
  rbl2,
  sbi2,
  stand2,
  union2,
  yes2,
} from "../../utils/iconsImports";
const LevinBeneficiaryDetails = ({
  open,
  onClose,
  beneficiary,
  senderMobile,
  senderId,
  sender,
  onPayoutSuccess,
  amount: propAmount = "", // Add this prop with default value
}) => {
  const [amount, setAmount] = useState(propAmount); // Initialize with propAmount
  const [loading, setLoading] = useState(false);
  const [mpin, setMpin] = useState("");
  const [transferMode, setTransferMode] = useState("IMPS");
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [loadingPurposes, setLoadingPurposes] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const { location, loadUserProfile, getUuid } = useContext(AuthContext);
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [amountRows, setAmountRows] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [successfulTransactions, setSuccessfulTransactions] = useState([]);
  const [showSuccessSummary, setShowSuccessSummary] = useState(false);
  const maxLimit = 5000;

  useEffect(() => {
    const fetchPurposes = async () => {
      setLoadingPurposes(true);
      try {
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_PURPOSES
        );
        if (response) {
          const data = response?.data || [];
          setPurposes(data);
          if (data.length > 0) setSelectedPurpose(data[0].id);
        } else showToast(error || "Failed to load purposes", "error");
      } catch (err) {
        showToast("Error loading purposes", "error");
      } finally {
        setLoadingPurposes(false);
      }
    };
    if (open) {
      fetchPurposes();
    }
  }, [open]);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      splitAmount(parseFloat(amount));
    }
  }, [amount]);

  useEffect(() => {
    const allCompleted = amountRows.every((row) => row.submitted);
    const successfulTxns = amountRows.filter(
      (row) => row.status === "success" && row.rrn
    );

    if (allCompleted && successfulTxns.length > 0) {
      setSuccessfulTransactions(successfulTxns);
      setShowSuccessSummary(true);
    } else {
      const currentRowData = amountRows[currentRow];
      if (
        currentRowData &&
        currentRowData.submitted &&
        currentRow < amountRows.length - 1
      ) {
        const timer = setTimeout(() => {
          setCurrentRow((prev) => prev + 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [amountRows, currentRow]);

  const splitAmount = (total) => {
    const chunks = [];
    let remaining = total;
    let idx = 0;
    while (remaining > 0) {
      const amt = remaining > maxLimit ? maxLimit : remaining;
      chunks.push({
        id: idx++,
        amount: amt,
        otp: "",
        mpin: "",
        otpRef: null,
        loading: false,
        resendLoading: false,
        submitted: false,
        status: null,
        transferMode: "IMPS",
        rrn: "",
        purpose: selectedPurpose,
      });
      remaining -= amt;
    }
    setAmountRows(chunks);
    setCurrentRow(0);
    setSuccessfulTransactions([]);
    setShowSuccessSummary(false);
  };

  const handleAmountChange = (value) => {
    const limit = parseFloat(sender?.rem_limit || 0);
    const numValue = parseFloat(value) || 0;

    if (numValue > limit) {
      showToast(`Amount exceeds remaining limit of ${limit}`, "warning");
      return;
    }

    setAmount(value);
    setSuccessfulTransactions([]);
    setShowSuccessSummary(false);

    if (numValue > 0) {
      splitAmount(numValue);
    } else {
      setAmountRows([]);
    }
  };

  const handleGetOtp = async (rowId) => {
    const row = amountRows.find((r) => r.id === rowId);
    if (!row) return;

    setAmountRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, loading: true } : r))
    );

    try {
      const { error: uuidError, response: uuidNumber } = await getUuid();

      if (uuidError || !uuidNumber) {
        showToast(
          uuidError?.message || "Failed to generate transaction ID",
          "error"
        );
        return;
      }
      const selectedPurposeObj = purposes.find(
        (p) => p.id === Number(row.purpose || selectedPurpose)
      );
      const purposeType = selectedPurposeObj?.type || "N/A";

      const otpPayload = {
        ben_name: beneficiary.beneficiary_name,
        bank_name: beneficiary.bank_name,
        ben_acc: beneficiary.account_number,
        ifsc: beneficiary.ifsc_code,
        operator: 14,
        type: row.transferMode,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount: row.amount,
        mobile_number: beneficiary.mobile_number || "",
        purpose: purposeType,
        purpose_id: row.purpose || selectedPurpose,
        sender_mobile: senderMobile,
        sender_id: senderId,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_DMT_TXN_OTP,
        otpPayload
      );

      if (response) {
        setAmountRows((prev) =>
          prev.map((r) =>
            r.id === rowId
              ? {
                  ...r,
                  otpRef: response?.data,
                  encrypted_data: response?.encrypted_data,
                  otpPayload: otpPayload,
                  uuidNumber: uuidNumber, // ← Save here
                }
              : r
          )
        );
        showToast(response?.message || "OTP sent successfully", "success");
      } else {
        showToast(error?.message || "Failed to send OTP", "error");
      }
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setAmountRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, loading: false } : r))
      );
    }
  };

  const handleSubmitTransaction = async (rowId, mode) => {
    const row = amountRows.find((r) => r.id === rowId);
    if (!row) return;

    if (!row.otp || row.otp.length !== 6) {
      showToast("Please enter 6-digit OTP", "error");
      return;
    }

    if (!row.mpin || row.mpin.length !== 6) {
      showToast("Please enter 6-digit M-PIN", "error");
      return;
    }

    setAmountRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, loading: true } : r))
    );

    try {
      const finalPayload = {
        ...row.otpPayload,
        otp: row.otp,
        mpin: row.mpin,
        token: row.otpRef,
        encrypted_data: row.encrypted_data,
        type: mode || row.transferMode,
        client_ref: row.uuidNumber, // ← FIXED
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_DMT_TRANSATION2,
        finalPayload
      );

      if (response) {
        showToast(`Transaction of ₹${row.amount} successful!`, "success");
        setAmountRows((prev) =>
          prev.map((r) =>
            r.id === rowId
              ? {
                  ...r,
                  submitted: true,
                  status: "success",
                  rrn: response?.data?.rrn || response?.data?.transaction_id,
                }
              : r
          )
        );

        loadUserProfile();
      } else {
        showToast(error?.message || "Transaction failed", "error");
        setAmountRows((prev) =>
          prev.map((r) =>
            r.id === rowId ? { ...r, submitted: true, status: "failed" } : r
          )
        );
      }
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
      setAmountRows((prev) =>
        prev.map((r) =>
          r.id === rowId ? { ...r, submitted: true, status: "failed" } : r
        )
      );
    } finally {
      setAmountRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, loading: false } : r))
      );
    }
  };

  const handleModeClick = (rowId, mode) => {
    setAmountRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, transferMode: mode } : r))
    );
    handleSubmitTransaction(rowId, mode);
  };

  const handleResendOtp = async (rowId) => {
    await handleGetOtp(rowId);
  };

  const handleNewTransaction = () => {
    setSuccessfulTransactions([]);
    setShowSuccessSummary(false);
    setAmount("");
    setAmountRows([]);
    setCurrentRow(0);
  };

  const handlePrintReceipt = () => {
    // Same print receipt implementation as SelectedBeneficiary
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB");
    const formattedTime = currentDate.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Transaction Receipt</title>
      <style>
        /* Same CSS as SelectedBeneficiary */
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Roboto Mono', monospace; background: #fff; color: #000; line-height: 1.4; padding: 10px; font-size: 12px; }
        .receipt-container { max-width: 280px; margin: 0 auto; border: 1px solid #000; padding: 15px; background: white; }
        .header { text-align: center; margin-bottom: 15px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
        .company-name { font-size: 16px; font-weight: 700; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
        .section { margin-bottom: 12px; }
        .section-title { font-weight: 700; font-size: 11px; text-transform: uppercase; margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 2px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
        .label { font-weight: 500; min-width: 80px; }
        .value { font-weight: 400; text-align: right; flex: 1; }
        .divider { border-top: 2px dashed #000; margin: 10px 0; }
        .total-section { border-top: 2px solid #000; padding-top: 8px; margin-top: 8px; }
        .total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; }
        .rrn-section { background: #f8f8f8; padding: 8px; margin: 8px 0; border: 1px dashed #666; }
        .rrn-title { font-weight: 700; text-align: center; margin-bottom: 5px; font-size: 11px; }
        .footer { text-align: center; margin-top: 20px; font-size: 9px; color: #666; border-top: 1px dashed #000; padding-top: 10px; }
        .currency { font-family: Arial, sans-serif; }
        @media print { body { margin: 0; padding: 5px; } .no-print { display: none; } .receipt-container { border: none; box-shadow: none; } }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="header">
          <div class="company-name">P2 PAE</div>
          <div class="row">
            <span class="label">Datetime:</span>
            <span class="value">${formattedDate} ${formattedTime}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Transaction Details</div>
          <div class="row">
            <span class="label">Mobile:</span>
            <span class="value">${senderMobile || "N/A"}</span>
          </div>
          <div class="row">
            <span class="label">Sender ID:</span>
            <span class="value">${senderId || "N/A"}</span>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="section">
          <div class="section-title">Beneficiary Details</div>
          <div class="row">
            <span class="label">Name:</span>
            <span class="value">${beneficiary.beneficiary_name}</span>
          </div>
          <div class="row">
            <span class="label">A/C:</span>
            <span class="value">${beneficiary.account_number}</span>
          </div>
          <div class="row">
            <span class="label">IFSC:</span>
            <span class="value">${beneficiary.ifsc_code}</span>
          </div>
          <div class="row">
            <span class="label">Bank:</span>
            <span class="value">${beneficiary.bank_name}</span>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="section">
          <div class="section-title">Amount Details</div>
          ${successfulTransactions
            .map(
              (txn, index) => `
            <div class="rrn-section">
              <div class="rrn-title">Transaction ${index + 1}</div>
              <div class="row">
                <span class="label">Amount:</span>
                <span class="value"><span class="currency">₹</span> ${
                  txn.amount
                }</span>
              </div>
              <div class="row">
                <span class="label">Mode:</span>
                <span class="value">${txn.transferMode}</span>
              </div>
              <div class="row">
                <span class="label">RRN:</span>
                <span class="value">${txn.rrn}</span>
              </div>
            </div>
          `
            )
            .join("")}
          
          <div class="row">
            <span class="label">CCF:</span>
            <span class="value"><span class="currency">₹</span> 0.00</span>
          </div>
        </div>
        
        <div class="total-section">
          <div class="total-row">
            <span>Total Amount:</span>
            <span><span class="currency">₹</span> ${amount}</span>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
          <div>© 2025 All Rights Reserved</div>
          <div>This is a system-generated receipt.</div>
          <div>No signature required.</div>
        </div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Print Receipt
        </button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
          Close
        </button>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

    const printWindow = window.open("", "_blank", "width=400,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const SuccessSummary = () => (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(34,197,94,0.15)",
        border: "2px solid",
        borderColor: "success.main",
        background: "linear-gradient(135deg, #f0fff4 0%, #ffffff 100%)",
        mt: 2,
        p: 3,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
        <Typography
          variant="h5"
          fontWeight="700"
          color="success.main"
          gutterBottom
        >
          Transaction Completed Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          All transactions have been processed successfully
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          fontWeight="600"
          gutterBottom
          color="primary.dark"
        >
          Transaction Summary
        </Typography>
        <Paper
          sx={{
            p: 2,
            background: "rgba(34,197,94,0.05)",
            border: "1px solid",
            borderColor: "success.light",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body1" fontWeight="600">
              Sender Mobile:
            </Typography>
            <Typography variant="body1">{senderMobile}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body1" fontWeight="600">
              Beneficiary Name:
            </Typography>
            <Typography variant="body1">
              {beneficiary.beneficiary_name}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body1" fontWeight="600">
              Account Number:
            </Typography>
            <Typography variant="body1">
              {beneficiary.account_number}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body1" fontWeight="600">
              Total Amount:
            </Typography>
            <Typography variant="body1" fontWeight="700" color="success.main">
              ₹{amount}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Box>
        <Typography
          variant="h6"
          fontWeight="600"
          gutterBottom
          color="primary.dark"
        >
          Reference Numbers (RRN)
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {successfulTransactions.map((txn, index) => (
            <Paper
              key={txn.id}
              sx={{
                p: 2,
                background: "white",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Transaction {index + 1}
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    Amount: ₹{txn.amount}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" color="text.secondary">
                    Mode: {txn.transferMode}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="700"
                    color="primary.main"
                    sx={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.9rem",
                    }}
                  >
                    RRN: {txn.rrn}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          mt: 4,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewTransaction}
          startIcon={<Add />}
          size="large"
        >
          New Transaction
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handlePrintReceipt}
          startIcon={<Print />}
          size="large"
        >
          Print Receipt
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClose}
          startIcon={<ArrowBack />}
          size="large"
        >
          Back to Beneficiaries
        </Button>
      </Box>
    </Card>
  );

  const bankImageMapping = {
    SBIN: sbi2,
    IBKL: idbi2,
    UTIB: axis2,
    HDFC: hdfc2,
    ICIC: icici2,
    KKBK: kotak2,
    BARB: bob2,
    PUNB: pnb2,
    MAHB: bom2,
    UBIN: union2,
    DBSS: dbs2,
    RATN: rbl2,
    YESB: yes2,
    INDB: indus2,
    AIRP: airtel2,
    ABHY: abhy2,
    CNRB: canara2,
    BDBL: bandhan2,
    CBIN: cbi2,
    IDIB: idib2,
    SCBL: stand2,
    JAKA: jk2,
  };

  if (!beneficiary || !open) return null;

  return (
    <>
      <Loader loading={loading || otpLoading}>
        {showSuccessSummary ? (
          <SuccessSummary />
        ) : (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              mt: 2,
              background: "linear-gradient(135deg, #f8fbff 0%, #ffffff 100%)",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #6C4BC7 0%, #1a5f9a 100%)",
                color: "#fff",
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                  onClick={onClose}
                  sx={{
                    color: "#fff",
                    p: 1,
                    background: "rgba(255,255,255,0.15)",
                    "&:hover": { background: "rgba(255,255,255,0.25)" },
                  }}
                  size="small"
                >
                  <ArrowBack fontSize="small" />
                </IconButton>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    Send Money to {beneficiary.beneficiary_name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Complete your transaction securely
                  </Typography>
                </Box>
              </Box>

              {amountRows.length > 0 && (
                <Chip
                  label={`${currentRow + 1}/${amountRows.length} Transactions`}
                  size="small"
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: "600",
                    backdropFilter: "blur(10px)",
                  }}
                />
              )}
            </Box>

            <CardContent sx={{ p: 3 }}>
              {/* Beneficiary Card */}
              <Paper
                sx={{
                  p: 1,
                  mb: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
                  boxShadow: "0 2px 12px rgba(34,117,183,0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", md: "center" },
                    gap: { xs: 2, md: 3 },
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  {/* Bank Logo */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "1px solid",
                      borderColor: "divider",
                      flexShrink: 0,
                      alignSelf: { xs: "flex-start", md: "center" },
                    }}
                  >
                    {bankImageMapping[beneficiary.ifsc_code?.slice(0, 4)] ? (
                      <Box
                        component="img"
                        src={
                          bankImageMapping[beneficiary.ifsc_code.slice(0, 4)]
                        }
                        alt={beneficiary.bank_name}
                        sx={{
                          width: { xs: 48, sm: 56 },
                          height: { xs: 48, sm: 56 },
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: { xs: 38, sm: 46 },
                          height: { xs: 38, sm: 46 },
                          bgcolor: "primary.light",
                          fontSize: { xs: 15, sm: 17 },
                        }}
                      >
                        <AccountBalance />
                      </Avatar>
                    )}
                  </Box>

                  {/* Beneficiary Details */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", lg: "row" },
                      alignItems: { lg: "center" },
                      gap: { xs: 2, lg: 3 },
                      flexGrow: 1,
                      width: "100%",
                    }}
                  >
                    {/* Name and Account Info */}
                    <Box sx={{ flex: { lg: 1 } }}>
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        gutterBottom
                        color="primary.dark"
                        sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                      >
                        {beneficiary.beneficiary_name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: { xs: 1, sm: 3 },
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", gap: 0.5 }}
                        >
                          <Box component="strong" sx={{ minWidth: 70 }}>
                            Account:
                          </Box>
                          {beneficiary.account_number}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", gap: 0.5 }}
                        >
                          <Box component="strong" sx={{ minWidth: 45 }}>
                            IFSC:
                          </Box>
                          {beneficiary.ifsc_code}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", gap: 0.5 }}
                        >
                          <Box component="strong" sx={{ minWidth: 45 }}>
                            Bank:
                          </Box>
                          {beneficiary.bank_name}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Amount Input and Purpose */}
                    <Box
                      sx={{
                        flexShrink: 0,
                        minWidth: { xs: "100%", sm: 200, lg: 250 },
                      }}
                    >
                      <TextField
                        label="Total Amount (₹)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "white",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          },
                          mb: 1,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography
                                fontWeight="600"
                                color="primary"
                                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                              >
                                ₹
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        select
                        size="small"
                        fullWidth
                        value={selectedPurpose}
                        onChange={(e) => setSelectedPurpose(e.target.value)}
                        sx={{ mb: 1 }}
                        SelectProps={{ native: true }}
                      >
                        {loadingPurposes ? (
                          <option>Loading purposes...</option>
                        ) : (
                          purposes.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.type}
                            </option>
                          ))
                        )}
                      </TextField>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Transaction Rows */}
              {amountRows.map((row, idx) => (
                <Paper
                  key={row.id}
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    mb: { xs: 1.5, sm: 2 },
                    border: "2px solid",
                    borderColor: idx === currentRow ? "#6C4BC7" : "transparent",
                    borderRadius: 3,
                    background:
                      idx === currentRow
                        ? "linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)"
                        : "white",
                    boxShadow:
                      idx === currentRow
                        ? "0 8px 32px rgba(34,117,183,0.15)"
                        : "0 4px 12px rgba(0,0,0,0.08)",
                    transition:
                      "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before":
                      idx === currentRow
                        ? {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 4,
                            height: "100%",
                            background:
                              "linear-gradient(180deg, #6C4BC7 0%, #1a5f9a 100%)",
                          }
                        : {},
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  {/* Header Section */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        color="primary.dark"
                      >
                        ₹{row.amount}
                      </Typography>
                      {row.submitted && (
                        <Chip
                          icon={
                            row.status === "success" ? (
                              <CheckCircle fontSize="small" />
                            ) : (
                              <Error fontSize="small" />
                            )
                          }
                          label={
                            row.status === "success" ? "Success" : "Failed"
                          }
                          color={row.status === "success" ? "success" : "error"}
                          size="small"
                          variant="filled"
                          sx={{
                            fontWeight: "500",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Active Row Content */}
                  {idx === currentRow && !row.submitted && (
                    <Box>
                      {!row.otpRef ? (
                        <Box sx={{ textAlign: "center", py: 2 }}>
                          <Button
                            variant="contained"
                            size="large"
                            onClick={() => handleGetOtp(row.id)}
                            disabled={row.loading}
                            startIcon={
                              row.loading ? (
                                <CircularProgress
                                  size={20}
                                  sx={{ color: "white" }}
                                />
                              ) : (
                                <Send sx={{ fontSize: 20 }} />
                              )
                            }
                            sx={{
                              borderRadius: 3,
                              px: 4,
                              py: 1.5,
                              fontSize: "1rem",
                              fontWeight: "600",
                              background:
                                "linear-gradient(135deg, #6C4BC7 0%, #1a5f9a 100%)",
                              boxShadow: "0 4px 15px rgba(34,117,183,0.3)",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #1a5f9a 0%, #154a7a 100%)",
                                boxShadow: "0 6px 20px rgba(34,117,183,0.4)",
                                transform: "translateY(-1px)",
                              },
                              minWidth: { xs: "100%", sm: "auto" },
                            }}
                          >
                            {row.loading ? "Sending OTP..." : "Get OTP"}
                          </Button>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          {/* Index Number */}
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #6C4BC7 0%, #1a5f9a 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "0.875rem",
                              fontWeight: "bold",
                              boxShadow: "0 2px 8px rgba(34,117,183,0.3)",
                              flexShrink: 0,
                              mt: 0.5,
                            }}
                          >
                            {idx + 1}
                          </Box>

                          {/* Content Area */}
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-end",
                                gap: { xs: 1, sm: 2 },
                                flexWrap: { xs: "wrap", lg: "nowrap" },
                              }}
                            >
                              {/* OTP Input */}
                              <Box
                                sx={{
                                  flex: { xs: "1 1 100%", md: 2, lg: 2.5 },
                                  minWidth: 0,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="600"
                                  gutterBottom
                                  color="text.primary"
                                  sx={{
                                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                                  }}
                                >
                                  OTP Verification
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    background: "white",
                                    border: "1.5px solid #E0E6ED",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    transition: "all 0.3s ease",
                                    height: 50,
                                    "&:focus-within": {
                                      borderColor: "#6C4BC7",
                                      boxShadow:
                                        "0 0 0 3px rgba(34,117,183,0.1)",
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      flex: 1,
                                      px: { xs: 1, sm: 2 },
                                      display: "flex",
                                    }}
                                  >
                                    <OTPInput
                                      value={row.otp}
                                      onChange={(val) =>
                                        setAmountRows((prev) =>
                                          prev.map((r) =>
                                            r.id === row.id
                                              ? { ...r, otp: val }
                                              : r
                                          )
                                        )
                                      }
                                      numInputs={6}
                                      renderInput={(props) => (
                                        <input
                                          {...props}
                                          style={{
                                            width: 25,
                                            height: 30,
                                            margin: "0 2px",
                                            fontSize: 14,
                                            border: "none",
                                            borderBottom: "2px solid #E0E0E0",
                                            borderRadius: 0,
                                            textAlign: "center",
                                            background: "transparent",
                                            fontWeight: "600",
                                            outline: "none",
                                            transition: "all 0.2s ease",
                                          }}
                                          onFocus={(e) => {
                                            e.target.style.borderBottomColor =
                                              "#6C4BC7";
                                            e.target.style.background =
                                              "#f8fbff";
                                          }}
                                          onBlur={(e) => {
                                            e.target.style.borderBottomColor =
                                              "#E0E0E0";
                                            e.target.style.background =
                                              "transparent";
                                          }}
                                        />
                                      )}
                                      inputType="tel"
                                    />
                                  </Box>

                                  <Button
                                    onClick={() => handleResendOtp(row.id)}
                                    disabled={row.resendLoading}
                                    sx={{
                                      minWidth: 70,
                                      height: "100%",
                                      px: 1.5,
                                      fontSize: "0.7rem",
                                      fontWeight: 700,
                                      whiteSpace: "nowrap",
                                      background: "transparent",
                                      color: row.resendLoading
                                        ? "#999"
                                        : "#6C4BC7",
                                      border: "none",
                                      borderRadius: 0,
                                      "&:hover": {
                                        background: row.resendLoading
                                          ? "transparent"
                                          : "#f0f8ff",
                                      },
                                    }}
                                  >
                                    {row.resendLoading ? (
                                      <CircularProgress size={14} />
                                    ) : (
                                      "Resend"
                                    )}
                                  </Button>
                                </Box>
                              </Box>

                              {/* MPIN Input */}
                              <Box
                                sx={{
                                  flex: { xs: "1 1 100%", md: 1.5, lg: 2 },
                                  minWidth: 0,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="600"
                                  gutterBottom
                                  color="text.primary"
                                  sx={{
                                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                                  }}
                                >
                                  M-PIN
                                </Typography>
                                <Box
                                  sx={{
                                    background: "white",
                                    border: "1.5px solid #E0E6ED",
                                    borderRadius: 2,
                                    px: { xs: 1, sm: 2 },
                                    py: 1.5,
                                    transition: "all 0.3s ease",
                                    height: 50,
                                    display: "flex",
                                    alignItems: "center",
                                    "&:focus-within": {
                                      borderColor: "#6C4BC7",
                                      boxShadow:
                                        "0 0 0 3px rgba(34,117,183,0.1)",
                                    },
                                  }}
                                >
                                  <OTPInput
                                    value={row.mpin}
                                    onChange={(val) =>
                                      setAmountRows((prev) =>
                                        prev.map((r) =>
                                          r.id === row.id
                                            ? { ...r, mpin: val }
                                            : r
                                        )
                                      )
                                    }
                                    numInputs={6}
                                    inputType="password"
                                    renderInput={(props) => (
                                      <input
                                        {...props}
                                        style={{
                                          width: 25,
                                          height: 30,
                                          margin: "0 2px",
                                          fontSize: 14,
                                          border: "none",
                                          borderBottom: "2px solid #E0E0E0",
                                          borderRadius: 0,
                                          textAlign: "center",
                                          background: "transparent",
                                          fontWeight: "600",
                                          outline: "none",
                                          transition: "all 0.2s ease",
                                        }}
                                        onFocus={(e) => {
                                          e.target.style.borderBottomColor =
                                            "#6C4BC7";
                                          e.target.style.background = "#f8fbff";
                                        }}
                                        onBlur={(e) => {
                                          e.target.style.borderBottomColor =
                                            "#E0E0E0";
                                          e.target.style.background =
                                            "transparent";
                                        }}
                                      />
                                    )}
                                  />
                                </Box>
                              </Box>

                              {/* Transfer Mode */}
                              <Box
                                sx={{
                                  flex: { xs: "1 1 100%", md: 1.5, lg: 1.5 },
                                  minWidth: 0,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="600"
                                  gutterBottom
                                  color="text.primary"
                                  sx={{
                                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                                  }}
                                >
                                  Transfer Mode
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    height: 50,
                                    alignItems: "center",
                                  }}
                                >
                                  <Button
                                    variant={
                                      row.transferMode === "IMPS"
                                        ? "contained"
                                        : "outlined"
                                    }
                                    color="primary"
                                    onClick={() =>
                                      handleModeClick(row.id, "IMPS")
                                    }
                                    size="small"
                                    disabled={
                                      row.otp.length !== 6 ||
                                      row.mpin.length !== 6 ||
                                      row.loading
                                    }
                                    sx={{
                                      flex: 1,
                                      height: 36,
                                      borderRadius: 2,
                                      fontWeight: 600,
                                      textTransform: "none",
                                      fontSize: "0.7rem",
                                      boxShadow:
                                        row.transferMode === "IMPS"
                                          ? "0 2px 6px rgba(34,117,183,0.3)"
                                          : "none",
                                      minWidth: 60,
                                    }}
                                  >
                                    ₹{row.amount} IMPS
                                  </Button>
                                  <Button
                                    variant={
                                      row.transferMode === "NEFT"
                                        ? "contained"
                                        : "outlined"
                                    }
                                    color="primary"
                                    onClick={() =>
                                      handleModeClick(row.id, "NEFT")
                                    }
                                    size="small"
                                    disabled={
                                      row.otp.length !== 6 ||
                                      row.mpin.length !== 6 ||
                                      row.loading
                                    }
                                    sx={{
                                      flex: 1,
                                      height: 36,
                                      borderRadius: 2,
                                      fontWeight: 600,
                                      textTransform: "none",
                                      fontSize: "0.7rem",
                                      boxShadow:
                                        row.transferMode === "NEFT"
                                          ? "0 2px 6px rgba(34,117,183,0.3)"
                                          : "none",
                                      minWidth: 60,
                                    }}
                                  >
                                    ₹{row.amount} NEFT
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Inactive Row Status */}
                  {idx !== currentRow && (
                    <Box sx={{ textAlign: "center", py: 1.5 }}>
                      {row.submitted ? (
                        <Chip
                          icon={
                            row.status === "success" ? (
                              <CheckCircle />
                            ) : (
                              <Error />
                            )
                          }
                          label={`₹${row.amount} - ${
                            row.status === "success" ? "Success" : "Failed"
                          }${row.rrn ? ` (RRN: ${row.rrn})` : ""} (${
                            row.transferMode
                          })`}
                          color={row.status === "success" ? "success" : "error"}
                          size="small"
                          variant="filled"
                          sx={{
                            fontWeight: "500",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<Schedule />}
                          label="Waiting for turn..."
                          color="default"
                          size="small"
                          variant="outlined"
                          sx={{
                            background: "rgba(0,0,0,0.02)",
                            borderColor: "#e0e0e0",
                          }}
                        />
                      )}
                    </Box>
                  )}
                </Paper>
              ))}
            </CardContent>
          </Card>
        )}
      </Loader>
    </>
  );
};
export default LevinBeneficiaryDetails;
