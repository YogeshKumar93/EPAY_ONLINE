// ReButton.js
import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Default colors for the button
const DEFAULT_BG = "#1CA895"; // default green
const DEFAULT_TEXT = "#ffffff";

const ReButton = ({
  label,
  onClick,
  startIcon = <AddIcon />, // default start icon
}) => {
  return (
    <Button
      variant="contained"
      size="medium"
      fullWidth={false}
      disabled={false}
      startIcon={startIcon}
      onClick={onClick}
      sx={{
        backgroundColor: DEFAULT_BG,
        color: DEFAULT_TEXT,
        textTransform: "none",
        fontWeight: 500,
        "&:hover": {
          backgroundColor: DEFAULT_BG,
          opacity: 0.9,
        },
      }}
    >
      {label}
    </Button>
  );
};

export default ReButton;
