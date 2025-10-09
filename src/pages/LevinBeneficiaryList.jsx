import { useMemo, useState } from "react";
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
import LevinBeneficiaryDetails from "./LevinBeneficiaryDetails";

const LevinBeneficiaryList = ({
  sender,
  onSuccess,
  onSelect,
  onLevinSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showToast } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openList, setOpenList] = useState(true);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleOpenPay = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setOpenPayModal(true);
  };

  const handleClosePay = () => {
    setOpenPayModal(false);
    setSelectedBeneficiary(null);
  };

  // load schema
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.ADD_BENEFICIARY_SCHEMA, openModal, {
      sender_id: sender?.id,
    });

  const handleAddBeneficiary = async () => {
    setSubmitting(true);
    setErrors({});
    try {
      const payload = {
        ...formData,
        sender_id: sender.id,
        type: "LEVIN",
      };
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.CREATE_BENEFICIARY,
        payload
      );

      if (response) {
        okSuccessToast(response?.message || "Beneficiary added successfully");
        setOpenModal(false);
        onSuccess?.(sender.mobile_number);
      } else {
        showToast(
          error?.errors || errors?.message || "Failed to add beneficiary",
          "error"
        );
      }
    } catch (error) {
      showToast(error, "error");
      setErrors(error?.response?.data?.errors || {});
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
      apiErrorToast(err);
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
    return beneficiaries.filter((b) =>
      b.beneficiary_name.toLowerCase().includes(searchText.toLowerCase())
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

          <Box ml={isMobile ? 1 : "auto"}>
            {sender && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setOpenModal(true)}
                startIcon={<PersonAddIcon sx={{ fontSize: 14 }} />}
                sx={{
                  minWidth: "auto", // shrink width
                  px: 0.8, // smaller horizontal padding
                  py: 0.3, // smaller vertical padding
                  fontSize: "0.65rem", // smaller text
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  boxShadow: "none",
                  backgroundColor: "#7a4dff",
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
                    <Stack direction="row" spacing={4} alignItems="center">
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
                  {/* Bank logo */}
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

                  {/* Details */}
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
              text: submitting ? "Saving..." : "Add Beneficiary",
              variant: "contained",
              color: "primary",
              onClick: handleAddBeneficiary,
              disabled: submitting,
              sx: { borderRadius: 1 },
            },
          ]}
        />
      )}
      {openPayModal && (
        <LevinBeneficiaryDetails
          open={openPayModal}
          onClose={() => setOpenPayModal(false)}
          beneficiary={selectedBeneficiary}
          sender={sender}
          senderId={sender?.id}
          senderMobile={sender?.mobile_number}
          onLevinSuccess={onLevinSuccess}
        />
      )}
    </Card>
  );
};

export default LevinBeneficiaryList;
