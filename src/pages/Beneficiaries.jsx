import React, { useState } from "react";
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
const Beneficiaries = ({ beneficiaries, onSelect, onDelete, onVerify,sender ,onSuccess}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
const [deleting, setDeleting] = useState(false);
const [deleteOpen, setDeleteOpen] = useState(false);
const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.ADD_DMT1_SCHEMA, openModal, {
      sender_id: sender?.id,
    });
console.log("sender",sender);

  const handleAddBeneficiary = async () => {
    setSubmitting(true);
    setErrors({});
    try {
const payload = { 
  ...formData, 
  sender_id: sender?.id,
  rem_mobile: sender?.mobileNumber   // <-- correct property name
};
    const {error,response} = await apiCall(
        "post",
        ApiEndpoints.REGISTER_DMT1_BENEFICIARY,
        payload
      );

      if (response) {
        okSuccessToast(response?.message || "Beneficiary added successfully");
        setOpenModal(false);
        onSuccess?.(sender.mobile_number);
      } else {
        apiErrorToast(error?.message || "Failed to add beneficiary");
      }
    } catch (err) {
      apiErrorToast(err);
      setErrors(err?.response?.data?.errors || {});
    } finally {
      setSubmitting(false);
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
  }; // add mappings if needed

  const handleDeleteClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      setDeleting(true);
      await onDelete?.(id); // call parent delete
      setDeleteModalOpen(false);
      setSelectedBeneficiary(null);
    } finally {
      setDeleting(false);
    }
  };

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
          bgcolor: "#0078B6",
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
        
          <Box ml={isMobile ? 2 : "auto"}>
                      {sender &&

    <Button
      variant="contained"
      size="small"
      onClick={() => setOpenModal(true)}
      startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
      sx={{ 
        minWidth: "auto", 
        px: 1.5, 
        backgroundColor:"#1AB1FF",
        py: 0.5, 
        fontSize: "0.75rem",
        borderRadius: 1,
        textTransform: "none",
        fontWeight: "500",
        boxShadow: "none",
       
      }}
    >
      Add Beneficiary
    </Button>
}
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
          <List dense sx={{ py: 0 }}>
            {normalized.map((b) => (
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
                      {b.verificationDt ? (
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
                          color="warning"
                          onClick={() => onVerify?.(b)}
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
                      )}

                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => onSelect?.(b)}
                        sx={{
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
              text: "Cancel",
              variant: "outlined",
              onClick: () => setOpenModal(false),
              disabled: submitting,
              sx: { borderRadius: 1 }
            },
            {
              text: submitting ? "Saving..." : "Save Beneficiary",
              variant: "contained",
              color: "primary",
              onClick: handleAddBeneficiary,
              disabled: submitting,
              sx: { borderRadius: 1 }
            },
          ]}
        />
      )}
   <DeleteBeneficiaryModal
  open={deleteOpen}
  onClose={() => setDeleteOpen(false)}
  beneficiary={selectedBeneficiary}
  sender={sender}
  onSuccess={() => {
    setDeleteOpen(false);
    setSelectedBeneficiary(null);
    onSuccess?.(sender.mobileNumber); // refresh list
  }}
/>
    </Card>
  );
};

export default Beneficiaries;
