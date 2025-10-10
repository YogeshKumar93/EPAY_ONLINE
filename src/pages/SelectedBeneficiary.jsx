import { useState, useContext, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  InputAdornment,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  AccountBalance,
  ArrowBack,
  CheckCircle,
  CheckCircleOutline,
  CheckCircleOutlineOutlined,
  Error,
  Schedule,
  Send,
} from "@mui/icons-material";
import OTPInput from "react-otp-input";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";
import ResetMpin from "../components/common/ResetMpin";
import { showSuccessToast } from "../components/common/ShowSuccessToast";
import { useNavigate } from "react-router-dom";
import CommonModal from "../components/common/CommonModal";
import { toWords } from "number-to-words";
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
} from "../iconsImports";

const SelectedBeneficiary = ({
  beneficiary,
  senderId,
  senderMobile,
  referenceKey,
  sender,
  onBack,
  amount,
}) => {
  const { location } = useContext(AuthContext);
  const authCtx = useContext(AuthContext);

  const loadUserProfile = authCtx.loadUserProfile;

  const user = authCtx?.user;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [totalAmount, setTotalAmount] = useState(amount || "");
  const { showToast } = useToast();
  const [openResetModal, setOpenResetModal] = useState(false);
  const username = `TRANS${user?.id}`;
  const [currentRow, setCurrentRow] = useState(0);
  const maxLimit = 5000;

  const [amountRows, setAmountRows] = useState([]);
  const amountInWords = amount ? `${toWords(parseInt(amount))} Rupees` : "";

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      splitAmount(parseFloat(amount));
    }
  }, [amount]);

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
        transferMode: "IMPS", // Default mode for each row
        rrn: "",
      });
      remaining -= amt;
    }
    setAmountRows(chunks);
    setCurrentRow(0);
  };

  const handleAmountChange = (value) => {
    const limit = parseFloat(sender?.limitAvailable || 0);
    const numValue = parseFloat(value) || 0;

    if (numValue > limit) {
      showToast(`Amount cannot exceed available limit: ${limit}`, "Error");
      return;
    }

    setTotalAmount(value);

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
      const payload = {
        referenceKey,
        number: senderMobile,
        beneficiary_id: beneficiary.id,
        amount: row.amount,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.OTP_DMT1_BENEFICIARY,
        payload
      );

      if (error) {
        showToast(error, "error");
      } else {
        showToast(response?.message || "OTP sent successfully!", "success");
        setAmountRows((prev) =>
          prev.map((r) =>
            r.id === rowId
              ? { ...r, otpRef: response?.data?.referenceKey, otp: "" }
              : r
          )
        );
      }
    } catch (err) {
      showToast(err, "error");
    } finally {
      setAmountRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, loading: false } : r))
      );
    }
  };
  // const handleSubmitRow = async (rowId) => {
  //   // ✅ Accept rowId parameter
  //   const row = amountRows.find((r) => r.id === rowId);
  //   if (!row) return;

  //   if (!row.otp || row.otp.length !== 6) {
  //     showToast("Please enter 6-digit OTP", "Error");
  //     return;
  //   }

  //   if (!row.mpin || row.mpin.length !== 6) {
  //     showToast("Please enter 6-digit M-PIN", "Error");
  //     return;
  //   }

  //   setAmountRows(
  //     (prev) => prev.map((r) => (r.id === rowId ? { ...r, loading: true } : r)) // ✅ Fixed comparison
  //   );

  //   try {
  //     const payload = {
  //       sender_id: senderId,
  //       ben_id: beneficiary.bene_id,
  //       ben_name: beneficiary.beneficiary_name,
  //       ben_acc: beneficiary.account_number,
  //       ifsc: beneficiary.ifsc_code,
  //       bank_name: beneficiary.bank_name,
  //       mobile_number: beneficiary.mobile_number,
  //       operator: 13,
  //       latitude: location?.lat || "",
  //       longitude: location?.long || "",
  //       amount: row.amount,
  //       otp: row.otp,
  //       referenceKey: row.otpRef,
  //       type: row.transferMode,
  //       mpin: row.mpin,
  //       pf: "web",
  //     };

  //     const { response, error } = await apiCall(
  //       "post",
  //       ApiEndpoints.DMT1_TXN,
  //       payload
  //     );

  //     if (error) {
  //       showToast(error, "error");
  //       // setAmountRows((prev) =>
  //       //   prev.map(
  //       //     (r) =>
  //       //       r.id === rowId ? { ...r, submitted: true, status: "failed" } : r // ✅ Fixed
  //       //   )
  //       // );
  //     } else if (response?.status && response?.data?.message === "Success") {
  //       showToast(`Transaction of ₹${row.amount} successful!`, "success");
  //       setAmountRows((prev) =>
  //         prev.map(
  //           (r) =>
  //             r.id === rowId
  //               ? {
  //                   ...r,
  //                   submitted: true,
  //                   status: "success",
  //                   rrn: response?.data?.rrn,
  //                 }
  //               : r // ✅ Fixed
  //         )
  //       );

  //       showSuccessToast({
  //         txnID: response?.data?.rrn,
  //         message: response?.message,
  //         redirectUrl: "/print-dmt",
  //       });
  //       loadUserProfile();
  //       setTimeout(() => {
  //         if (currentRow < amountRows.length - 1) {
  //           setCurrentRow((prev) => prev + 1);
  //         }
  //       }, 2000);
  //     } else {
  //       showToast(response?.message || "Transaction failed", "error");
  //       setAmountRows((prev) =>
  //         prev.map(
  //           (r) =>
  //             r.id === rowId ? { ...r, submitted: true, status: "failed" } : r // ✅ Fixed
  //         )
  //       );
  //     }
  //   } catch (err) {
  //     showToast(err, "error");
  //     setAmountRows((prev) =>
  //       prev.map(
  //         (r) =>
  //           r.id === rowId ? { ...r, submitted: true, status: "failed" } : r // ✅ Fixed
  //       )
  //     );
  //   } finally {
  //     setAmountRows(
  //       (prev) =>
  //         prev.map((r) => (r.id === rowId ? { ...r, loading: false } : r)) // ✅ Fixed
  //     );
  //   }
  // };

  const handleModeClick = (rowId, mode) => {
    // 1️⃣ Update row transferMode
    setAmountRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, transferMode: mode } : r))
    );

    // 2️⃣ Turant submit row with selected mode
    submitRowWithMode(rowId, mode);
  };

  const submitRowWithMode = async (rowId, mode) => {
    const row = amountRows.find((r) => r.id === rowId);
    if (!row) return;

    setAmountRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, loading: true } : r))
    );

    try {
      const payload = {
        sender_id: senderId,
        ben_id: beneficiary.bene_id,
        ben_name: beneficiary.beneficiary_name,
        ben_acc: beneficiary.account_number,
        ifsc: beneficiary.ifsc_code,
        bank_name: beneficiary.bank_name,
        mobile_number: beneficiary.mobile_number,
        operator: 13,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount: row.amount,
        otp: row.otp, // optional, if needed
        referenceKey: row.otpRef, // optional
        type: mode, // ✅ type from button click
        mpin: row.mpin, // optional
        pf: "web",
      };

      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.DMT1_TXN,
        payload
      );

      if (error) {
        showToast(error, "error");
      } else if (response?.status && response?.data?.message === "Success") {
        showToast(`Transaction of ₹${row.amount} successful!`, "success");
        setAmountRows((prev) =>
          prev.map((r) =>
            r.id === rowId
              ? {
                  ...r,
                  submitted: true,
                  status: "success",
                  rrn: response?.data?.rrn,
                }
              : r
          )
        );
      } else {
        showToast(response?.message || "Transaction failed", "error");
      }
    } catch (err) {
      showToast(err, "error");
    } finally {
      setAmountRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, loading: false } : r))
      );
    }
  };

  const handleResendOtp = async (row) => {
    await handleGetOtp(row);
  };

  if (!beneficiary) return null;

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

  return (
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
      {/* Enhanced Header */}
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
            onClick={onBack}
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
            background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
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
                  src={bankImageMapping[beneficiary.ifsc_code.slice(0, 4)]}
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

              {/* Amount Input */}
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
                  value={totalAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "white",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    },
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
                  {amount && (
        <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
          {amountInWords.charAt(0).toUpperCase() + amountInWords.slice(1) } Only
        </Typography>
      )}
              </Box>
            </Box>
          </Box>
        </Paper>

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
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
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
                {row.submitted && (
                  <Chip
                    icon={
                      row.status === "success" ? (
                        <CheckCircle fontSize="small" />
                      ) : (
                        <Error fontSize="small" />
                      )
                    }
                    label={row.status === "success" ? "Success" : "Failed"}
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
                          <CircularProgress size={20} sx={{ color: "white" }} />
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
                        "&:active": {
                          transform: "translateY(0)",
                        },
                        minWidth: { xs: "100%", sm: "auto" },
                      }}
                    >
                      {row.loading ? "Sending OTP..." : "Get OTP"}
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
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
                        mt: 0.5, // Small top margin to align with content
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
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
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
                                boxShadow: "0 0 0 3px rgba(34,117,183,0.1)",
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
                                      r.id === row.id ? { ...r, otp: val } : r
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
                                      e.target.style.background = "#f8fbff";
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.borderBottomColor =
                                        "#E0E0E0";
                                      e.target.style.background = "transparent";
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
                                color: row.resendLoading ? "#999" : "#6C4BC7",
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
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
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
                                boxShadow: "0 0 0 3px rgba(34,117,183,0.1)",
                              },
                            }}
                          >
                            <OTPInput
                              value={row.mpin}
                              onChange={(val) =>
                                setAmountRows((prev) =>
                                  prev.map((r) =>
                                    r.id === row.id ? { ...r, mpin: val } : r
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
                                    e.target.style.background = "transparent";
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
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
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
                              onClick={() => handleModeClick(row.id, "IMPS")}
                              size="small"
                              disabled={
                                row.otp.length !== 6 || row.mpin.length !== 6
                              } // ✅ Disable if OTP or M-PIN not complete
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
                              onClick={() => handleModeClick(row.id, "NEFT")}
                              size="small"
                              disabled={
                                row.otp.length !== 6 || row.mpin.length !== 6
                              } // ✅ Disable if OTP or M-PIN not complete
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
                      row.status === "success" ? <CheckCircle /> : <Error />
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

      {/* <ResetMpin
        open={openResetModal}
        onClose={() => setOpenResetModal(false)}
        username={username}
      /> */}
    </Card>
  );
};
export default SelectedBeneficiary;
