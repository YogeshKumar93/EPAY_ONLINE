import React from "react";
import { Avatar, Box, Tooltip, Typography } from "@mui/material";





const WalletCard = ({ label = "", amount = "" }) => {
  return (
 <Box
  sx={{
    px: 2,
    py: 1,
    borderRadius: "16px",
    background: "#dbe8e3ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    },
  }}
>
  {/* Left: Label + optional icon */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {/* Optional icon placeholder */}
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: "#451b9bff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.8rem",
      }}
    >
      💰
    </Box>
    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: 0.5, color: "#000" }}>
      {label}
    </Typography>
  </Box>

  {/* Right: Amount */}
  <Typography sx={{ fontSize: "1rem", fontWeight: 700, letterSpacing: 0.5, color: "#000" }}>
    {amount}
  </Typography>
</Box>




  );
};


export default WalletCard;
