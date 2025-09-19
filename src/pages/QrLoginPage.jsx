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
  FiberManualRecord,
  InfoOutlined,
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
          if (authCtx.location) {
            localStorage.setItem("location", JSON.stringify(authCtx.location));
          }
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
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);
  useEffect(() => {
    console.log("🔄 Fetching location...");

    const fetchLocation = getGeoLocation(
      (lat, long) => {
        console.log("✅ Got location:", lat, long);
        authCtx.setLocation(lat, long);
      },
      (err) => console.error(" Location error:", err)
    );

    fetchLocation();
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
          background: "linear-gradient(135deg, #f8f9ff 0%, #f0f3ff 100%)",
          overflow: "hidden",
          position: "relative",
          py: { xs: 3, md: 0 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Animated background elements
    // <Box
    //   sx={{
    //     position: "absolute",
    //     top: "-10%",
    //     right: "-5%",
    //     width: "300px",
    //     height: "300px",
    //     borderRadius: "50%",
    //     // background: "linear-gradient(135deg, rgba(133, 79, 255, 0.1) 0%, rgba(133, 79, 255, 0.05) 100%)",
    //     zIndex: 0,
    //   }}
    // />
    // <Box
    //   sx={{
    //     position: "absolute",
    //     bottom: "-10%",
    //     left: "-5%",
    //     width: "250px",
    //     height: "250px",
    //     borderRadius: "50%",
    //     // background: "linear-gradient(135deg, rgba(133, 79, 255, 0.1) 0%, rgba(133, 79, 255, 0.05) 100%)",
    //     zIndex: 0,
    //   }}
    // /> */}

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
          {/* Main Content Card - Modern Design */}
          <Box
            sx={{
              width: { xs: "100%", sm: "90%", md: "85%", lg: "75%" },
              maxWidth: "1000px",
              background: "#fff",
              borderRadius: { xs: "16px", md: "20px" },
              // boxShadow: "0 20px 40px rgba(133, 79, 255, 0.15), 0 8px 20px rgba(133, 79, 255, 0.08)",
              p: { xs: 3, sm: 4, md: 4.5 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 3, md: 5 },
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "6px",
                background: "linear-gradient(90deg, #854fff 0%, #6a31ff 100%)",
                borderRadius: "10px 10px 0 0",
              },
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
                p: { xs: 0, md: 2 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "22px", sm: "24px", md: "26px" },
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #854fff 0%, #6a31ff 100%)",
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
                  mb: { xs: 2.5, md: 3 },
                  textAlign: "center",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  maxWidth: "300px",
                }}
              >
                Scan this QR with your{" "}
                <strong style={{ color: "#854fff" }}>IMPS GURU</strong> app to
                login instantly
              </Typography>

              <Box
                sx={{
                  background: "#fff",
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(133, 79, 255, 0.15)",
                  border: "1px solid rgba(133, 79, 255, 0.12)",
                  position: "relative",
                  width: "fit-content",
                  mb: 2,
                }}
              >
                <QRCode
                  value={qrToken}
                  size={180}
                  level="H"
                  includeMargin
                  imageSettings={{
                    src: biggpayLogo,
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
              </Box>

              {/* Animated scanning indicator */}
              <Box
                sx={{
                  width: "200px",
                  height: "4px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(133, 79, 255, 0.5), transparent)",
                  borderRadius: "4px",
                  animation: "scan 2s infinite linear",
                  mt: 1,
                  "@keyframes scan": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                  },
                }}
              />

              {/* Status indicator */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  color: "#854fff",
                }}
              >
                <FiberManualRecord sx={{ fontSize: "12px", mr: 1 }} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  Waiting for scan...
                </Typography>
              </Box>
            </Box>

            {/* Vertical Divider - Only on medium screens and up */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                width: "1px",
                height: "260px",
                background:
                  "linear-gradient(to bottom, transparent, rgba(133, 79, 255, 0.2), transparent)",
                mx: 1,
              }}
            />

            {/* Right: Instructions */}
            <Box
              sx={{
                flex: { md: 1.2 },
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                width: { xs: "100%", md: "auto" },
                p: { xs: 0, md: 1 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "18px", sm: "20px" },
                  fontWeight: 600,
                  color: "#333",
                  mb: { xs: 1, md: 1.5 },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <InfoOutlined sx={{ color: "#854fff", fontSize: "22px" }} />
                How to login:
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
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
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    {/* Circle + Vertical Line */}
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mr: 2.5,
                        mt: 0.2,
                      }}
                    >
                      {/* Circle */}
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #854fff 0%, #6a31ff 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: 13,
                          fontWeight: "bold",
                          zIndex: 1,
                          boxShadow: "0 4px 8px rgba(133, 79, 255, 0.3)",
                        }}
                      >
                        {index + 1}
                      </Box>

                      {/* Line (connector) - only show between steps */}
                      {index < arr.length - 1 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "30px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "2px",
                            height: "38px",
                            background: "rgba(133, 79, 255, 0.2)",
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
                        fontSize: { xs: "0.95rem", sm: "1.05rem" },
                        pt: 0.3,
                        color: "#444",
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
                  mt: 3,
                  pt: 2.5,
                  borderTop: "1px solid rgba(133, 79, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  background: "rgba(133, 79, 255, 0.03)",
                  p: 1.5,
                  borderRadius: "8px",
                }}
              >
                <Lock
                  sx={{
                    fontSize: "1.1rem",
                    color: "#854fff",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.85rem",
                    color: "#666",
                    fontWeight: 500,
                  }}
                >
                  Your login is encrypted and secure. We never share your data
                  with third parties.
                </Typography>
              </Box>

              {/* Alternative login option */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "#854fff",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    "&:hover": {
                      background: "rgba(133, 79, 255, 0.05)",
                    },
                  }}
                >
                  Use password login instead
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default QrLoginPage;
