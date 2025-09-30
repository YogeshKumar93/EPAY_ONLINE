import React, { useContext } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PanToolIcon from "@mui/icons-material/PanTool";
import AuthContext from "../contexts/AuthContext";
import { ddmmyyWithTime } from "../utils/DateUtils";

const statusColors = {
  SUCCESS: "#b7f0a6",
  FAILED: "#ef9a9a",
  PENDING: "#fffde7",
};

const TransactionDrawer = ({
  row,
  onRaiseIssue,
  onClose,
  companyLogoUrl,
  width = 400,
}) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  // Split row into groups
  const transactionDetails = [
    { label: "Service", value: row.operator },
    { label: "UTR", value: row.operator_id },
    { label: "Client Ref", value: row.client_ref },
    { label: "Txn Id", value: row.txn_id },
    { label: "Amount", value: row.amount },
  ];

  const commissionDetails = [
    { label: "Ret Comm", value: row.comm },
    { label: "Charge", value: row.charges },
    { label: "Ret TDS", value: row.tds },

    { label: "Di Comm", value: row.di_comm },

    { label: "Di TDS", value: row.di_tds },
    { label: "Md Comm", value: row.md_comm },
    { label: "Md TDS", value: row.md_tds },
    { label: "GST", value: row.gst },
    { label: "CCF", value: row.ccf },
  ];

  const beneficiaryDetails = [
    { label: "Sender Number", value: row.sender_mobile },
    { label: "NAME", value: row.beneficiary_name },
    { label: "ACC", value: row.account_number },
    { label: "IFSC", value: row.ifsc_code },
    { label: "MOP", value: row.mop },
  ];
  const filteredCommissionDetails = commissionDetails.filter((item) => {
    if (user.role === "ret" || user.role === "dd") {
      return !["Di Comm", "Di TDS", "Md Comm", "Md TDS"].includes(item.label);
    }
    return true; // for other roles, show all
  });
  if (!row) return null;

  const renderSection = (title, data) => (
    <Box mb={2}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {data.map((item, idx) => (
        <Box
          key={idx}
          sx={{ display: "flex", justifyContent: "space-between", py: 0.25 }}
        >
          <Typography variant="body2" color="text.secondary">
            {item.label}
          </Typography>
          <Typography variant="body2" fontWeight="500">
            {item.value ?? "N/A"}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{ width, height: "90%", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: statusColors[row.status] || "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          zIndex: 10,
          height: 180,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          {companyLogoUrl && (
            <Box
              component="img"
              src={companyLogoUrl}
              alt="Company Logo"
              sx={{ height: 72, width: 100, objectFit: "contain" }}
            />
          )}
        </Box>

        <Typography variant="h4" fontWeight="bold" textAlign="center">
          ₹ {row.amount}
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color={row.status === "SUCCESS" ? "success.main" : "error"}
        >
          {row.status}
        </Typography>
        <Typography variant="caption" textAlign="center">
          {ddmmyyWithTime(row.created_at)}
        </Typography>
      </Box>

      <Divider />

      {/* Details List */}
      <Box p={2} flex={1} overflow="auto">
        {renderSection("Transaction Details", transactionDetails)}
        <Divider sx={{ my: 1 }} />
        {renderSection("Commission Details", filteredCommissionDetails)}
        <Divider sx={{ my: 1 }} />
        {renderSection("Beneficiary Details", beneficiaryDetails)}
      </Box>
    </Paper>
  );
};

export default TransactionDrawer;
