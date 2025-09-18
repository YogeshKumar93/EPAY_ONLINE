import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import myImage from "../assets/Images/aeps-guidelines-new.png";
import myLogo from "../assets/Images/logo(1).png";
import atmIcon from "../assets/Images/aeps_print.png";
import CloseIcon from "@mui/icons-material/Close";
import AEPS2FAModal from "../components/AEPS/AEPS2FAModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import { useToast } from "../utils/ToastContext";
import AepsMainComponent from "../components/AepsMain";

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
  const [openFirst, setOpenFirst] = useState(true); // Page load → first modal
  const [openSecond, setOpenSecond] = useState(false);
  const [openAEPS2FA, setOpenAEPS2FA] = useState(false);
  const [openAepsMain, setOpenAepsMain] = useState(false);
  const [twoFAStatus, setTwoFAStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // API call to check AEPS login status
  const handleGetOtp = async () => {
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.AEPS_LOGIN_STATUS
      );

      if (error) {
        apiErrorToast(error);
        return;
      }

      if (response?.data?.message === "LOGINREQUIRED") {
        setTwoFAStatus("LOGINREQUIRED");
        setOpenAEPS2FA(true);
      } else {
        setOpenAepsMain(true);
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
    }
  };

  // First modal handlers
  const handleCloseFirst = () => setOpenFirst(false);
  const handleAcceptFirst = () => {
    setOpenFirst(false);
    setOpenSecond(true);
  };

  // Second modal handlers
  const handleAeps1Click = async () => {
    setOpenSecond(false);
    await handleGetOtp();
  };
  const handleAeps2Click = () => alert("AEPS2 Selected 🎉");

  return (
    <div>
      {/* First Modal */}
      <Modal open={openFirst} onClose={handleCloseFirst}>
        <Box sx={style}>
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
              sx={{ bgcolor: "#9d72f0", "&:hover": { bgcolor: "#8756e5" } }}
              onClick={handleAcceptFirst}
            >
              Accept
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Second Modal */}
      {openSecond && (
        <Box position="relative">
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              color: "#9d72f0",
              textAlign: "center",
            }}
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
            {/* AEPS1 */}
            <Button
              variant="contained"
              sx={{
                bgcolor: "#9d72f0",
                "&:hover": { bgcolor: "#8756e5" },
                px: { xs: 8, sm: 8 },
                py: { xs: 2, sm: 3 },
                borderRadius: "12px",
                width: { xs: "100%", sm: "120px" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
              onClick={handleAeps1Click}
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
              <Box sx={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
                AEPS1
              </Box>
            </Button>

            {/* AEPS2 */}
            <Button
              variant="outlined"
              sx={{
                borderColor: "#9d72f0",
                color: "#9d72f0",
                "&:hover": { borderColor: "#8756e5", color: "#8756e5" },
                px: { xs: 4, sm: 4 },
                py: { xs: 2, sm: 3 },
                borderRadius: "12px",
                width: { xs: "100%", sm: "120px" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
              onClick={handleAeps2Click}
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
              <Box sx={{ fontSize: "24px", fontWeight: "bold" }}>AEPS2</Box>
            </Button>
          </Box>
        </Box>
      )}

      {/* AEPS 2FA Modal */}
      {openAEPS2FA && (
        <AEPS2FAModal
          title="AEPS1"
          open={openAEPS2FA}
          onClose={() => setOpenAEPS2FA(false)}
          isAepsOne
          isAepsTwo={false}
          twoFAStatus={twoFAStatus}
          setTwoFAStatus={setTwoFAStatus}
          buttons={[
            {
              label: "AEPS1",
              variant: "outlined",
              bgcolor: "white",
              color: "#9d72f0",
              hoverColor: "#f5f2ff",
              onClick: () => console.log("AEPS1 Clicked"),
            },
          ]}
        />
      )}

      {openAepsMain && <AepsMainComponent />}
    </div>
  );
};

export default Aeps;
