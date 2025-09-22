import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import myImage from "../assets/Images/aeps-guidelines-new.png";
import myLogo from "../assets/Images/PPALogo.jpeg";
import atmIcon from "../assets/Images/aeps_print.png";
import Aeps1 from "./Aeps1";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const Aeps = () => {
  const [step, setStep] = useState(1);

  if (step === 1) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Box
          component="img"
          src={myImage}
          alt="Guidelines"
          sx={{
            width: "100%",
            maxWidth: 700,
            height:400,
            borderRadius: 2,
            mb: 2,
            pt:8
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #ddd",
            pt: 2,
          }}
        >
          <Box component="img" src={myLogo} alt="Logo" sx={{ height: 40 }} />
          <Button
            variant="contained"
            sx={{ bgcolor: "#9d72f0", "&:hover": { bgcolor: "#8756e5" } }}
            onClick={() => setStep(2)}
          >
            Accept
          </Button>
        </Box>
      </Box>
    );
  }

  
  // Step 2 → AEPS Selection
if (step === 2) {
  return (
    <Box
      sx={{
        p: 5, // padding around the whole section
        bgcolor: "#f5f5f5", // light background color
        borderRadius: 4, // rounded corners
        boxShadow: 3, // slight shadow
        border: "1px solid #3d3df0ff",
        maxWidth: 700,
        height: 400,
        mx: "auto", // center horizontally
       mt:8
      }}
    >
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", color: "#9d72f0" }}
        >
          Select AEPS Type
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
            mt: 7,
          }}
        >
          {/* AEPS1 */}
          <Button
            onClick={() => setStep(3)}
            sx={{
              width: 140,
              height: 160,
              bgcolor: "#9d72f0",
              color: "#fff",
              borderRadius: 3,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                bgcolor: "#8756e5",
                boxShadow: 6,
              },
            }}
          >
            <Box
              component="img"
              src={atmIcon}
              alt="ATM"
              sx={{
                height: 60,
                width: 60,
                bgcolor: "#fff",
                borderRadius: "50%",
                p: 1,
              }}
            />
            <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
              AEPS1
            </Typography>
          </Button>

          {/* AEPS2 */}
          <Button
            onClick={() => setStep(4)}
            sx={{
              width: 140,
              height: 160,
              border: "2px solid #9d72f0",
              borderRadius: 3,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                borderColor: "#8756e5",
                color: "#8756e5",
                boxShadow: 6,
              },
            }}
          >
            <Box
              component="img"
              src={atmIcon}
              alt="ATM"
              sx={{
                height: 60,
                width: 60,
                bgcolor: "#fff",
                borderRadius: "50%",
                p: 1,
              }}
            />
            <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
              AEPS2
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}


  // Step 3 → AEPS1 Component
  if (step === 3) {
    return <Aeps1 />;
  }

  // Step 4 → AEPS2 Component (abhi example ke liye simple text)
  if (step === 4) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" color="primary">
          Complete Aeps2 Onboarding using mobile app
        </Typography>
      </Box>
    );
  }

  return null;
};

export default Aeps;
