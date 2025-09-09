import React, { useContext } from "react";
import { Box, Tooltip, Typography } from "@mui/material";

const CommonCardServices = ({
  title,
  img,
  onClick,
  height,
  isSelected,
  width,
}) => {


  return (
    <Tooltip title={title} placement="top">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start", // Aligns text to the left
          background:
            "linear-gradient(-65deg, var(--bg) 50%, var(--accent) 50%)",
          boxShadow: 2,
          borderRadius: "8px",
          textAlign: "left",
          cursor: "pointer",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          width: width ? width : "100%",
          height: height ? height : "75%",
          // backgroundImage: `url(${recent})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          ml: 1,
          padding: 1,
          mt: 2,
          position: "relative",
          border: isSelected ? "2px solid #1877F2" : "2px solid transparent",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 4,
            border: "2px solid black",
            animation: "pulse 1s infinite",
          },
          "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.05)" },
            "100%": { transform: "scale(1)" },
          },
          // Add media queries for responsiveness
          "@media (max-width: 768px)": {
            flexDirection: "row", // Make layout horizontal on smaller screens
            height: "auto", // Allow height to adjust based on content
            padding: 2,
          },
          "@media (max-width: 600px)": {
            flexDirection: "column", // Stack items vertically on smaller screens
            textAlign: "center", // Center text when stacked
          },
        }}
        onClick={onClick}
      >
        <img
          src={img}
          alt={title}
          width="40px"
          style={{
            borderRadius: "50%",
            marginRight: "10px",
            // Make the image responsive
            maxWidth: "40px",
            height: "auto",
          }}
        />
        <Typography
          variant="subtitle1"
          sx={{
            ml: 1,
            fontWeight: 500,
            color: "#000",
            fontSize: "1rem",
            maxWidth: "calc(100% - 50px)",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "block",
            // Make text size responsive based on screen width
            "@media (max-width: 600px)": {
              fontSize: "0.85rem",
            },
            "@media (max-width: 400px)": {
              fontSize: "0.75rem",
            },
          }}
        >
          {title}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default CommonCardServices;
