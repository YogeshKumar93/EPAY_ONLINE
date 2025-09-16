// ReButton.js
import React, { useContext } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../../contexts/AuthContext";

// Fallback defaults
const DEFAULT_BG = "orange";
const DEFAULT_TEXT = "#000";

const ReButton = ({ label, onClick, startIcon = <AddIcon /> }) => {
  const { colours } = useContext(AuthContext);

  // pick from API or fallback
  const bgColor = colours?.button_color || DEFAULT_BG;
  const textColor = colours?.text_color || DEFAULT_TEXT;

  return (
    <Button
      variant="contained"
      size="medium"
      startIcon={startIcon}
      onClick={onClick}
      sx={{
        backgroundColor: bgColor,
        color: "#FFFF",
        textTransform: "none",
        fontWeight: 500,
        "&:hover": {
          backgroundColor: bgColor,
          opacity: 0.9,
        },
      }}
    >
      {label}
    </Button>
  );
};

export default ReButton;
