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

  const handleAddBeneficiary = async () => {
    // if (!beneficiaryName.trim() || !vpa.trim()) {
    //   showToast("Please fill all fields", "error");
    //   return;
    // }

    setSubmitting(true);
    try {
      const payload = {
        beneficiary_name: beneficiaryName.trim(),
        account_number: `${vpaPrefix.trim()}@${vpaSuffix.trim()}`,
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
          background: "#9d72ff",
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
                <MenuItem value="oksbi">oksbi</MenuItem>
                <MenuItem value="paytm">paytm</MenuItem>
                <MenuItem value="ibl">ibl</MenuItem>
                <MenuItem value="axisbank">axisbank</MenuItem>
                <MenuItem value="kotak">kotak</MenuItem>
                <MenuItem value="sbi">sbi</MenuItem>
              </TextField>
            </Box>

            {vpaPrefix || vpaSuffix ? (
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary", fontWeight: 500 }}
              >
                Full UPI ID:{" "}
                <strong>{`${vpaPrefix || ""}@${vpaSuffix || ""}`}</strong>
              </Typography>
            ) : null}
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
            {submitting ? "Saving..." : "Save Beneficiary"}
          </Button>
        </DialogActions>
      </Dialog>

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
        />
      )}
    </Card>
  );
};

export default UpiBeneficiaryList;
