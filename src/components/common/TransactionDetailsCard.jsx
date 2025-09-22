import React from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PanToolIcon from "@mui/icons-material/PanTool"; // This is the hand icon
import { ArrowDropDownIcon } from "@mui/x-date-pickers";

// Status color mapping
const statusColors = {
  SUCCESS: "#b7f0a6",
  FAILED: "#ef9a9a",
  PENDING: "#fffde7",
};

const TransactionDetailsCard = ({
  amount,
  status,
  dateTime,
  message,
  details = [],
  onRaiseIssue,
  onClose,
  companyLogoUrl,
  width = 400,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width,
        height: "90%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        position: "absolute", // <-- important
        zIndex: 900,

        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: statusColors[status] || "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          zIndex: 10,
          height: 180,
        }}
      >
        {/* Top Row: Close + Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          {/* Close icon on left */}
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>

          {/* Company Logo on right */}
          {companyLogoUrl && (
            <Box
              component="img"
              src={companyLogoUrl}
              alt="Company Logo"
              sx={{ height: 72, width: 122, objectFit: "contain" }}
            />
          )}
        </Box>

        {/* Amount / Status / Date */}
        {amount && (
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            ₹ {amount}
          </Typography>
        )}
        {status && (
          <Typography
            variant="h6"
            textAlign="center"
            color={status === "Success" ? "success.main" : "error"}
          >
            {status}
          </Typography>
        )}
        {dateTime && (
          <Typography variant="caption" textAlign="center">
            {dateTime}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Message */}
      {message && (
        <Box p={2}>
          <Stack spacing={2.5}>
            {" "}
            {/* spacing controls gap between lines */}
            <Typography color="text.secondary" sx={{ fontSize: 12, mt: -1 }}>
              {status}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography>Show Timeline</Typography>
              <ArrowDropDownIcon fontSize="small" />
            </Box>
          </Stack>
        </Box>
      )}

      <Divider />

      {/* Details in rows */}
      {details.length > 0 && (
        <Box p={2} flex={1} overflow="auto">
          {/* Header Row with Icons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
              Transaction Details
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                onClick={onRaiseIssue}
                sx={{ color: "#55a3f1ff" }}
              >
                <PanToolIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => window.print()}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Details List */}
          {details.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 0.25,
                // borderBottom: "1px solid #eee",
              }}
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
      )}
    </Paper>
  );
};

export default TransactionDetailsCard;
