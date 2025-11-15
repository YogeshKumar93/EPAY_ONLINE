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
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useSchemaForm } from "../hooks/useSchemaForm";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeneficiaryDetails from "./BeneficiaryDetails";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";

const BeneficiaryList = ({ sender, onSuccess, onPayoutSuccess }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { location, getUuid } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openList, setOpenList] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false); // 🔑 verify modal state
  const [verifyUpiOpen, setVerifyUpiOpen] = useState(false); // 🔑 verify modal state
  const [mpinDigits, setMpinDigits] = useState(Array(6).fill(""));
  const [pendingPayload, setPendingPayload] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [tupResponse, setTupResponse] = useState(null); // 🔑 TUP response state
  const [generatedUuid, setGeneratedUuid] = useState(null);
  const [verifyingBeneficiary, setVerifyingBeneficiary] = useState(null); // 🔑 Track which beneficiary is being verified
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.ADD_BENEFICIARY_SCHEMA, openModal, {
      sender_id: sender?.id,
    });
  const { showToast } = useToast();
  const [uuid, setUuid] = useState(null); // ✅ new state

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
  console.log("uuid ", uuid);

  const handleAddAndVerifyBeneficiary = () => {
    setErrors({});
    const payload = {
      ...formData,
      sender_id: sender?.id,
      mobile_number: sender?.mobile_number,
      rem_mobile: sender?.mobileNumber,
      ben_name: formData.beneficiary_name,
      ben_acc: formData.account_number,
      ifsc: formData.ifsc_code,
      operator: 18,
      latitude: location?.lat || "",
      longitude: location?.long || "",
      pf: "WEB",
      client_ref: uuid,
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
      return true; // not required field
    });
  }, [formData, schema]);
  const handleOpenPay = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setOpenPayModal(true);
  };
  // 🔑 New function to handle verification of existing beneficiary
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
        setVerifyingBeneficiary(null);
        return;
      }

      console.log(":THe verfi repsonve is", verifyResponse);

      if (
        !verifyingBeneficiary &&
        (verifyResponse?.data?.statuscode === "TUP" ||
          verifyResponse?.message?.includes("Transaction Under Process"))
      ) {
        // Close MPIN modal and open TUP confirmation modal
        setTupResponse(verifyResponse); // Store the TUP response
        setVerifyOpen(false); // Close MPIN modal
        setSubmitting(false);
        setMpinDigits(Array(6).fill("")); // Reset MPIN
        setVerifyingBeneficiary(null);
        return;
      }

      // ✅ If we're verifying an existing beneficiary, just close modal
      if (verifyingBeneficiary) {
        showToast(verifyResponse?.message, "success");
        setVerifyOpen(false);
        setMpinDigits(Array(6).fill(""));
        setVerifyingBeneficiary(null);
        onSuccess?.(sender.mobileNumber);
      } else {
        // ✅ Normal flow - adding new beneficiary
        const verifiedName = verifyResponse?.data || verifyResponse?.message;
        const encryptedData = verifyResponse?.encrypted_data;

        const { beneficiary_name, ...restFormData } = formData;

        const addPayload = {
          ...restFormData,
          sender_id: sender.id,
          type: "BANK",
          beneficiary_name: verifiedName || formData.beneficiary_name, // Fallback to typed name
          mobile_number: sender?.mobile_number,
          is_verified: 1, // ✅ Set as verified since verification was successful
        };

        const { error: addError, response: addResponse } = await apiCall(
          "post",
          ApiEndpoints.CREATE_BENEFICIARY,
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

      // 🔹 Step 1: Verify
      const verifyPayload = {
        ...pendingPayload,
        mpin,
        client_ref: generatedUuid,
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
        setMpinDigits(Array(6).fill(""));
        setVerifyingBeneficiary(null);
        setVerifyOpen(false);
        setVerifyUpiOpen(false);
        return;
      } else {
        showToast(verifyResponse?.message, "success");
        onSuccess?.(sender.mobileNumber);
        setVerifyUpiOpen(false);
        setMpinDigits(Array(6).fill(""));
      }

      console.log(":THe verfi repsonve is", verifyResponse);
    } catch (err) {
      showToast(err, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTUPConfirmation = async () => {
    try {
      setSubmitting(true);

      // Original TUP flow for new beneficiary only
      const { beneficiary_name, ...restFormData } = formData;

      const addPayload = {
        ...restFormData,
        sender_id: sender.id,
        type: "BANK",
        beneficiary_name: formData.beneficiary_name, // Use the originally typed name
        mobile_number: sender?.mobile_number,
        tup_reference: tupResponse?.data?.txnReferenceId, // Include TUP reference if available
        is_verified: 0, // ✅ Set as unverified since verification is pending
      };

      const { error: addError, response: addResponse } = await apiCall(
        "post",
        ApiEndpoints.CREATE_BENEFICIARY,
        addPayload
      );

      if (addResponse) {
        showToast(
          addResponse?.message ||
            "Beneficiary added successfully (Verification Pending)",
          "success"
        );
        setTupResponse(null); // Close TUP modal
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
  useEffect(() => {
    const fetchUuid = async () => {
      try {
        const { response, error } = await getUuid();
        if (error || !response) {
          showToast(
            error?.message || "Failed to generate transaction ID",
            "error"
          );
          setVerifyUpiOpen(false);
          return;
        }
        console.log("Generated UUID:", response);
        setGeneratedUuid(response);
      } catch (err) {
        console.error("Error fetching UUID:", err);
        showToast("Error generating transaction ID", "error");
      }
    };

    if (verifyUpiOpen) {
      fetchUuid();
    } else {
      setGeneratedUuid(null);
    }
  }, [verifyUpiOpen]);

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

  // show actual list or placeholder N/A
  const beneficiaries =
    sender?.beneficiary?.length > 0
      ? sender.beneficiary
      : [
          {
            id: "na",
            beneficiary_name: "No beneficiaries added",
            ifsc_code: "N/A",
            account_number: "N/A",
            is_verified: 0,
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
        width: "100%",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box
        display="flex"
        justifyContent={isMobile ? "flex-start" : "space-between"}
        alignItems="center"
        sx={{
          py: 1,
          px: 2,
          background: "#6C4BC7",
          borderBottom: openList ? "1px solid" : "none",
          borderColor: "divider",
        }}
      >
        <Box display="flex" alignItems="center" gap={1} flexGrow={1}>
          <Typography variant="subtitle2" fontWeight="600" color="#fff">
            Beneficiary List
            {sender && <>({beneficiaries?.length || 0})</>}
          </Typography>

          <Box ml={isMobile ? 1 : "auto"}>
            {sender && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setOpenModal(true)}
                startIcon={<PersonAddIcon sx={{ fontSize: 14 }} />}
                sx={{
                  minWidth: "auto",
                  px: 0.8,
                  py: 0.3,
                  fontSize: "0.65rem",
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  boxShadow: "none",
                  color: "#000",
                  backgroundColor: "#fff",
                }}
              >
                Add Beneficiary
              </Button>
            )}
          </Box>
        </Box>

        {isMobile && (
          <IconButton
            onClick={() => setOpenList((prev) => !prev)}
            size="small"
            sx={{
              transform: openList ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
              color: "text.secondary",
              ml: 1,
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Box>

      <Collapse in={openList}>
        <CardContent sx={{ p: 2 }}>
          <Box mb={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search beneficiary by name or account number "
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Box>
          <List dense sx={{ py: 0, maxHeight: 300, overflowY: "auto" }}>
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
                    <Stack direction="row" spacing={2} alignItems="center">
                      {/* Verified text with tick */}
                      {b.is_verified === 1 && (
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

                      {/* Verify button for unverified beneficiaries */}
                      {b.is_verified === 0 && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          // onClick={() => handleVerifyExistingBeneficiary(b)}
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
                            borderRadius: 1,
                            textTransform: "none",
                            fontSize: "0.75rem",
                            px: 1,
                            py: 0.2,
                          }}
                        >
                          Verify
                        </Button>
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

                      {/* Pay button */}
                      <Button
                        size="small"
                        variant="contained"
                        // color="primary"
                        onClick={() => handleOpenPay(b)} // ✅ open modal with this beneficiary
                        sx={{
                          backgroundColor: "#5c3ac8",
                          borderRadius: 1,
                          textTransform: "none",
                          fontSize: "0.75rem",
                          px: 1,
                          py: 0.2,
                        }}
                      >
                        Send Money
                      </Button>

                      {/* Delete button */}
                      <IconButton
                        edge="end"
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBeneficiary(b.id);
                        }}
                        sx={{
                          backgroundColor: "error.light",
                          "&:hover": { backgroundColor: "error.main" },
                          color: "white",
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
                <Box
                  display="flex"
                  alignItems="flex-start"
                  gap={1.5}
                  width="100%"
                >
                  {bankImageMapping[b.bank_name] ? (
                    <Box
                      component="img"
                      src={bankImageMapping[b.bank_name]}
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

                  <Box flexGrow={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        noWrap
                        sx={{
                          fontSize: isMobile ? "0.9rem" : "1rem",
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
              text: submitting ? "Saving..." : "Verify and Add Beneficiary",
              variant: "contained",
              color: "primary",
              onClick: handleAddAndVerifyBeneficiary,
              disabled: submitting || !isFormValid,
              sx: { borderRadius: 1 },
            },
            {
              text: submitting ? "Saving..." : "Add Beneficiary",
              variant: "contained",
              color: "primary",
              onClick: handleTUPConfirmation,
              disabled: submitting || !isFormValid,
              sx: { borderRadius: 1 },
            },
          ]}
        />
      )}

      {/* MPIN Verification Modal */}
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
      {/* function for normal verify  */}
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
      {/* TUP Confirmation Modal - SEPARATE from MPIN modal */}
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
      {openPayModal && (
        <BeneficiaryDetails
          open={openPayModal}
          onClose={() => setOpenPayModal(false)}
          beneficiary={selectedBeneficiary}
          sender={sender}
          senderId={sender?.id}
          senderMobile={sender?.mobile_number}
          onPayoutSuccess={onPayoutSuccess} // ✅ pass the callback
        />
      )}
    </Card>
  );
};

export default BeneficiaryList;
