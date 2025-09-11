// RemitterDetails.js
import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const RemitterDetails = ({ sender }) => {
  if (!sender) return null;

  return (
    <Paper sx={{ p: 0, mt: 2, borderRadius: 2, overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#0078B6",
          color: "#fff",
          textAlign: "center",
          py: 1.5,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Remitter Details
        </Typography>
      </Box>

      {/* Details Section */}
      <Box sx={{ mx: 2, my: 2, p: 2, bgcolor: "#f0f8ff", borderRadius: 2 }}>
        {[
          { label: "Name", value: `${sender.firstName} ${sender.lastName}` },
          { label: "Mobile Number", value: sender.mobileNumber },
          { label: "Pincode", value: sender.pincode || "-" },
          { label: "Available Limit", value: sender.limitAvailable },
        ].map((item, index) => (
          <Box key={index} display="flex" mb={1}>
            <Typography
              variant="body2"
              fontWeight="500"
              color="#4B5563"
              sx={{ width: "190px", flexShrink: 0 }}
            >
              {item.label}
            </Typography>
            <Typography variant="body2" color="#111827">
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default RemitterDetails;
