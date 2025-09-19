import React from "react";
import { Box, Typography } from "@mui/material";

const CommonStatus = ({ value, is_read }) => {
  let statusText = "";

  // Handle main status
  if (value === 1 || value === "1") statusText = "ACTIVE";
  else if (value === 0 || value === "0") statusText = "INACTIVE";
  else statusText = value?.toString()?.toUpperCase();

  // Status-to-color mapping
  const statusMap = {
    APPROVED: { bg: "#DDFAF3", dot: "#1EE0AC", text: "#00c896" },
    "ON HOLD": { bg: "rgba(255, 193, 7, 0.2)", dot: "#fbc02d", text: "#fbc02d" },
    PENDING: { bg: "#FDF5DB", dot: "#FFBD0E", text: "#ff9800" },
    FAILED: { bg: "rgba(244, 67, 54, 0.2)", dot: "#f44336", text: "#f44336" },
    ACTIVE: { bg: "rgba(76, 175, 80, 0.2)", dot: "#4caf50", text: "#4caf50" },
    INACTIVE: { bg: "rgba(158, 158, 158, 0.2)", dot: "#9e9e9e", text: "#9e9e9e" },
    SUCCESS: { bg: "rgba(76, 175, 80, 0.2)", dot: "#4caf50", text: "green" },
      REJECTED: { bg: "rgba(244, 67, 54, 0.2)", dot: "#f44336", text: "#f44336" },
    UNREAD: { bg: "rgba(255, 152, 0, 0.2)", dot: "#ff9800", text: "#ff9800" },
    READ: { bg: "rgba(253, 216, 53, 0.2)", dot: "#fdd835", text: "#fdd835" },
  };

  // Override with is_read
  if (typeof is_read !== "undefined") {
    if (is_read === 0 || is_read === "0") statusText = "UNREAD";
    else if (is_read === 1 || is_read === "1") statusText = "READ";
  }

  const colors = statusMap[statusText] || { bg: "#eee", dot: "#999", text: "#555" };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        backgroundColor: colors.bg,
        color: colors.text,
        borderRadius: "999px", // pill shape
        px: 1,
        py: 0.5,
        fontSize: ".5rem",
        fontWeight: 400,
        minWidth: "80px",
        justifyContent: "center",
      }}
    >
      {/* Dot */}
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: colors.dot,
        }}
      />
      <Typography variant="body2" sx={{ fontWeight: 400, fontSize: ".7rem" }}>
        {statusText}
      </Typography>
    </Box>
  );
};

export default CommonStatus;
