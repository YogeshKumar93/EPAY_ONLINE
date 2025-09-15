// components/BusinessDetails.js
import React from "react";
import { Box, Typography, Button, Modal } from "@mui/material";

const BusinessDetails = ({ user }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    // You can either keep modal open until status changes
    // or redirect to a subscription page
    // For now, we won't close it unless user is active
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} disableEscapeKeyDown>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Subscription Required
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Your account is inactive. Please subscribe to access this platform.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (window.location.href = "/subscription")}
        >
          Subscribe Now
        </Button>
      </Box>
    </Modal>
  );
};

export default BusinessDetails;
