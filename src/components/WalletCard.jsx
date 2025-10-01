import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import PaymentsIcon from "@mui/icons-material/Payments";

const WalletCard = ({
  label = "",
  amount = "",
  icon = <PaymentsIcon />,
  trend = "up",
}) => {
  return (
    <Box
      sx={{
        px: 2,
      
        borderRadius: 3,
        background: "linear-gradient(135deg, #13c3c1, #6c4bc7)",
        backgroundSize: "200% 200%",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 3,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        maxWidth: "260px",
        backdropFilter: "blur(8px)",
        animation: "gradientShift 6s ease infinite",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          backgroundPosition: "right center",
        },
      }}
    >
      {/* Icon with subtle background */}
      <Box
        sx={{
          p: 0,
          borderRadius: 2,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1}}>
        <Typography sx={{ fontSize: "1.8rem", opacity: 0.9, fontWeight:700   }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
          {amount}
        </Typography>
      </Box>

      {/* Trend Indicator */}
      {trend && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 14,
            borderRadius: "50%",
            bgcolor: trend === "up" ? "rgba(40, 180, 99, 0.9)" : "rgba(219, 68, 55, 0.9)",
          }}
        >
          {trend === "up" ? (
            <ArrowUpward sx={{ fontSize: 14, color: "#fff" }} />
          ) : (
            <ArrowDownward sx={{ fontSize: 14, color: "#fff" }} />
          )}
        </Box>
      )}

      {/* Gradient Animation */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
  );
};

export default WalletCard;