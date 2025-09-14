// Login.js (Updated Layout - Image Left, Login Right, Full Functionality, Scrollbar Hidden)
import React, { use, useContext, useEffect, useRef, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Grid,
  Modal,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PhoneAndroid,
  Lock,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AuthContext from "../contexts/AuthContext";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { ReTextField } from "../components/common/ReTextField";
import backImg from "../assets/Images/BackgroundLogin2.png";
import VerifyMpinLogin from "../components/UI/VerifyMpinLogin";
import { getGeoLocation } from "../utils/GeoLocationUtil";
import { okErrorToast } from "../utils/ToastUtil";
import ForgotPassword from "../components/common/ForgotPassword";
import biggpayLogo from "../assets/logo(1).png";
import QRCode from "react-qr-code";

const QrLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [isMpinRequired, setIsMpinRequired] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [polling, setPolling] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureValidate, setSecureValidate] = useState("");
  const [otpRef, setOtpRef] = useState("");

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const pollingRef = useRef(null);
  const timeoutRef = useRef(null);

  const generateQrLogin = async () => {
    try {
      setLoading(true);
      setLoginError("");
      setPolling(false);

      // 🔹 Clear previous polling & timeout
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.QR_LOGIN,
        {}
      );

      if (error) {
        setLoginError(error.message || "QR generation failed");
        return;
      }

      if (response?.data) {
        const token = response.data;
        setQrToken(token); // save latest token

        // 🔹 Start polling with latest token
        startPolling(token);
      }
    } catch (err) {
      setLoginError(err.message || "QR generation failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Poll QR Status
  const checkQrStatus = async (token) => {
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.QR_STATUS,
        { token }
      );

      if (error) return;

      const status = response?.status;

      if (status === "approved") {
        clearInterval(pollingRef.current);
        clearTimeout(timeoutRef.current);
        setPolling(false);

        // 🔹 Save token from response.data
        const authToken = response?.data;
        authCtx.login(authToken);

        const userResult = await apiCall("GET", ApiEndpoints.GET_ME_USER);
        if (userResult.response) {
          const userData = userResult.response.data;
          authCtx.saveUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          // 🔹 Navigate based on role
          switch (userData.role) {
            case "adm":
            case "sadm":
              navigate("/admin/dashboard");
              break;
            case "asm":
              navigate("/asm/dashboard");
              break;
            case "di":
              navigate("/di/dashboard");
              break;
            case "ret":
            case "dd":
              navigate("/customer/dashboard");
              break;
            default:
              navigate("/other/dashboard");
          }
        }
      } else if (status === "expired") {
        clearInterval(pollingRef.current);
        clearTimeout(timeoutRef.current);
        setPolling(false);
        setLoginError("QR expired, please refresh.");
      }
    } catch (err) {
      console.error("QR status check error:", err);
    }
  };

  const startPolling = (token) => {
    setPolling(true);

    pollingRef.current = setInterval(() => {
      checkQrStatus(token); // always use latest token
    }, 3000);
  };

  //   useEffect(() => {
  //     generateQrLogin();
  //     return () => {
  //       clearInterval(pollingRef.current);
  //       clearTimeout(timeoutRef.current);
  //     };
  //   }, []);

  // 🔹 Get Location
  useEffect(() => {
    getGeoLocation(
      (lat, long) => authCtx.setLocation(lat, long),
      (err) => okErrorToast("Location", err)
    );
  }, []);

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {/* Left Side */}
      <Grid
        item
        xs={false}
        md={7}
        sx={{
          backgroundImage: `url(${backImg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto 88%",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
          backgroundColor: "#0052CC",
          width: "55%",
        }}
      />

      {/* Right Side */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 4, sm: 3, md: 3 },
          height: "100vh",
          boxSizing: "border-box",
          width: { xs: "100%", md: "45%" },
        }}
      >
        {/* Logo */}
        <Box sx={{ width: "100%", maxWidth: 500 }}>
          <Box
            component="img"
            src={biggpayLogo}
            alt="Logo"
            sx={{
              width: "100%",
              maxWidth: 330,
              mb: 3,
              objectFit: "contain",
              cursor: "pointer",
              display: "block",
              mx: "auto",
            }}
            onClick={() => navigate("/login")}
          />
        </Box>

        {/* QR Box */}
        {loading ? (
          <CircularProgress />
        ) : qrToken ? (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="h6" color="textSecondary">
              Scan QR to Login
            </Typography>
            <Box sx={{ background: "#fff", p: 2, borderRadius: 2 }}>
              <QRCode value={qrToken} size={200} level="H" />
            </Box>

            {polling && (
              <Typography variant="body2" color="textSecondary">
                Waiting for approval...
              </Typography>
            )}

            {loginError && (
              <Typography variant="body2" color="error">
                {loginError}
              </Typography>
            )}

            {/* Refresh QR */}
            <Box sx={{ mt: 2 }}>
              <button
                onClick={generateQrLogin}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0052CC",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Refresh QR
              </button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography color="error">
              {loginError || "QR not generated"}
            </Typography>
            <button
              onClick={generateQrLogin}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#0052CC",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Generate QR
            </button>
          </Box>
        )}
      </Grid>

      {/* MPIN Modal */}
      <Modal
        open={isMpinRequired}
        onClose={() => setIsMpinRequired(false)}
        aria-labelledby="verification-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500, md: 600 },
            p: 4,
            borderRadius: 3,
          }}
        >
          <VerifyMpinLogin
            username={username}
            password={password}
            otpRef={otpRef}
            secureValidate={secureValidate}
            setIsOtpField={setIsMpinRequired}
            onVerificationSuccess={() => setIsMpinRequired(false)}
            btn="Verify & Login"
          />
        </Box>
      </Modal>
    </Grid>
  );
};

export default QrLoginPage;
