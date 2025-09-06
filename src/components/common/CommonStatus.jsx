import React from "react";
import { Button } from "@mui/material";

const CommonStatus = ({ value }) => {
  // Convert numeric or string statuses to display text
  let statusText = "";
  if (value === 1 || value === "1") statusText = "ACTIVE";
  else if (value === 0 || value === "0") statusText = "INACTIVE";
  else statusText = value?.toString()?.toUpperCase(); // convert any string to uppercase

  // Map each status to a color
  const statusColors = {
    ACTIVE: "green",
    INACTIVE: "gray",
    SUCCESS: "green",
    PENDING: "orange",
    APPROVED: "green",
    FAILED: "red",
    REJECTED: "ORANGE",
  };

  const bgColor = statusColors[statusText] || "lightgray";

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: bgColor,
        color: "white",
        textTransform: "uppercase", // ensures button text is uppercase
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: bgColor,
          opacity: 0.9,
        },
      }}
      size="small"
    >
      {statusText}
    </Button>
  );
};

export default CommonStatus;
