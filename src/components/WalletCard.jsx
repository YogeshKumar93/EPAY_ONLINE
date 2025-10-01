import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  AccountBalanceWallet,
} from "@mui/icons-material";

const WalletCard = ({
  label = "",
  amount = "",
  icon = <AccountBalanceWallet />,
  trend = "up",
}) => {
  return (
    <Box
      sx={{
        px: 1,
        py: 1,
        borderRadius: 2,
        background:
          "linear-gradient(135deg, #90c9d8ff, #3b88cfff, #2960c5ff, #6ab0f3)",
        backgroundSize: "300% 300%",
        color: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        border: "2px solid #2275b7",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        // minWidth: 180,   ❌ remove this
        width: "auto", // ✅ let it auto expand
        maxWidth: "100%", // ✅ safe for responsiveness
        backdropFilter: "blur(6px)",
        animation: "gradientAnimation 8s ease infinite",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
        },
      }}
    >
      {/* Left: Icon */}
      <Avatar
        sx={{
          bgcolor: "#2275b7",
          width: 22,
          height: 22,
        }}
      >
        {icon}
      </Avatar>

      {/* Middle: Text */}
      <Box sx={{ ml: 1 }}>
        <Typography
          sx={{
            fontSize: "1.2rem", // overall font size
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#fff",
          }}
        >
          <span style={{ fontSize: "1.4rem", fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>{amount}</span>
        </Typography>
      </Box>

      {/* <Typography
          sx={{
            fontSize: "1.2rem", // amount font size
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#fff",
          }}
        ></Typography> */}
      {/* </Box> */}

      {/* Right: Trend Icon */}
      {/* <Avatar
        sx={{
          bgcolor: trend === "up" ? "rgba(40, 180, 99, 0.85)" : "rgba(219, 68, 55, 0.85)",
          width: 28,
          height: 28,
        }}
      >
        {trend === "up" ? <ArrowUpward sx={{ fontSize: 18, color: "#fff" }} /> : <ArrowDownward sx={{ fontSize: 18, color: "#fff" }} />}
      </Avatar> */}

      {/* Gradient Animation Keyframes */}
      <style>
        {`
          @keyframes gradientAnimation {
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
