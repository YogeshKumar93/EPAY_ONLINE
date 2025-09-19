import React from "react";
import { Avatar, Box, Tooltip, Typography } from "@mui/material";





const WalletCard = ({ label = "", amount = "" }) => {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: "12px",
        background: "#9d72f0",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: 1,
        boxShadow: "0 3px 6px rgba(124,77,255,0.3)",
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 12px rgba(124,77,255,0.45)",
        },
      }}
    >
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>
        {amount}
      </Typography>
    </Box>
  );
};


export default WalletCard;
