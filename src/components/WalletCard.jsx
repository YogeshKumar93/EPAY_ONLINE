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
        borderRadius: 2,
        background: "linear-gradient(135deg, #13c3c1, #6c4bc7)",
        backgroundSize: "200% 200%",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        maxWidth: "340px",
        backdropFilter: "blur(8px)",
        animation: "gradientShift 6s ease infinite",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          backgroundPosition: "right center",
        },
      }}
    >
      {/* Icon with subtle background */}
      <Box
        sx={{
          p: 0.6,
          borderRadius: 1.5,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      {/* Content */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography sx={{ opacity: 0.8, fontWeight: 700,fontSize:"9px" }}>{label}</Typography>
        <Typography sx={{ fontSize: "0.90rem", fontWeight: 600 }}>
          {amount}
        </Typography>
      </Box>

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
