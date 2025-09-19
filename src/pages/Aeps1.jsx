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
const Aeps1 = () => {
  const [openAEPS2FA, setOpenAEPS2FA] = useState(false);
  const [openAepsMain, setOpenAepsMain] = useState(false);
  const [twoFAStatus, setTwoFAStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [aadhaar, setAadhaar] = useState("");
  const [fingerScanData, setFingerScanData] = useState("");
  const { showToast } = useToast();

  const checkAepsLoginStatus = async () => {
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
        setOpenAepsMain(false);
      } else {
        setOpenAepsMain(true);
        setOpenAEPS2FA(false);
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
    }
  };
  const AepsLogin = async () => {
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.AEPS_LOGIN
      );

      if (error) {
        apiErrorToast(error);
        return;
      }

      if (response?.data?.message === "LOGINREQUIRED") {
        setTwoFAStatus("LOGINREQUIRED");
        setOpenAEPS2FA(true);
        setOpenAepsMain(false);
      } else {
        setOpenAepsMain(true);
        setOpenAEPS2FA(false);
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAepsLoginStatus();
  }, []);

  if (loading) return <p>Checking AEPS login status...</p>;

  return (
    <div>
      {/* ✅ 2FA Modal */}
      <AEPS2FAModal
        title="AEPS1"
        open={openAEPS2FA}
        onClose={() => setOpenAEPS2FA(false)}
        isAepsOne
        isAepsTwo={false}
        twoFAStatus={twoFAStatus}
        setTwoFAStatus={setTwoFAStatus}
        fingerData={setFingerScanData}
        aadhaar={aadhaar}
        setAadhaar={aadhaar}
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

      {/* ✅ Main AEPS Component */}
      {openAepsMain && <AepsMainComponent />}
    </div>
  );
};

export default Aeps1;
