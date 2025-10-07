import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import myImage from "../assets/Images/aeps-guidelines-new.png";
import myLogo from "../assets/Images/logo(1).png";
import atmIcon from "../assets/Images/aeps_print.png";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import AEPS2FAModal from "../components/AEPS/AEPS2FAModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import { useToast } from "../utils/ToastContext";
import AepsMainComponent from "../components/AepsMain";
import OutletDmt1 from "./OutletDnt1";
import AuthContext from "../contexts/AuthContext";
import CommonLoader from "../components/common/CommonLoader";
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
  const [loading, setLoading] = useState(false);
  const [aadhaar, setAadhaar] = useState("");
  const [fingerScanData, setFingerScanData] = useState("");
  const [openDmt1Modal, setOpenDmt1Modal] = useState(false);

  const { showToast } = useToast();
  const { user, location } = useContext(AuthContext);
  const instId = user?.instId; // Check if instId exists

  const checkAepsLoginStatus = async () => {
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

      if (response?.data?.data === "LOGINREQUIRED") {
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

  const AepsLogin = async (scanData = fingerScanData) => {
    setLoading(true);
    try {
      if (!aadhaar || !scanData) {
        showToast("Please provide Aadhaar and Fingerprint data", "error");
        return;
      }

      const payload = {
        AadharNumber: aadhaar,
        errInfo: scanData.errInfo,
        pidDataType: scanData.type,
        pidData: scanData.pidData,
        ci: scanData.cI,
        dc: scanData.dC,
        dpId: scanData.dpId,
        fCount: scanData.fCount,
        hmac: scanData.hMac,
        mc: scanData.mC,
        mi: scanData.mI,
        nmPoints: scanData.nmPoints,
        qScore: scanData.qScore,
        rdsId: scanData.rdsId,
        rdsVer: scanData.rdsVer,
        sessionKey: scanData.sessionKey,
        srno: scanData.srno,
        pf: scanData.pf,
        latitude: location.lat,
        longitude: location.long,
        operator: 22,
        type: "DAILY_LOGIN",
      };

      console.log("AEPS Login Payload:", payload);

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.AEPS_LOGIN,
        payload
      );

      if (error) {
        apiErrorToast(error);
        return;
      }

      if (response) {
        if (
          response?.data?.message === "LOGINREQUIRED" ||
          response?.message === "LOGINREQUIRED"
        ) {
          setTwoFAStatus("LOGINREQUIRED");
          setOpenAEPS2FA(true);
          setOpenAepsMain(false);
        } else if (response.message === "LOGGEDIN") {
          setOpenAEPS2FA(false);
          setOpenAepsMain(true);
        } else {
          showToast(response?.message);
          setOpenAEPS2FA(false);
          setOpenAepsMain(false);
        }
      } else {
        showToast(error?.message);
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

  return (
    <>
      <CommonLoader loading={loading} />
      {!instId ? (
        <Box
          textAlign="center"
          mt={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Typography variant="h6" color="text.secondary">
            You need to complete Outlet Registration to use AEPS1.
          </Typography>
          <button
            onClick={() => setOpenDmt1Modal(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Register Outlet
          </button>

          <OutletDmt1
            open={openDmt1Modal}
            handleClose={() => setOpenDmt1Modal(false)}
            onSuccess={() => {
              setOpenDmt1Modal(false);
              // window.location.reload(); // Or refresh instId via context if dynamic
            }}
          />
        </Box>
      ) : (
        <div>
          {!openAepsMain && (
            <AEPS2FAModal
              title="AEPS1"
              open={openAEPS2FA}
              onClose={() => setOpenAEPS2FA(false)}
              isAepsOne
              isAepsTwo={false}
              twoFAStatus={twoFAStatus}
              setTwoFAStatus={setTwoFAStatus}
              fingerData={setFingerScanData}
              onFingerSuccess={AepsLogin}
              aadhaar={aadhaar}
              setAadhaar={setAadhaar} // ✅ fixed
              buttons={[
                {
                  label: "AEPS1",
                  variant: "outlined",
                  bgcolor: "white",
                  color: "#2275b7",
                  hoverColor: "#f0f7ff",
                  onClick: () => console.log("AEPS1 Clicked"),
                },
              ]}
            />
          )}

          {openAepsMain && <AepsMainComponent />}
        </div>
      )}
    </>
  );
};

export default Aeps1;
