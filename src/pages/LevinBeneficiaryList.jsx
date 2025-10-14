import { useContext, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Button,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import { useToast } from "../utils/ToastContext";
import LevinBeneficiaryDetails from "./LevinBeneficiaryDetails";
import AuthContext from "../contexts/AuthContext";

const LevinBeneficiaryList = ({ sender, onSuccess, onLevinSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showToast } = useToast();
  const { location } = useContext(AuthContext);

  const [openModal, setOpenModal] = useState(false);
  const [openList, setOpenList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [mpinDigits, setMpinDigits] = useState(Array(6).fill(""));
  const [tupResponse, setTupResponse] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [verifyingBeneficiary, setVerifyingBeneficiary] = useState(null);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  // schema for add form
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.ADD_BENEFICIARY_SCHEMA, openModal, {
      sender_id: sender?.id,
    });

  // ✅ Step 1: Verify + Add new beneficiary
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
      operator: 18, // ✅ for Levin route
      latitude: location?.lat || "",
      longitude: location?.long || "",
      pf: "WEB",
    };
    setPendingPayload(payload);
    setVerifyOpen(true);
  };

  const handleVerify = async () => {
    if (mpinDigits.some((d) => !d)) {
      apiErrorToast("Please enter all 6 digits of MPIN");
      return;
    }

    const mpin = mpinDigits.join("");
    try {
      setSubmitting(true);
      const verifyPayload = { ...pendingPayload, mpin };
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.DMT1_VERIFY_BENEFICIARY,
        verifyPayload
      );

      if (!response) {
        showToast(error?.message || "Failed to verify beneficiary", "error");
        setSubmitting(false);
        setVerifyOpen(false);
        setMpinDigits(Array(6).fill(""));
        return;
      }

      if (
        response?.data?.statuscode === "TUP" ||
        response?.message?.includes("Transaction Under Process")
      ) {
        // TUP - verification pending
        setTupResponse(response);
        setVerifyOpen(false);
        setSubmitting(false);
        setMpinDigits(Array(6).fill(""));
        return;
      }

      // ✅ Verification successful — Add beneficiary
      const verifiedName = response?.data || formData.beneficiary_name;
      const addPayload = {
        ...formData,
        sender_id: sender?.id,
        type: "LEVIN",
        beneficiary_name: verifiedName,
        mobile_number: sender?.mobile_number,
        is_verified: 1,
      };

      const { response: addRes, error: addErr } = await apiCall(
        "post",
        ApiEndpoints.CREATE_BENEFICIARY,
        addPayload
      );

      if (addRes) {
        showToast(
          addRes?.message || "Beneficiary verified & added successfully",
          "success"
        );
        setVerifyOpen(false);
        setOpenModal(false);
        setMpinDigits(Array(6).fill(""));
        onSuccess?.(sender.mobile_number);
      } else {
        apiErrorToast(addErr?.message || "Failed to add beneficiary");
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTUPConfirmation = async () => {
    try {
      setSubmitting(true);
      const addPayload = {
        ...formData,
        sender_id: sender?.id,
        type: "LEVIN",
        beneficiary_name: formData.beneficiary_name,
        mobile_number: sender?.mobile_number,
        tup_reference: tupResponse?.data?.txnReferenceId,
        is_verified: 0,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.CREATE_BENEFICIARY,
        addPayload
      );

      if (response) {
        okSuccessToast(
          response?.message ||
            "Beneficiary added successfully (Verification Pending)"
        );
        setTupResponse(null);
        setOpenModal(false);
        onSuccess?.(sender.mobile_number);
      } else {
        apiErrorToast(error?.message || "Failed to add beneficiary");
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTUPClose = () => {
    setTupResponse(null);
    setMpinDigits(Array(6).fill(""));
  };

  // Delete beneficiary
  const handleDeleteBeneficiary = async (id) => {
    try {
      const res = await apiCall("post", ApiEndpoints.DELETE_BENEFICIARY, {
        sender_id: sender.id,
        id,
      });
      if (res) {
        okSuccessToast(res?.message || "Beneficiary deleted successfully");
        onSuccess?.(sender.mobile_number);
      } else {
        apiErrorToast(res?.message || "Failed to delete beneficiary");
      }
    } catch (err) {
      apiErrorToast(err);
    }
  };

  // Bank image mapping
  const bankImageMapping = {
    SBI: sbi2,
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

  const filteredBeneficiaries = useMemo(() => {
    if (!searchText) return sender?.beneficiary || [];
    return sender?.beneficiary?.filter((b) =>
      b.beneficiary_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, sender?.beneficiary]);

  const handleMpinChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newDigits = [...mpinDigits];
      newDigits[index] = value;
      setMpinDigits(newDigits);
      if (value && index < 5)
        document.getElementById(`mpin-${index + 1}`).focus();
    }
  };

  return (
    <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ py: 1, px: 2, background: "#6C4BC7" }}
      >
        <Typography variant="subtitle2" color="#fff" fontWeight="600">
          Beneficiary List ({sender?.beneficiary?.length || 0})
        </Typography>
        <Button
          size="small"
          variant="contained"
          startIcon={<PersonAddIcon sx={{ fontSize: 14 }} />}
          onClick={() => setOpenModal(true)}
          sx={{
            color: "#000",
            backgroundColor: "#fff",
            textTransform: "none",
            fontSize: "0.7rem",
          }}
        >
          Add Beneficiary
        </Button>
      </Box>

      {/* List */}
      <Collapse in={openList}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search beneficiary by name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <List dense sx={{ maxHeight: 300, overflowY: "auto" }}>
            {filteredBeneficiaries.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No beneficiaries found
              </Typography>
            ) : (
              filteredBeneficiaries.map((b) => (
                <ListItem
                  key={b.id}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      {b.is_verified === 1 ? (
                        <CheckCircleIcon
                          sx={{ fontSize: 18, color: "success.main" }}
                        />
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          color="warning"
                          sx={{ textTransform: "none", fontSize: "0.7rem" }}
                          onClick={() => {
                            setPendingPayload({
                              sender_id: sender?.id,
                              ben_name: b.beneficiary_name,
                              ben_acc: b.account_number,
                              ifsc: b.ifsc_code,
                              operator: 19,
                              latitude: location?.lat || "",
                              longitude: location?.long || "",
                              pf: "WEB",
                            });
                            setVerifyOpen(true);
                            setVerifyingBeneficiary(b);
                          }}
                        >
                          Verify
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontSize: "0.7rem",
                          backgroundColor: "#5c3ac8",
                        }}
                        onClick={() => {
                          setSelectedBeneficiary(b);
                          setOpenPayModal(true);
                        }}
                      >
                        Send
                      </Button>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteBeneficiary(b.id)}
                      >
                        <Tooltip title="Delete Beneficiary">
                          <DeleteIcon fontSize="small" />
                        </Tooltip>
                      </IconButton>
                    </Stack>
                  }
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    {bankImageMapping[b.bank_name] ? (
                      <Box
                        component="img"
                        src={bankImageMapping[b.bank_name]}
                        alt={b.bank_name}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          p: 0.5,
                        }}
                      />
                    ) : (
                      <Avatar sx={{ width: 36, height: 36 }}>
                        <AccountBalanceIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                    <Box>
                      <Typography fontWeight="500">
                        {b.beneficiary_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        IFSC: {b.ifsc_code} | A/C: {b.account_number}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))
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
              disabled: submitting,
            },
          ]}
        />
      )}

      {/* MPIN Verification Modal */}
      {verifyOpen && (
        <CommonModal
          open={verifyOpen}
          onClose={() => setVerifyOpen(false)}
          title="Enter 6-digit MPIN"
          iconType="info"
          size="small"
          dividers
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: () => setVerifyOpen(false),
            },
            {
              text: submitting ? "Verifying..." : "Verify",
              variant: "contained",
              color: "primary",
              onClick: handleVerify,
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
          footerButtons={[
            { text: "Cancel", variant: "outlined", onClick: handleTUPClose },
            {
              text: submitting ? "Adding..." : "Add Beneficiary Anyway",
              variant: "contained",
              color: "primary",
              onClick: handleTUPConfirmation,
            },
          ]}
        >
          <Typography variant="body2" sx={{ mb: 2 }}>
            Verification is under process. You can add the beneficiary now, but
            it will be marked as unverified until verification completes.
          </Typography>
          <Typography variant="caption">
            Transaction Reference: {tupResponse?.data?.txnReferenceId || "N/A"}
          </Typography>
        </CommonModal>
      )}

      {/* Send Money Modal */}
      {openPayModal && (
        <LevinBeneficiaryDetails
          open={openPayModal}
          onClose={() => setOpenPayModal(false)}
          beneficiary={selectedBeneficiary}
          sender={sender}
          onLevinSuccess={onLevinSuccess}
        />
      )}
    </Card>
  );
};

export default LevinBeneficiaryList;
