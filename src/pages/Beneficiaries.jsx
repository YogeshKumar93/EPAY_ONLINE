import React, { useContext, useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  Stack,
  Button,
  IconButton,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
  TextField,
  Grid,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
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
} from "../utils/iconsImports";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import DeleteBeneficiaryModal from "./DeleteBeneficiaryModal";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";
import { convertNumberToWordsIndian } from "../utils/NumberUtil";

const Beneficiaries = ({ beneficiaries, onSelect, sender, onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [verifyOpen, setVerifyOpen] = useState(false); // 🔑 verify modal state
  const [verifyUpiOpen, setVerifyUpiOpen] = useState(false); // 🔑 verify modal state
  const [mpinDigits, setMpinDigits] = useState(Array(6).fill(""));
  const [searchText, setSearchText] = useState("");
  const [pendingPayload, setPendingPayload] = useState(null);
  const { showToast } = useToast();
  const [amountInputs, setAmountInputs] = useState({});
  const { location, getUuid } = useContext(AuthContext);
  const [amountInWords, setAmountInWords] = useState({});
  // console.log("limit", sender?.limitTotal);
  const [uuid, setUuid] = useState(null); // ✅ new state

  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.ADD_DMT1_SCHEMA, openModal, {
      sender_id: sender?.id,
    });
  useEffect(() => {
    if (verifyOpen || verifyUpiOpen) {
      const fetchUuid = async () => {
        try {
          const { error, response } = await getUuid();
          if (response) {
            setUuid(response);
          } else if (error) {
            showToast(error?.message || "Failed to generate UUID", "error");

            // 🔹 Conditionally close whichever modal is open
            if (verifyOpen) setVerifyOpen(false);
            if (verifyUpiOpen) setVerifyUpiOpen(false);
          }
        } catch (err) {
          showToast("Error while generating UUID", "error");

          // 🔹 Conditionally close whichever modal is open
          if (verifyOpen) setVerifyOpen(false);
          if (verifyUpiOpen) setVerifyUpiOpen(false);
        }
      };

      fetchUuid();
    }
  }, [verifyOpen, verifyUpiOpen]);
  console.log("uuid", uuid);

  const handleAmountChange = (beneficiaryId, value) => {
    // Allow only numbers and decimal
    const numericValue = value.replace(/[^\d.]/g, "");
    const amount = parseFloat(numericValue);
    const limit = parseFloat(sender?.limitTotal || 0);

    // ✅ Check against sender limit
    if (limit && amount > limit) {
      showToast(`Amount cannot exceed your limit of ₹${limit}`, "error");
      return; // Stop further update
    }

    setAmountInputs((prev) => ({
      ...prev,
      [beneficiaryId]: numericValue,
    }));

    // ✅ Convert to words
    if (numericValue && !isNaN(numericValue)) {
      const words = convertNumberToWordsIndian(numericValue);
      setAmountInWords((prev) => ({
        ...prev,
        [beneficiaryId]:
          words.charAt(0).toUpperCase() + words.slice(1) + " Only",
      }));
    } else {
      setAmountInWords((prev) => ({
        ...prev,
        [beneficiaryId]: "",
      }));
    }
  };

  // ✅ Handle Send Money with amount
  const handleSendMoney = (beneficiary) => {
    const amount = amountInputs[beneficiary.id] || "";

    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid amount");
      return;
    }

    // ✅ Pass beneficiary with entered amount to parent component
    onSelect?.({
      ...beneficiary,
      enteredAmount: parseFloat(amount),
    });

    // ✅ Clear the amount input after sending
    setAmountInputs((prev) => ({
      ...prev,
      [beneficiary.id]: "",
    }));
  };

  const handleAddAndVerifyBeneficiary = () => {
    setErrors({});
    const payload = {
      ...formData,
      sender_id: sender?.id,
      mobile_number: sender?.mobileNumber,
      rem_mobile: sender?.mobileNumber,
      ben_name: formData.name,
      ben_acc: formData.account_number,
      ifsc: formData.ifsc,
      operator: 18,
      latitude: location?.lat || "",
      longitude: location?.long || "",
      pf: "WEB",
      client_ref: uuid,
    };
    setPendingPayload(payload); // 🔹 save payload
    setVerifyOpen(true); // 🔹 open MPIN modal
  };

  const handleVerify = async () => {
    if (mpinDigits.some((d) => !d)) {
      showToast("Please enter all 6 digits of MPIN", "error");
      return;
    }
    const mpin = mpinDigits.join("");

    try {
      setSubmitting(true);

      // 🔹 Step 1: Verify
      const verifyPayload = {
        ...pendingPayload,
        mpin,
        client_ref: uuid,
      };

      const { error: verifyError, response: verifyResponse } = await apiCall(
        "post",
        ApiEndpoints.DMT1_VERIFY_BENEFICIARY,
        verifyPayload
      );

      if (!verifyResponse) {
        showToast(
          verifyError?.message || "Failed to verify beneficiary",
          "error"
        );
        setSubmitting(false);
        setVerifyOpen(false);
        setMpinDigits(Array(6).fill(""));
        return;
      }

      // ✅ Extract name & encrypted_data from verify response
      const verifiedName = verifyResponse?.data || verifyResponse?.message;
      const encryptedData = verifyResponse?.encrypted_data;

      // 🔹 Step 2: Add Beneficiary with verified data
      const addPayload = {
        ...pendingPayload,
        ben_name: verifiedName, // ✅ Verified name
        rem_mobile: sender?.mobileNumber, // ✅ Sender mobile
        name: verifiedName,
        is_verified: new Date().toISOString(),
        encrypted_data: encryptedData, // 🔐 If backend needs it
      };

      const { error: addError, response: addResponse } = await apiCall(
        "post",
        ApiEndpoints.REGISTER_DMT1_BENEFICIARY,
        addPayload
      );

      if (addResponse) {
        okSuccessToast(
          addResponse?.message || "Beneficiary verified & added successfully"
        );
        setVerifyOpen(false);
        setOpenModal(false);
        setMpinDigits(Array(6).fill(""));
        onSuccess?.(sender.mobileNumber);
      } else {
        showToast(addError?.message || "Failed to add beneficiary", "error");
      }
    } catch (err) {
      showToast(err, "error");
    } finally {
      setSubmitting(false);
    }
  };
  const handleVerifyUpi = async () => {
    if (mpinDigits.some((d) => !d)) {
      showToast("Please enter all 6 digits of MPIN", "error");
      return;
    }
    const mpin = mpinDigits.join("");

    try {
      setSubmitting(true);

      // 🔹 Step 1: Verify
      const verifyPayload = {
        ...pendingPayload,
        mpin,
        client_ref: uuid,
      };

      const { error: verifyError, response: verifyResponse } = await apiCall(
        "post",
        ApiEndpoints.DMT1_VERIFY_BENEFICIARY,
        verifyPayload
      );

      if (!verifyResponse) {
        showToast(
          verifyError?.message || "Failed to verify beneficiary",
          "error"
        );
        setSubmitting(false);
        setVerifyOpen(false);
        setMpinDigits(Array(6).fill(""));
        return;
      } else {
        showToast(verifyResponse?.message, "success");
        onSuccess?.(sender.mobileNumber);
        setVerifyUpiOpen(false);
      }
    } catch (err) {
      showToast(err, "error");
    } finally {
      setSubmitting(false);
    }
  };
  // ✅ NEW FUNCTION — Directly Add Beneficiary (without verify)
  const handleAddBeneficiary = async () => {
    setErrors({});

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        sender_id: sender?.id,
        mobile_number: sender?.mobileNumber,
        rem_mobile: sender?.mobileNumber,
        ben_name: formData.name,
        ben_acc: formData.account_number,
        ifsc: formData.ifsc,
        operator: 18,
        is_verified: 0,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        pf: "WEB",
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.REGISTER_DMT1_BENEFICIARY,
        payload
      );

      if (response?.status) {
        okSuccessToast(response.message || "Beneficiary added successfully");
        setOpenModal(false);
        onSuccess?.(sender.mobileNumber);
      } else {
        showToast(error?.message || "Failed to add beneficiary", "error");
      }
    } catch (err) {
      apiErrorToast(err?.message || "Something went wrong while adding");
    } finally {
      setSubmitting(false);
    }
  };

  // const handleVerify = async () => {
  //   if (mpinDigits.some((d) => !d)) {
  //     apiErrorToast("Please enter all 6 digits of MPIN");
  //     return;
  //   }
  //   const mpin = mpinDigits.join("");

  //   try {
  //     setSubmitting(true);

  //     const payload = {
  //       mobile_number: sender?.mobileNumber,
  //       sender_id: sender?.id,
  //       ben_id: selectedBeneficiary.id || "",
  //       ben_name: selectedBeneficiary.beneficiary_name,
  //       ben_acc: selectedBeneficiary.account_number,
  //       ifsc: selectedBeneficiary.ifsc_code,
  //       operator: 18,
  //       latitude: location?.lat || "",
  //       longitude: location?.long || "",
  //       pf: "WEB",
  //       mpin,
  //     };

  //     const { error, response } = await apiCall(
  //       "post",
  //       ApiEndpoints.DMT1_VERIFY_BENEFICIARY,
  //       payload
  //     );

  //     if (response) {
  //       okSuccessToast(
  //         response?.message || "Beneficiary verified successfully"
  //       );
  //       setVerifyOpen(false);
  //       setMpinDigits(Array(6).fill(""));
  //       onSuccess?.(sender.mobileNumber);
  //     } else {
  //       setVerifyOpen(false);
  //       setMpinDigits(Array(6).fill(""));
  //       apiErrorToast(error?.message || "Failed to verify beneficiary");
  //     }
  //   } catch (err) {
  //     apiErrorToast(err);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleMpinChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newDigits = [...mpinDigits];
      newDigits[index] = value;
      setMpinDigits(newDigits);
      if (value && index < 5) {
        document.getElementById(`mpin-${index + 1}`).focus();
      }
    }
  };

  // normalize to always have at least one "N/A" entry
  const normalized =
    beneficiaries && beneficiaries.length > 0
      ? beneficiaries
      : [
          {
            id: "na",
            beneficiary_name: "No beneficiaries added",
            name: "N/A",
            ifsc: "N/A",
            account: "N/A",
            verificationDt: null,
            bank_name: null,
          },
        ];

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
  const filteredBeneficiaries = normalized.filter((b) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      b.beneficiary_name?.toLowerCase().includes(lowerSearch) ||
      b.account_number?.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#6C4BC7",
          color: "#fff",
          py: 1,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Beneficiary List ({beneficiaries?.length || 0})
        </Typography>

        <Box ml={isMobile ? 1 : "auto"}>
          {sender && (
            <Button
              variant="contained"
              size="small"
              onClick={() => setOpenModal(true)}
              startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: "#000",
                backgroundColor: "#fff",
                textTransform: "none",
                fontSize: "0.7rem",
              }}
            >
              Add Beneficiary
            </Button>
          )}
        </Box>
        {isMobile && (
          <IconButton size="small" sx={{ color: "white" }}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      {/* Collapse wrapper */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 2 }}>
          {
            <Box mb={2}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search beneficiary by name or account number"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Box>
          }
          <List dense sx={{ py: 0 }}>
            {filteredBeneficiaries.map((b) => (
              <ListItem
                key={b.id}
                sx={{
                  py: 1.5,
                  px: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: b.id === "na" ? "transparent" : "divider",
                  backgroundColor:
                    b.id === "na" ? "transparent" : "background.paper",
                  boxShadow:
                    b.id !== "na" ? "0 2px 6px rgba(0,0,0,0.04)" : "none",
                  opacity: b.id === "na" ? 0.7 : 1,
                }}
                secondaryAction={
                  b.id !== "na" && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      {b.is_verified === "0" ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedBeneficiary(b);
                            setVerifyUpiOpen(true);
                            setPendingPayload({
                              sender_id: sender?.id,
                              ben_name: b.beneficiary_name,
                              ben_acc: b.account_number,
                              ifsc: b.ifsc_code,
                              mobile_number: sender?.mobileNumber,
                              operator: 18,
                              type: "DMT",
                              is_verified: new Date().toISOString(),
                              latitude: location?.lat || "",
                              longitude: location?.long || "",
                              pf: "WEB",
                            });
                          }}
                          sx={{
                            backgroundColor: "#ff9d4d",
                            color: "#fff",
                            borderRadius: 1,
                            border: "none",
                            textTransform: "none",
                            fontSize: "0.75rem",
                            px: 1,
                            py: 0.2,
                          }}
                        >
                          Verify
                        </Button>
                      ) : (
                        <Box display="flex" alignItems="center" gap={0.3}>
                          <CheckCircleIcon
                            sx={{ fontSize: 16, color: "success.main" }}
                          />
                          <Typography
                            variant="caption"
                            color="success.main"
                            fontWeight="500"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            Verified
                          </Typography>
                        </Box>
                        // <Box display="flex" alignItems="center" gap={0.3}>
                        //   <Typography
                        //     variant="caption"
                        //     color="red"
                        //     fontWeight="500"
                        //     sx={{ fontSize: "0.75rem" }}
                        //   >
                        //     Not Verified
                        //   </Typography>
                        // </Box>
                      )}

                      <TextField
                        size="small"
                        placeholder="Amount"
                        value={amountInputs[b.id] || ""}
                        onChange={(e) =>
                          handleAmountChange(b.id, e.target.value)
                        }
                        inputProps={{
                          style: {
                            width: "90px",
                            textAlign: "center",
                            fontSize: "0.75rem",
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: "32px",
                          },
                        }}
                      />

                      {/* ✅ Send Money Button */}
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleSendMoney(b)}
                        sx={{
                          backgroundColor: "#6C4BC7",
                          borderRadius: 1,
                          textTransform: "none",
                          fontSize: isMobile ? "0.6rem" : "0.75rem",
                          px: 1,
                          py: 0.2,
                        }}
                      >
                        Send Money
                      </Button>

                      <IconButton
                        edge="end"
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBeneficiary(b);
                          setDeleteOpen(true);
                        }}
                      >
                        <Tooltip title="Delete Beneficiary">
                          <DeleteIcon fontSize="small" />
                        </Tooltip>
                      </IconButton>
                    </Stack>
                  )
                }
              >
                <Box display="flex" alignItems="center" gap={1.5} width="100%">
                  {/* Bank logo */}
                  {bankImageMapping[b.ifsc_code?.slice(0, 4)] ? (
                    <Box
                      component="img"
                      src={bankImageMapping[b.ifsc_code.slice(0, 4)]}
                      alt={b.bank_name}
                      sx={{
                        width: 36,
                        height: 36,
                        objectFit: "contain",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        p: 0.5,
                        backgroundColor: "white",
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "primary.light",
                        fontSize: 16,
                      }}
                    >
                      <AccountBalanceIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}

                  {/* Details */}
                  <Box flexGrow={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        noWrap
                        sx={{
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          color:
                            b.id === "na" ? "text.secondary" : "text.primary",
                        }}
                      >
                        {b.beneficiary_name}
                      </Typography>
                    </Box>
                    <Stack
                      direction={isMobile ? "column" : "row"}
                      spacing={isMobile ? 0.5 : 2}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        <Box component="span" fontWeight="500" mr={0.5}>
                          IFSC:
                        </Box>
                        {b.ifsc_code}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        <Box component="span" fontWeight="500" mr={0.5}>
                          A/C:
                        </Box>
                        {b.account_number}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </ListItem>
            ))}
            {filteredBeneficiaries.length === 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                No beneficiaries found
              </Typography>
            )}
          </List>
        </CardContent>
      </Collapse>

      {/* Add Beneficiary Modal */}
      {openModal && (
        <CommonModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Add New Beneficiary"
          iconType="info"
          size="small"
          dividers
          fieldConfig={schema}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          loading={loading || submitting}
          footerButtons={[
            {
              text: submitting ? "Processing..." : "Add & Verify",
              variant: "contained",
              color: "primary",
              onClick: handleAddAndVerifyBeneficiary, // ✅ नया function
              disabled: submitting,
              sx: { borderRadius: 1 },
            },
            {
              text: submitting ? "Processing..." : "Add",
              variant: "contained",
              color: "primary",
              onClick: handleAddBeneficiary, // ✅ नया function
              disabled: submitting,
              sx: { borderRadius: 1 },
            },
          ]}
        />
      )}

      {/* Verify Beneficiary - MPIN Modal */}
      {verifyOpen && (
        <CommonModal
          open={verifyOpen}
          onClose={() => setVerifyOpen(false)}
          title="Enter 6-digit MPIN"
          iconType="info"
          size="small"
          dividers
          loading={submitting}
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: () => setVerifyOpen(false),
              disabled: submitting,
              sx: { borderRadius: 1 },
            },
            {
              text: submitting ? "Verifying..." : "Verify",
              variant: "contained",
              color: "primary",
              onClick: handleVerify,
              disabled: submitting,
              sx: { borderRadius: 1 },
            },
          ]}
        >
          <Grid container spacing={1} justifyContent="center" sx={{ mt: 1 }}>
            {mpinDigits.map((digit, idx) => (
              <Grid item key={idx}>
                <TextField
                  id={`mpin-${idx}`}
                  value={digit}
                  type="password"
                  onChange={(e) => handleMpinChange(idx, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "1.2rem" },
                  }}
                  sx={{ width: 45 }}
                />
              </Grid>
            ))}
          </Grid>
        </CommonModal>
      )}
      {verifyUpiOpen && (
        <CommonModal
          open={verifyUpiOpen}
          onClose={() => setVerifyUpiOpen(false)}
          title="Enter 6-digit MPIN"
          iconType="info"
          size="small"
          dividers
          loading={submitting}
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: () => setVerifyOpen(false),
              disabled: submitting,
              sx: { borderRadius: 1 },
            },
            {
              text: submitting ? "Verifying..." : "Verify",
              variant: "contained",
              color: "primary",
              onClick: handleVerifyUpi,
              disabled: submitting,
              sx: { borderRadius: 1 },
            },
          ]}
        >
          <Grid container spacing={1} justifyContent="center" sx={{ mt: 1 }}>
            {mpinDigits.map((digit, idx) => (
              <Grid item key={idx}>
                <TextField
                  id={`mpin-${idx}`}
                  value={digit}
                  type="password"
                  onChange={(e) => handleMpinChange(idx, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "1.2rem" },
                  }}
                  sx={{ width: 45 }}
                />
              </Grid>
            ))}
          </Grid>
        </CommonModal>
      )}

      {/* Delete Beneficiary Modal */}
      <DeleteBeneficiaryModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        beneficiary={selectedBeneficiary}
        sender={sender}
        onSuccess={() => {
          setDeleteOpen(false);
          setSelectedBeneficiary(null);
          onSuccess?.(sender.mobileNumber);
        }}
      />
    </Card>
  );
};

export default Beneficiaries;
