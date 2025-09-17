import React from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Status color mapping
const statusColors = {
  Success: "#0d7425ff",
  Failed: "#a42f39ff",
  Pending: "#e4bb32ff",
};

const TransactionDetailsCard = ({
  amount,
  status,
  dateTime,
  message,
  details = [],
  onRaiseIssue,
  onClose,        // ✅ Added onClose prop
  companyLogoUrl, // ✅ Added company logo prop
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
     top: 64, // <-- add this! (replace 64 with your header height)
    left: "50%",
    transform: "translateX(-50%)",
     
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1,
          bgcolor: statusColors[status] || "#f5f5f5",
          display: "flex",
          flexDirection: "column",
           position: "sticky", // <- sticky header
    top: 0,             // <- stick to top of Paper
    zIndex: 10,  
             
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
              sx={{ height: 62, width: 82, objectFit: "contain" }}
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
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </Box>
      )}

      <Divider />

      {/* Details in rows */}
     {/* Details in rows */}
{details.length > 0 && (
  <Box p={2} flex={1} overflow="auto">
    <Typography variant="subtitle1" gutterBottom>
      Transaction Details
    </Typography>
    {details.map((item, idx) => (
      <Box
        key={idx}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 1,
          borderBottom: "1px solid #eee",
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


      {/* Footer */}
      {onRaiseIssue && (
        <Box p={2} textAlign="center">
          <Button
            variant="outlined"
            color="error"
            onClick={onRaiseIssue}
            sx={{ borderRadius: 2 }}
          >
            Raise Issue
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default TransactionDetailsCard;
