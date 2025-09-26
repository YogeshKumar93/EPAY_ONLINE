// components/ReceiptButton.js
import React, { useState } from "react";
import { IconButton, Tooltip, Modal, Box } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt"; // MUI icon
import CommonModal from "./common/CommonModal";

const ReceiptButton = ({ row }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="View Receipt">
        <IconButton color="primary" onClick={handleOpen}>
          <ReceiptIcon />
        </IconButton>
      </Tooltip>

      <CommonModal
        open={open}
        onClose={handleClose}
        footerButtons={[]}
        title="Receipt"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Receipt Image */}
          <img
            src={row?.receipt}
            alt="Receipt"
            style={{
              maxWidth: "10%", // modal width ke hisaab se fit
              maxHeight: "10%", // modal height ke hisaab se fit
              objectFit: "contain", // image scale maintain kare
              borderRadius: 8,
            }}
          />
        </Box>
      </CommonModal>
    </>
  );
};

export default ReceiptButton;
