import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";

const CardComponent = ({
  title,
  img,
  onClick,
  height,
  py,
  px,
  isSelected = false,
}) => {
  let imageSrc;
  try {
    imageSrc = require(`../assets/operators/${img}.png`);
  } catch (error) {
    imageSrc = null;
  }


console.log("title color",title);
  const cardHeight = height || "75px";

  return (
    // <Tooltip title={title} placement="top">
    <Box
      className={isSelected ? "card-selected" : "card-unselected"}
      sx={{
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(-65deg, var(--bg) 50%, var(--accent) 50%)",
        boxShadow: 2,
        borderRadius: "8px",
        textAlign: "left",
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        width: "95%",
        height: cardHeight,
        ml: 1,
        padding: 2,
        mt: 2,
        overflow: "hidden",
        position: "relative",
        border: isSelected ? "2px solid #08509E" : "2px solid transparent",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 4,
          border: "2px solid black",
        },
      }}
      onClick={onClick}
    >
      <img
        src={imageSrc || img}
        alt={title}
        style={{
          borderRadius: "50%",
          marginRight: "10px",
          width: "37px",
          height: "37px",
          "@media (min-width: 600px)": {
            width: "40px",
            height: "40px",
          },
        }}
      />

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 500,
          fontSize: "1rem",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          whiteSpace: "normal",
          textOverflow: "ellipsis",
          color: "#000",
          lineHeight: "1.2rem",
          maxHeight: "2.4rem",
        }}
      >
        {title}
      </Typography>
    </Box>
    // </Tooltip>
  );
};

export default CardComponent;
