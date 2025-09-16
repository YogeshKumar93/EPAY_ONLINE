import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const KycPending = () => {
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(145deg, #fff8e1, #ffecb3)",
          textAlign: "center",
          maxWidth: 500,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="error" gutterBottom>
          Your Documnets have been submitted 
        </Typography>
        <Typography variant="body1" >
          Kindly contact admin for further assistance.
        </Typography>
      </Paper>
    </Box>
  );
};

export default KycPending;
