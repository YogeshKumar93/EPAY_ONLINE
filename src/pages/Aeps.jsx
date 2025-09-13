import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import myImage from "../assets/Images/aeps-guidelines-new.png"; // ✅ replace with your image
import myLogo from "../assets/Images/logo(1).png"; // ✅ replace with your logo
import atmIcon from "../assets/Images/aeps_print.png";
  import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  outline: "none",
};

const secondModalStyle = {
  ...style,
  width: "40%",
  textAlign: "center",
  p: 4,
};

const Aeps = () => {
  const [open, setOpen] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAccept = () => {
    setOpen(false);
    setOpenSecond(true); // ✅ open second modal
  };

  const handleSecondClose = () => setOpenSecond(false);

  // Example button functionality
  const handleAeps1 = () => alert("AEPS1 Selected 🚀");
  const handleAeps2 = () => alert("AEPS2 Selected 🎉");

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Open AEPS Modal
      </Button>

      {/* First Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* Image Section */}
          <Box
            component="img"
            src={myImage}
            alt="Guidelines"
            sx={{
              width: "100%",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderTop: "1px solid #ddd",
            }}
          >
            <Box component="img" src={myLogo} alt="Logo" sx={{ height: 40 }} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAccept}
            >
              Accept
            </Button>
          </Box>
        </Box>
      </Modal>




      {/* Second Modal */}  
 
<Modal open={openSecond} onClose={handleSecondClose}>
  <Box sx={secondModalStyle} position="relative">
    {/* Close Icon in Top Right */}
    <CloseIcon
      onClick={handleSecondClose}
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        cursor: "pointer",
        color: "gray",
        fontSize: 30,
      }}
    />

    <Typography
      variant="h5"
      sx={{ mb: 3, fontWeight: "bold", color: "#1CA895", textAlign: "center" }}
    >
      Choose Your AEPS Service
    </Typography>

    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
        mt: 2,
      }}
    >
      <Button
        variant="contained"
        sx={{
          bgcolor: "#1CA895",
          "&:hover": { bgcolor: "#138f79" },
          px: { xs: 8, sm: 8 },
          py: { xs: 2, sm: 3 },
          borderRadius: "12px",
          width: { xs: "100%", sm: "120px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
        onClick={handleAeps1}
      >
        <Box
          component="img"
          src={atmIcon}
          alt="ATM"
          sx={{
            height: { xs: 80, sm: 100 },
            width: { xs: 80, sm: 100 },
            bgcolor: "#fff",
            borderRadius: "50%",
            p: 1,
          }}
        />
        <Box
          component="span"
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          AEPS1
        </Box>
      </Button>

      <Button
        variant="outlined"
        sx={{
          borderColor: "#1CA895",
          color: "#1CA895",
          "&:hover": { borderColor: "#138f79", color: "#138f79" },
          px: { xs: 4, sm: 4 },
          py: { xs: 2, sm: 3 },
          borderRadius: "12px",
          width: { xs: "100%", sm: "120px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
        onClick={handleAeps2}
      >
        <Box
          component="img"
          src={atmIcon}
          alt="ATM"
          sx={{
            height: { xs: 80, sm: 100 },
            width: { xs: 80, sm: 100 },
            bgcolor: "#fff",
            borderRadius: "50%",
            p: 1,
          }}
        />
        <Box
          component="span"
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          AEPS2
        </Box>
      </Button>
    </Box>
  </Box>
</Modal>

    </div>
  );
};

export default Aeps;
