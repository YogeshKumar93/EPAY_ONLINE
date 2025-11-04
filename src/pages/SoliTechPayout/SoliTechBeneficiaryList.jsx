import { useMemo, useState, useContext } from "react";
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
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AuthContext from "../../contexts/AuthContext";
import { useToast } from "../../utils/ToastContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
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
  mobile,
  pnb2,
  sbi2,
  stand2,
  union2,
  yes2,
} from "../../iconsImports";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import CommonModal from "../../components/common/CommonModal";
import { Search } from "@mui/icons-material";
import SoliTechAddBeneficiary from "./SoliTechAddBeneficiary";
import CommonDeleteModal from "../../components/CommonDeleteModal";
import SoliTechBeneficiaryDetails from "./SoliTechBeneficiaryDetails";
const SoliTechBeneficiaryList = ({
  sender,
  onSuccess,
  onSelect,
  onPayoutSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showToast } = useToast();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openList, setOpenList] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [mpinDigits, setMpinDigits] = useState(Array(6).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [verifyingBeneficiary, setVerifyingBeneficiary] = useState(null);
  const [verifiedName, setVerifiedName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [pendingBeneficiary, setPendingBeneficiary] = useState(null);
  const { location } = useContext(AuthContext);
  const [openPayoutModal, setOpenPayoutModal] = useState(false);
  const [selectedPayoutBeneficiary, setSelectedPayoutBeneficiary] =
    useState(null);

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

  const handleDeleteClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setDeleteModalOpen(true);
  };

  const handleVerifyExistingBeneficiary = (beneficiary) => {
    setVerifyingBeneficiary(beneficiary);
    setVerifyOpen(true);
  };

  const handleVerifyAndAdd = (beneficiaryData) => {
    setPendingBeneficiary(beneficiaryData);
    setVerifyOpen(true);
  };

  const handleVerify = async () => {
    const mpin = mpinDigits.join("");
    if (mpin.length !== 6) {
      showToast("Please enter 6-digit MPIN", "error");
      return;
    }

    setSubmitting(true);
    try {
      let payload;

      if (pendingBeneficiary) {
        payload = {
          mobile_number: sender?.mobile_number,
          mpin: mpin,
          ben_acc: pendingBeneficiary.account_number,
          ifsc: pendingBeneficiary.ifsc_code,
          latitude: location.lat || "0.0",
          longitude: location.long || "0.0",
          ben_name: pendingBeneficiary.beneficiary_name,
          operator: 18,
          is_verified: 1,
        };
      } else {
        payload = {
          beneficiary_id: verifyingBeneficiary?.id,
          mpin: mpin,
          mobile_number: sender?.mobile_number,
          ben_acc: verifyingBeneficiary?.account_number,
          ifsc: verifyingBeneficiary?.ifsc_code,
          latitude: location.lat || "0.0",
          longitude: location.long || "0.0",
          ben_name: verifyingBeneficiary?.beneficiary_name,
          operator: 18,
          is_verified: 1,
        };
      }

      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.DMT1_VERIFY_BENEFICIARY,
        payload
      );

      if (response) {
        showToast("Beneficiary verified successfully!", "success");

        // Extract verified name from response
        const verifiedBeneName =
          response?.data?.beneficiary_name ||
          response?.message ||
          pendingBeneficiary?.beneficiary_name ||
          verifyingBeneficiary?.beneficiary_name;

        setVerifiedName(verifiedBeneName);

        if (pendingBeneficiary) {
          // Add beneficiary with verified name and bank code
          await addVerifiedBeneficiary(pendingBeneficiary, verifiedBeneName);
        } else {
          setVerifyOpen(false);
          setVerifyingBeneficiary(null);
          setMpinDigits(Array(6).fill(""));
          onSuccess?.(); // Refresh the list
        }
      } else {
        showToast(error?.message, "error");
      }
    } catch (error) {
      showToast(error, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Function to add beneficiary after successful verification - UPDATED
  const addVerifiedBeneficiary = async (beneficiaryData, verifiedName) => {
    console.log("Adding verified beneficiary:", beneficiaryData, verifiedName); // For debugging
    try {
      const addPayload = {
        mobile_number: sender?.mobile_number,
        bene_name: verifiedName,
        bene_account: beneficiaryData.account_number,
        bank_code: beneficiaryData.bank_code, // Include bank code in payload
        ifsc_code: beneficiaryData.ifsc_code,
        bank_name: beneficiaryData.bank_name,

        bene_pincode: beneficiaryData.pincode,
        latitude: location.lat || "0.0",
        longitude: location.long || "0.0",
        is_verified: 1,
      };

      console.log("Adding beneficiary with payload:", addPayload); // For debugging

      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.SOLITECH_ADD_BENEFICIARY,
        addPayload
      );

      if (response) {
        showToast("Beneficiary added successfully!", "success");
        setVerifyOpen(false);
        setPendingBeneficiary(null);
        setMpinDigits(Array(6).fill(""));
        setVerifiedName(""); // Reset verified name
        setOpenAddModal(false);
        onSuccess?.(); // Refresh the list
      } else {
        showToast(error?.message || "Failed to add beneficiary", "error");
      }
    } catch (err) {
      showToast("Failed to add beneficiary", "error");
      console.error("Add beneficiary error:", err);
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
    <>
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

            <Box ml={isMobile ? 1 : "auto"}>
              {sender && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOpenAddModal(true)}
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
                color: "white",
                ml: 1,
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </Box>

        {/* Beneficiary List */}
        <Collapse in={openList}>
          <CardContent sx={{ p: 2 }}>
            <Box mb={2}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search beneficiary by name or account number"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
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
                      <Stack direction="row" spacing={1} alignItems="center">
                        {b.is_verified === 1 && (
                          <Box display="flex" alignItems="center" gap={0.3}>
                            <CheckCircleIcon
                              sx={{ fontSize: 16, color: "success.main" }}
                            />
                            <Typography
                              variant="caption"
                              color="success.main"
                              fontWeight="500"
                            >
                              Verified
                            </Typography>
                          </Box>
                        )}

                        {b.is_verified === 0 && (
                          // <Button
                          //   size="small"
                          //   variant="outlined"
                          //   onClick={() => handleVerifyExistingBeneficiary(b)}
                          //   sx={{
                          //     fontSize: "0.7rem",
                          //     px: 1,
                          //   }}
                          // >
                          //   Verify
                          // </Button>
                          <Box display="flex" alignItems="center" gap={0.3}>
                            <Typography
                              variant="caption"
                              color="red"
                              fontWeight="500"
                            >
                              Not Verified
                            </Typography>
                          </Box>
                        )}

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            setSelectedPayoutBeneficiary(b);
                            setOpenPayoutModal(true);
                          }}
                          sx={{
                            backgroundColor: "#5c3ac8",
                            fontSize: "0.7rem",
                            px: 1,
                          }}
                        >
                          Send Money
                        </Button>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(b)}
                          sx={{
                            backgroundColor: "error.light",
                            "&:hover": { backgroundColor: "error.main" },
                            color: "white",
                          }}
                        >
                          <DeleteIcon fontSize="small" />
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

                      <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={isMobile ? 0.5 : 2}
                      >
                        <Typography variant="caption" color="text.secondary">
                          <strong>IFSC:</strong> {b.ifsc_code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>A/C:</strong> {b.account_number}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Collapse>
      </Card>

      {/* Add Beneficiary Modal */}
      {openAddModal && (
        <SoliTechAddBeneficiary
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={onSuccess}
          sender={sender}
          onVerifyAndAdd={handleVerifyAndAdd} // Pass the verify and add handler
        />
      )}

      <CommonDeleteModal
        open={deleteModalOpen}
        handleClose={() => {
          setDeleteModalOpen(false);
          setSelectedBeneficiary(null);
        }}
        selectedRow={selectedBeneficiary}
        endpoint={ApiEndpoints.SOLITECH_DELETE_BENEFICIARY}
        title="Delete Beneficiary"
        field="beneficiary_name"
        confirmText="Delete"
        cancelText="Cancel"
        enableRemark={false}
        method="POST"
        payloadBuilder={(beneficiary, remark) => ({
          mobile_number: sender?.mobile_number?.toString(),
          bene_id: beneficiary.soliteck_id,
        })}
        onSuccess={onSuccess ? () => onSuccess(sender.mobile_number) : null}
      />

      {/* Verification Modal */}
      {verifyOpen && (
        <CommonModal
          open={verifyOpen}
          onClose={() => {
            setVerifyOpen(false);
            setVerifyingBeneficiary(null);
            setPendingBeneficiary(null);
            setMpinDigits(Array(6).fill(""));
            setVerifiedName(""); // Reset verified name
          }}
          title={
            pendingBeneficiary
              ? "Verify & Add Beneficiary"
              : "Verify Beneficiary"
          }
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
                setPendingBeneficiary(null);
                setMpinDigits(Array(6).fill(""));
                setVerifiedName(""); // Reset verified name
              },
              disabled: submitting,
            },
            {
              text: submitting ? "Verifying..." : "Verify",
              variant: "contained",
              color: "primary",
              onClick: handleVerify,
              disabled: submitting,
            },
          ]}
        >
          <Typography variant="body2" gutterBottom>
            {pendingBeneficiary
              ? `Verify and add beneficiary ${pendingBeneficiary?.beneficiary_name}`
              : `Verify beneficiary ${verifyingBeneficiary?.beneficiary_name}`}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            Enter your 6-digit MPIN to{" "}
            {pendingBeneficiary
              ? "verify and add this beneficiary"
              : "verify this beneficiary"}
          </Typography>

          <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
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
      {openPayoutModal && selectedPayoutBeneficiary && (
        <SoliTechBeneficiaryDetails
          open={openPayoutModal}
          onClose={() => {
            setOpenPayoutModal(false);
            setSelectedPayoutBeneficiary(null);
          }}
          beneficiary={selectedPayoutBeneficiary}
          sender={sender}
          senderMobile={sender?.mobile_number}
          senderId={sender?.id}
          onPayoutSuccess={onPayoutSuccess}
        />
      )}
    </>
  );
};

export default SoliTechBeneficiaryList;
