import { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifyUpiBene from "./VerifyUpiBene";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import {
  sbi2,
  idbi2,
  axis2,
  hdfc2,
  icici2,
  kotak2,
  bob2,
  pnb2,
  bom2,
  union2,
  dbs2,
  rbl2,
  yes2,
  indus2,
  airtel2,
  abhy2,
  canara2,
  bandhan2,
  cbi2,
  idib2,
  stand2,
  jk2,
} from "../utils/iconsImports";
import UpiBeneficiaryDetails from "./UpiBeneficiaryDetails";
import { useToast } from "../utils/ToastContext";
import { upi2 } from "../iconsImports";
import CommonModal from "../components/common/CommonModal";

const UpiBeneficiaryList = ({ sender, onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openList, setOpenList] = useState(true);
  const [verifyModal, setVerifyModal] = useState(false);
  const [selectedBene, setSelectedBene] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] = useState(null);
  const [vpaPrefix, setVpaPrefix] = useState("");
  const [vpaSuffix, setVpaSuffix] = useState("");
  const { showToast } = useToast();
  // Hardcoded form fields
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [vpa, setVpa] = useState("");
  const [customSuffix, setCustomSuffix] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [mpinDigits, setMpinDigits] = useState(Array(6).fill(""));
  const [pendingPayload, setPendingPayload] = useState(null);
  const [tupResponse, setTupResponse] = useState(null);

  const handleAddBeneficiary = async () => {
    // if (!beneficiaryName.trim() || !vpa.trim()) {
    //   showToast("Please fill all fields", "error");
    //   return;
    // }
    const fullVpa = `${vpaPrefix.trim()}@${
      vpaSuffix === "other" ? customSuffix.trim() : vpaSuffix.trim()
    }`;

    setSubmitting(true);
    try {
      const payload = {
        beneficiary_name: beneficiaryName.trim(),
        account_number: fullVpa, // use the combined UPI ID here
        sender_id: sender.id,
        type: "UPI",
        mobile_number: sender?.mobile_number,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.CREATE_BENEFICIARY,
        payload
      );

      if (response) {
        okSuccessToast(response?.message || "Beneficiary added successfully");
        setOpenModal(false);
        setBeneficiaryName("");
        setVpa("");
        setCustomSuffix(""); // reset this too
        onSuccess?.(sender.mobile_number);
      } else {
        showToast(error?.message || "Failed to add beneficiary", "error");
      }
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };
  const handleAddAndVerifyBeneficiary = () => {
    const finalSuffix = vpaSuffix === "other" ? customSuffix : vpaSuffix;
    const combinedVpa = `${vpaPrefix}@${finalSuffix}`;

    const payload = {
      beneficiary_name: beneficiaryName,
      suffix: finalSuffix,
      sender_id: sender?.id,
      mobile_number: sender?.mobile_number,
      ben_acc: combinedVpa,
      operator: 21,
      latitude: location?.lat || "",
      longitude: location?.long || "",
      pf: "WEB",
    };

    setPendingPayload(payload);
    setVerifyOpen(true);
  };
  // ✅ MPIN change handler
  const handleMpinChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newDigits = [...mpinDigits];
      newDigits[index] = value;
      setMpinDigits(newDigits);
      if (value && index < 5)
        document.getElementById(`mpin-${index + 1}`)?.focus();
    }
  };
  const handleVerify = async () => {
    if (mpinDigits.some((d) => !d)) {
      showToast("Please enter all 6 digits of MPIN", "error");
      return;
    }

    const mpin = mpinDigits.join("");
    setSubmitting(true);

    try {
      const verifyPayload = { ...pendingPayload, mpin };
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.DMT1_VERIFY_BENEFICIARY,
        verifyPayload
      );

      if (!response) {
        showToast(error?.message || "Failed to verify beneficiary", "error");
        setVerifyOpen(false);
        setMpinDigits(Array(6).fill(""));
        return;
      }

      if (
        response?.data?.statuscode === "TUP" ||
        response?.message?.includes("Transaction Under Process")
      ) {
        setTupResponse(response);
        setVerifyOpen(false);
        setMpinDigits(Array(6).fill(""));
        return;
      }

      // ✅ Verification success, add beneficiary
      const finalSuffix = vpaSuffix === "other" ? customSuffix : vpaSuffix;
      const combinedVpa = `${vpaPrefix}@${finalSuffix}`;

      const addPayload = {
        ...pendingPayload,
        suffix: finalSuffix,
        ben_acc: combinedVpa,
        type: "UPI",
        beneficiary_name: response?.data?.name || beneficiaryName,
        account_number: combinedVpa,
        mobile_number: sender?.mobile_number,
        is_verified: 1,
      };

      const { response: addRes, error: addErr } = await apiCall(
        "post",
        ApiEndpoints.CREATE_BENEFICIARY,
        addPayload
      );

      if (addRes) {
        okSuccessToast(
          addRes?.message || "Beneficiary verified & added successfully"
        );
        setVerifyOpen(false);
        setOpenModal(false);
        setMpinDigits(Array(6).fill(""));
        setBeneficiaryName("");
        setVpaPrefix("");
        setVpaSuffix("ybl");
        setCustomSuffix("");
        onSuccess?.(sender.mobile_number);
      } else {
        showToast(addErr?.message || "Failed to add beneficiary", "error");
      }
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ TUP confirmation
  const handleTUPConfirmation = async () => {
    setSubmitting(true);
    const finalSuffix = vpaSuffix === "other" ? customSuffix : vpaSuffix;
    const combinedVpa = `${vpaPrefix}@${finalSuffix}`;

    try {
      const addPayload = {
        ...pendingPayload,
        suffix: finalSuffix,
        ben_acc: combinedVpa,
        account_number: combinedVpa,
        mobile_number: sender?.mobile_number,
        tup_reference: tupResponse?.data?.txnReferenceId,
        type: "UPI",
        is_verified: 0,
      };

      const { response, error } = await apiCall(
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
        showToast(error?.message || "Failed to add beneficiary", "error");
      }
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTUPClose = () => {
    setTupResponse(null);
    setMpinDigits(Array(6).fill(""));
  };

  const handleDeleteBeneficiary = async (beneficiaryId) => {
    try {
      const res = await apiCall("post", ApiEndpoints.DELETE_BENEFICIARY, {
        sender_id: sender.id,
        id: beneficiaryId,
      });

      if (res) {
        okSuccessToast(res?.message || "Beneficiary deleted successfully");
        onSuccess?.(sender.mobile_number);
      } else {
        apiErrorToast(res?.message || "Failed to delete beneficiary");
      }
    } catch (err) {
      apiErrorToast(err?.message || "Error deleting beneficiary");
    }
  };

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

  const filteredBeneficiaries = beneficiaries.filter((b) =>
    b.beneficiary_name.toLowerCase().includes(searchText.toLowerCase())
  );

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
      {/* Header */}
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
          {sender && (
            <Box ml={isMobile ? 2 : "auto"}>
              <Button
                variant="contained"
                size="small"
                onClick={() => setOpenModal(true)}
                startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                sx={{
                  minWidth: "auto",
                  px: 0.8,
                  py: 0.3,
                  fontSize: "0.65rem",
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  boxShadow: "none",
                  backgroundColor: "#7a4dff",
                }}
              >
                Add Beneficiary
              </Button>
            </Box>
          )}
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
          {beneficiaries.length > 1 && (
            <Box mb={2}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search beneficiary by name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Box>
          )}

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
                    <Stack direction="row" spacing={1} alignItems="center">
                      {b.is_verified === 1 ? (
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
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedBene(b);
                            setVerifyModal(true);
                          }}
                          sx={{
                            borderRadius: 1,
                            color: "#000",
                            backgroundColor: "#FFC107",
                            textTransform: "none",
                            fontSize: "0.7rem",
                            px: 1,
                            py: 0.2,
                          }}
                        >
                          Verify
                        </Button>
                      )}

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          setSelectedForDetails(b);
                          setDetailsModalOpen(true);
                        }}
                        sx={{
                          color: "#fff",
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
                <Box display="flex" alignItems="flex-start" gap={1.5}>
                  <Box
                    component="img"
                    src={upi2}
                    alt="Upi 1"
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

                  <Box flexGrow={1} minWidth={0}>
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

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      VPA: {b.account_number}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Collapse>

      {/* Custom Add Beneficiary Modal (no CommonModal) */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1rem" }}>
          Add UPI Beneficiary
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Beneficiary Name"
              fullWidth
              size="small"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="Enter beneficiary name"
            />
            <Box display="flex" gap={1}>
              <TextField
                label="Prefix"
                fullWidth
                size="small"
                value={vpaPrefix}
                onChange={(e) => setVpaPrefix(e.target.value)}
                placeholder="e.g. example"
              />

              <Typography
                variant="h6"
                sx={{
                  alignSelf: "center",
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                @
              </Typography>

              <TextField
                select
                label="Suffix"
                fullWidth
                size="small"
                value={vpaSuffix}
                onChange={(e) => setVpaSuffix(e.target.value)}
              >
                <MenuItem value="upi">upi</MenuItem>
                <MenuItem value="ybl">ybl</MenuItem>
                <MenuItem value="okicici">okicici</MenuItem>
                <MenuItem value="okaxis">okaxis</MenuItem>
                <MenuItem value="oksbi">oksbi</MenuItem>
                <MenuItem value="okhdfcbank">okhdfcbank</MenuItem>
                <MenuItem value="paytm">paytm</MenuItem>
                <MenuItem value="ibl">ibl</MenuItem>
                <MenuItem value="axisbank">axisbank</MenuItem>
                <MenuItem value="kotak">kotak</MenuItem>
                <MenuItem value="sbi">sbi</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>

              {vpaSuffix === "other" && (
                <TextField
                  label="Enter Custom Suffix"
                  fullWidth
                  size="small"
                  value={customSuffix}
                  onChange={(e) => setCustomSuffix(e.target.value)}
                  placeholder="e.g. yourbank"
                />
              )}
            </Box>
            {(vpaPrefix || vpaSuffix || customSuffix) && (
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary", fontWeight: 500 }}
              >
                Full UPI ID:{" "}
                <strong>
                  {`${vpaPrefix || ""}@${
                    vpaSuffix === "other" ? customSuffix || "" : vpaSuffix || ""
                  }`}
                </strong>
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenModal(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddBeneficiary}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Add"}
          </Button>
          <Button
            variant="contained"
            onClick={handleAddAndVerifyBeneficiary}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Verify & Add"}
          </Button>
        </DialogActions>
      </Dialog>
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
          <Typography>
            Verification is under process. You can add the beneficiary now, but
            it will be marked as unverified until verification completes.
          </Typography>
          <Typography variant="caption">
            Transaction Reference: {tupResponse?.data?.txnReferenceId || "N/A"}
          </Typography>
        </CommonModal>
      )}
      {/* Verify UPI Beneficiary Modal */}
      {verifyModal && selectedBene && (
        <VerifyUpiBene
          open={verifyModal}
          onClose={() => setVerifyModal(false)}
          mobile={sender?.mobile_number}
          beneId={selectedBene.id}
          beneaccnumber={selectedBene.account_number}
          onSuccess={() => {
            setVerifyModal(false);
            onSuccess?.(sender.mobile_number);
          }}
        />
      )}

      {selectedForDetails && (
        <UpiBeneficiaryDetails
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          beneficiary={selectedForDetails}
          senderMobile={sender?.mobile_number}
          senderId={sender?.id}
          sender={sender}
        />
      )}
    </Card>
  );
};

export default UpiBeneficiaryList;
