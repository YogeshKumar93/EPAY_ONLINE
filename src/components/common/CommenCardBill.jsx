import React from "react";
import { Box, Grid, Tooltip, Typography } from "@mui/material";

const CommenCardBill = ({ title, img, onClick, isSelected = false }) => {
  let imageSrc;
  try {
    // imageSrc = require(`../assests/operators/${img}.png`);
  } catch (error) {
    imageSrc = null;
  }
  return (
    <Grid>
      <Tooltip title={title} placement="top">
        <Box
          className={isSelected ? "card-selected" : "card-unselected"}
          sx={{
            display: "flex",
            alignItems: "center",
            background: "#F8F9FA", // Light background for better contrast
            boxShadow: isSelected ? 4 : 1,
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
            width: "90%",
            height: "60px", // Reduced height
            padding: "8px 12px", // Adjusted padding
            mt: 1.5,
            ml: 1,
            border: isSelected ? "2px solid #007B55" : "1px solid #E0E0E0",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: 3,
              border: "1px solid #007B55",
            },
          }}
          onClick={onClick}
        >
          {/* Image */}
          <Box
            component="img"
            src={imageSrc || img}
            alt={title}
            sx={{
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              mr: 1.5,
              objectFit: "cover",
            }}
          />

          {/* Title */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#333",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1, // Allows text to take remaining space
            }}
          >
            {title}
          </Typography>
        </Box>
      </Tooltip>
    </Grid>
  );
};

export default CommenCardBill;
