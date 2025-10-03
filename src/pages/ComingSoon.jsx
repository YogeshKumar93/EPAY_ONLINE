import React from "react";
import { Box, Typography } from "@mui/material";

const ComingSoon = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h2"
        sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}
      >
        🚧 Coming Soon
      </Typography>
      <Typography variant="body1" color="text.secondary">
        We’re working hard to bring you this feature. Stay tuned!
      </Typography>
    </Box>
  );
};

export default ComingSoon;
