import { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Button,
  IconButton,
  Divider,
  Collapse,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Stack,
  Tooltip,
  TextField,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CommonModal from "../../components/common/CommonModal";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../../utils/ToastUtil";
import { useSchemaForm } from "../../hooks/useSchemaForm";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useToast } from "../../utils/ToastContext";
import AuthContext from "../../contexts/AuthContext";
import { convertNumberToWordsIndian } from "../../utils/NumberUtil";
import LevinBeneficiaryDetails from "./LevinBeneficiaryDetails.jsx";

const LevinDmtBeneficiaryList = ({
  sender,
  onSuccess,
  onPayoutSuccess,
  mobileNumber,
  onBeneficiarySelected,
}) => {
  console.log("THe sender in ben list is ", sender);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { location, getUuid } = useContext(AuthContext);
  const [open, setOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyUpiOpen, setVerifyUpiOpen] = useState(false);
  const [mpinDigits, setMpinDigits] = useState(Array(6).fill(""));
  const [pendingPayload, setPendingPayload] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [tupResponse, setTupResponse] = useState(null);
  const [verifyingBeneficiary, setVerifyingBeneficiary] = useState(null);
  const [amountInputs, setAmountInputs] = useState({});
  const [amountInWords, setAmountInWords] = useState({});
  const [uuid, setUuid] = useState(null); // ✅ new state

  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.ADD_BENEFICIARY_SCHEMA, openModal, {
      sender_id: sender?.id,
    });
  const { showToast } = useToast();

  console.log("THe formdat is ", schema);
  useEffect(() => {
    if (verifyOpen) {
      const fetchUuid = async () => {
        try {
          const { error, response } = await getUuid();
          if (response) {
            setUuid(response);
          } else if (error) {
            showToast(error?.message || "Failed to generate UUID", "error");
            setVerifyOpen(false);
          }
        } catch (err) {
          showToast("Error while generating UUID", "error");
        }
      };
      fetchUuid();
    }
  }, [verifyOpen]); // 👈 triggers every time `open` changes
  // ✅ Handle Amount Change with limit validation
  const handleAmountChange = (beneficiaryId, value) => {
    const numericValue = value.replace(/[^\d.]/g, "");
    const amount = parseFloat(numericValue);
    const limit = parseFloat(sender?.limitTotal || 0);

    if (limit && amount > limit) {
      showToast(`Amount cannot exceed your limit of ₹${limit}`, "error");
      return;
    }

    setAmountInputs((prev) => ({
      ...prev,
      [beneficiaryId]: numericValue,
    }));

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

    // Call the parent handler instead of opening modal locally
    if (onBeneficiarySelected) {
      onBeneficiarySelected(
        {
          ...beneficiary,
          enteredAmount: parseFloat(amount),
        },
        sender
      );
    }

    // Clear the amount input after sending
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
      mobile_number: mobileNumber,
      rem_mobile: sender?.mobileNumber,
      ben_name: formData.beneficiary_name,
      ben_acc: formData.account_number,
      ifsc: formData.ifsc_code,
      operator: 18,
      latitude: location?.lat || "",
      longitude: location?.long || "",
      pf: "WEB",
    };
    setPendingPayload(payload);
    setVerifyOpen(true);
  };

  const isFormValid = useMemo(() => {
    if (!formData || !schema) return false;

    return schema.every((field) => {
      if (field.required) {
        const value = formData[field.name];
        return (
          value !== undefined &&
          value !== null &&
          value.toString().trim() !== ""
        );
      }
      return true;
    });
  }, [formData, schema]);

  const handleVerifyExistingBeneficiary = (beneficiary) => {
    setVerifyingBeneficiary(beneficiary);

    const payload = {
      sender_id: sender?.id,
      mobile_number: sender?.mobile_number,
      rem_mobile: sender?.mobileNumber,
      ben_name: beneficiary.beneficiary_name,
      ben_acc: beneficiary.account_number,
      ifsc: beneficiary.ifsc_code,
      operator: 18,
      latitude: location?.lat || "",
      longitude: location?.long || "",
      pf: "WEB",
    };

    setPendingPayload(payload);
    setVerifyOpen(true);
  };

  const handleVerify = async () => {
    if (mpinDigits.some((d) => !d)) {
      showToast("Please enter all 6 digits of MPIN", "error");
      return;
    }
    const mpin = mpinDigits.join("");

    try {
      setSubmitting(true);

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
        setVerifyingBeneficiary(null);
        return;
      }

      console.log(":THe verfi repsonve is", verifyResponse);

      if (
        !verifyingBeneficiary &&
        (verifyResponse?.data?.statuscode === "TUP" ||
          verifyResponse?.message?.includes("Transaction Under Process"))
      ) {
        setTupResponse(verifyResponse);
        setVerifyOpen(false);
        setSubmitting(false);
        setMpinDigits(Array(6).fill(""));
        setVerifyingBeneficiary(null);
        return;
      }

      if (verifyingBeneficiary) {
        showToast(verifyResponse?.message, "success");
        setVerifyOpen(false);
        setMpinDigits(Array(6).fill(""));
        setVerifyingBeneficiary(null);
        onSuccess?.(sender.mobileNumber);
      } else {
        const verifiedName = verifyResponse?.data || verifyResponse?.message;
        const encryptedData = verifyResponse?.encrypted_data;

        const { beneficiary_name, ...restFormData } = formData;

        const addPayload = {
          ...restFormData,
          sender_id: sender.id,
          type: "BANK",
          beneficiary_name: verifiedName || formData.beneficiary_name,
          mobile_number: mobileNumber,
          is_verified: new Date().toISOString(),
        };

        const { error: addError, response: addResponse } = await apiCall(
          "post",
          ApiEndpoints.LEVIN_DMT_ADD_BENEFICIARY,
          addPayload
        );

        if (addResponse) {
          showToast(
            addResponse?.message || "Beneficiary verified & added successfully",
            "success"
          );
          setVerifyOpen(false);
          setOpenModal(false);
          setMpinDigits(Array(6).fill(""));
          onSuccess?.(sender.mobileNumber);
        } else {
          showToast(addError?.message || "Failed to add beneficiary", "error");
        }
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

      const verifyPayload = {
        ...pendingPayload,
        mpin,
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
        setVerifyingBeneficiary(null);
        return;
      } else {
        showToast(verifyResponse?.message, "success");
        onSuccess?.(sender.mobileNumber);
        setVerifyUpiOpen(false);
        setMpinDigits(Array(6).fill(""));
      }
    } catch (err) {
      showToast(err, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTUPConfirmation = async () => {
    try {
      setSubmitting(true);

      const { beneficiary_name, ...restFormData } = formData;

      const addPayload = {
        ...restFormData,
        sender_id: sender.id,
        type: "BANK",
        beneficiary_name: formData.beneficiary_name,
        mobile_number: mobileNumber,
        tup_reference: tupResponse?.data?.txnReferenceId,
        // is_verified: new Date().toISOString(),
      };

      const { error: addError, response: addResponse } = await apiCall(
        "post",
        ApiEndpoints.LEVIN_DMT_ADD_BENEFICIARY,
        addPayload
      );

      if (addResponse) {
        showToast(
          addResponse?.message ||
            "Beneficiary added successfully (Verification Pending)",
          "success"
        );
        setTupResponse(null);
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

  const handleTUPClose = () => {
    setTupResponse(null);
    setMpinDigits(Array(6).fill(""));
    setVerifyingBeneficiary(null);
  };

  const handleDeleteBeneficiary = async (beneficiaryId) => {
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.DELETE_BENEFICIARY,
        {
          sender_id: sender.id,
          id: beneficiaryId,
        }
      );

      if (response) {
        okSuccessToast(response?.message || "Beneficiary deleted successfully");
        onSuccess?.(sender.mobile_number);
      } else {
        showToast(error?.message || "Failed to delete beneficiary", "error");
      }
    } catch (err) {
      showToast(err, "error");
    }
  };

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

  // Normalize beneficiaries
  const beneficiaries =
    sender?.length > 0
      ? sender
      : [
          {
            id: "na",
            beneficiary_name: "No beneficiaries added",
            ifsc_code: "N/A",
            account_number: "N/A",
            is_verified: new Date().toISOString(),
            bank_name: null,
          },
        ];

  const filteredBeneficiaries = useMemo(() => {
    if (!searchText) return beneficiaries;
    const lowerSearch = searchText.toLowerCase();
    return beneficiaries.filter(
      (b) =>
        b.beneficiary_name?.toLowerCase().includes(lowerSearch) ||
        b.account_number?.toLowerCase().includes(lowerSearch)
    );
  }, [searchText, beneficiaries]);

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
      {/* Header - Same design as first component */}
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

      {/* Collapse wrapper - Same design as first component */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 2 }}>
          <Box mb={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search beneficiary by name or account number"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Box>
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
                      {b.is_verified === 0 ? (
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
                              mobile_number: sender?.mobile_number,
                              operator: 18,
                              type: "PAYOUT",
                              is_verified: 1,
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
                          handleDeleteBeneficiary(b.id);
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
              onClick: handleAddAndVerifyBeneficiary,
              disabled: submitting,
              sx: { borderRadius: 1 },
            },
            {
              text: submitting ? "Processing..." : "Add",
              variant: "contained",
              color: "primary",
              onClick: handleTUPConfirmation,
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
          onClose={() => {
            setVerifyOpen(false);
            setVerifyingBeneficiary(null);
          }}
          title="Enter 6-digit MPIN"
          iconType="info"
          size="small"
          dividers
          loading={submitting}
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: () => {
                setVerifyOpen(false);
                setVerifyingBeneficiary(null);
              },
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
          onClose={() => {
            setVerifyUpiOpen(false);
            setVerifyingBeneficiary(null);
          }}
          title="Enter 6-digit MPIN"
          iconType="info"
          size="small"
          dividers
          loading={submitting}
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: () => {
                setVerifyOpen(false);
                setVerifyingBeneficiary(null);
              },
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

      {/* TUP Confirmation Modal */}
      {tupResponse && (
        <CommonModal
          open={!!tupResponse}
          onClose={handleTUPClose}
          title="Verification in Progress"
          iconType="info"
          size="small"
          dividers
          loading={submitting}
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: handleTUPClose,
              disabled: submitting,
              sx: { borderRadius: 1 },
            },
            {
              text: submitting ? "Adding..." : "Add Beneficiary Anyway",
              variant: "contained",
              color: "primary",
              onClick: handleTUPConfirmation,
              disabled: submitting,
              sx: { borderRadius: 1 },
            },
          ]}
        >
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your beneficiary verification is under process. You can still add
              the beneficiary using the name you entered, but it will be marked
              as unverified until the verification completes.
            </Typography>
            <Box sx={{ p: 2, backgroundColor: "grey.50", borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Transaction Reference:{" "}
                {tupResponse?.data?.txnReferenceId || "N/A"}
              </Typography>
            </Box>
          </Box>
        </CommonModal>
      )}
      {/* 
      {openPayModal && (
        <LevinBeneficiaryDetails
          open={openPayModal}
          onClose={() => setOpenPayModal(false)}
          beneficiary={selectedBeneficiary}
          sender={sender}
          senderId={sender?.id}
          senderMobile={sender?.mobile_number}
          onPayoutSuccess={onPayoutSuccess}
          amount={selectedBeneficiary?.enteredAmount} // Pass the entered amount
        />
      )} */}
    </Card>
  );
};
export default LevinDmtBeneficiaryList;
