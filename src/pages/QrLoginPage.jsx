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
  const [qrExpired, setQrExpired] = useState(false); // ✅ QR timeout status

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const pollingRef = useRef(null);
  const timeoutRef = useRef(null);

  // 🔹 Generate QR
  const generateQrLogin = async () => {
    try {
      setLoading(true);
      setLoginError("");
      setPolling(false);
      setQrExpired(false); // Reset expired state

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
        setQrToken(token);
        startPolling(token, 2 * 60 * 1000); // 2 minutes
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
        stopPolling();
        setQrToken("");
        const authToken = response?.data;
        authCtx.login(authToken);

        const userResult = await apiCall("GET", ApiEndpoints.GET_ME_USER);
        if (userResult.response) {
          const userData = userResult.response.data;
          authCtx.saveUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

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
        stopPolling();

        setQrExpired(true);
        setLoginError("QR expired, please refresh.");
      }
    } catch (err) {
      console.error("QR status check error:", err);
    }
  };

  const startPolling = (token, timeout = 1 * 60 * 1000) => {
    setPolling(true);

    pollingRef.current = setInterval(() => {
      checkQrStatus(token);
    }, 3000);

    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setQrToken("");
      setQrExpired(true);
      setLoginError("QR not approved in 2 minutes. Please refresh.");
    }, timeout);
  };

  const stopPolling = () => {
    setPolling(false);
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      generateQrLogin(); // 🔹 Auto-generate QR on page load

      getGeoLocation(
        (lat, long) => authCtx.setLocation(lat, long),
        (err) => okErrorToast("Location", err)
      );
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  return (
    <>
      {/* Logo Top Left */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 16, sm: 20, md: 24 },
          left: { xs: 16, sm: 20, md: 24 },
          zIndex: 10,
        }}
      >
        <Box
          component="img"
          src={biggpayLogo}
          alt="Logo"
          sx={{
            width: { xs: "70px", sm: "80px", md: "90px" },
            objectFit: "contain",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
          onClick={() => navigate("/login")}
        />
      </Box>

      {/* Fullscreen container */}
      <Grid
        container
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f4f7fb 0%, #e9f0fa 100%)",
          overflow: "hidden",
          position: "relative",
          py: { xs: 3, md: 0 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            width: "100%",
          }}
        >
          {/* Main Content Card - More Compact */}
          <Box
            sx={{
              width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
              maxWidth: "950px",
              background: "#fff",
              borderRadius: { xs: "12px", md: "16px" },
              boxShadow:
                "0 12px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
              p: { xs: 2.5, sm: 3.5, md: 4 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 3, md: 4 },
            }}
          >
            {/* Left: QR Box */}
            <Box
              sx={{
                flex: { md: 1 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "100%", md: "auto" },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "20px", sm: "22px", md: "24px" },
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #0052CC 0%, #3385ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: { xs: 1.5, md: 2 },
                  textAlign: "center",
                }}
              >
                Secure QR Login
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: { xs: 2, md: 2.5 },
                  textAlign: "center",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                Scan this QR with your <strong>IMPS GURU</strong> app to login
                instantly
              </Typography>

              <Box
                sx={{
                  background: "#fff",
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: "12px",
                  boxShadow: "0 6px 20px rgba(0,82,204,0.08)",
                  border: "1px solid rgba(0, 82, 204, 0.1)",
                  position: "relative",
                  width: "fit-content",
                }}
              >
                <QRCode
                  value={qrToken}
                  size={160}
                  level="H"
                  includeMargin
                  imageSettings={{
                    src: biggpayLogo,
                    height: 34,
                    width: 34,
                    excavate: true,
                  }}
                />
              </Box>
            </Box>

            {/* Vertical Divider - Only on medium screens and up */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                width: "1px",
                height: "220px",
                background:
                  "linear-gradient(to bottom, transparent, rgba(0,0,0,0.1), transparent)",
                mx: 1,
              }}
            />

            {/* Right: Instructions */}
            <Box
              sx={{
                flex: { md: 1 },
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: { xs: "100%", md: "auto" },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "16px", sm: "18px" },
                  fontWeight: 600,
                  color: "text.primary",
                  mb: { xs: 0.5, md: 1 },
                }}
              >
                How to login:
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  position: "relative",
                  pl: 0.5,
                }}
              >
                {[
                  "Open the IMPS GURU app on your phone",
                  "Tap on 'Scan QR' in the app side menu",
                  "Point your camera at this QR code",
                  "Confirm login on your device",
                ].map((step, index, arr) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      position: "relative",
                    }}
                  >
                    {/* Circle + Vertical Line */}
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mr: 2,
                        mt: 0.2,
                      }}
                    >
                      {/* Circle */}
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #0052CC 0%, #3385ff 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: 12,
                          fontWeight: "bold",
                          zIndex: 1,
                          boxShadow: "0 3px 6px rgba(0, 82, 204, 0.2)",
                        }}
                      >
                        {index + 1}
                      </Box>

                      {/* Line (connector) - only show between steps */}
                      {index < arr.length - 1 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "26px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "2px",
                            height: "32px",
                            background: "rgba(0,82,204,0.2)",
                            zIndex: 0,
                          }}
                        />
                      )}
                    </Box>

                    {/* Step Text */}
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.5,
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        pt: 0.2,
                      }}
                    >
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Security Note */}
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Lock
                  sx={{
                    fontSize: "1rem",
                    color: "text.secondary",
                    opacity: 0.7,
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.8rem" }}
                >
                  Your login is encrypted and secure
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default QrLoginPage;
