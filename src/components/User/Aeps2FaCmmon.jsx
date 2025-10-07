import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Alert,
  Grid,
  TextField,
  Chip,
  LinearProgress,
  CircularProgress,
  MenuItem,
  Select,
  Autocomplete,
} from "@mui/material";
import {
  Close as CloseIcon,
  ErrorOutline as ErrorOutlineIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  InfoOutlined as InfoOutlinedIcon,
  Search as SearchIcon,
  Fingerprint as FingerprintIcon,
  SettingsInputAntenna as SettingsInputAntennaIcon,
  Badge as BadgeIcon,
  Grade as GradeIcon,
  HighlightOff as HighlightOffIcon,
} from "@mui/icons-material";
import {
  CaptureFingerPrintAeps2,
  GetMFS100InfoLoad,
} from "../../utils/MantraCapture";

import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import { apiErrorToast } from "../../utils/ToastUtil";
import { Navigate, useNavigate } from "react-router-dom";

const Aeps2FaCommon = ({
  open,
  onClose,
  title = "Title",
  formData,
  setFormData,
  banks = [],
  buttons = [],
  fingerData,
  aadhaar,
  setAadhaar,
  onFingerSuccess,
  activeTab,
  bankStatement,
}) => {
  console.log("Th nak staen data is", bankStatement);
  const [rdDeviceList, setRdDeviceList] = useState([]);
  const [rdDevice, setRdDevice] = useState(null);
  const [status, setStatus] = useState("NOT READY");
  const [scanQuality, setScanQuality] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();
  const renderButtons = () => {
    return buttons.map((btn, index) => (
      <Button
        key={index}
        variant={btn.variant || "contained"}
        onClick={btn.onClick}
        disabled={btn.disabled}
        startIcon={btn.icon}
        sx={{
          background:
            btn.bgcolor || "linear-gradient(135deg, #2275b7 0%, #1d63a0 100%)",
          color: btn.color || "white",
          "&:hover": {
            background:
              btn.hoverColor ||
              "linear-gradient(135deg, #2275b7 0%, #1d63a0 100%)",
            boxShadow: "0 4px 10px rgba(34, 117, 183, 0.35)",
            transform: "translateY(-1px)",
          },
          borderRadius: "10px",
          px: 2,
          py: 0.8,
          textTransform: "none",
          fontWeight: "600",
          fontSize: "0.85rem",
          boxShadow: "0 2px 6px rgba(34, 117, 183, 0.35)",
          transition: "all 0.2s ease",
          minWidth: "auto",
        }}
      >
        {btn.label}
      </Button>
    ));
  };

  useEffect(() => {
    detectDevice();
  }, []);

  const detectDevice = () => {
    setLoading(true);
    setError("");
    setRdDeviceList([]);
    setRdDevice(null);
    setStatus("DETECTING...");

    GetMFS100InfoLoad(
      setLoading,
      (devices) => {
        setLoading(false);
        if (devices && devices.length > 0) {
          setRdDeviceList(devices);

          // Auto-select the first READY device if available
          const readyDevice = devices.find((d) => d.status === "READY");
          if (readyDevice) {
            setRdDevice(readyDevice);
            setStatus(readyDevice.status);
          } else {
            setStatus("NOT READY");
          }
        } else {
          setError("No fingerprint devices detected");
          setStatus("NOT READY");
        }
      },
      (error) => {
        setLoading(false);
        setError("Failed to detect devices: " + error);
        setStatus("NOT READY");
      }
    );
  };

  const startScan = () => {
    if (!rdDevice) {
      setError("Please select a device first");
      return;
    }

    if (!aadhaar || aadhaar.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setStatus("SCANNING...");

    CaptureFingerPrintAeps2(
      rdDevice.rdport,
      (qualityMessage, data) => {
        setLoading(false);
        setStatus("CONNECTED");
        setScanQuality(data.qScore);
        setSuccess(`Fingerprint captured successfully! ${qualityMessage}`);

        fingerData(data);
        if (onFingerSuccess) {
          onFingerSuccess(data);
        }
      },
      (error) => {
        setLoading(false);
        setStatus("ERROR");
        setError("Scan failed: " + error);
      }
    );
  };

  // Status color logic
  const getStatusColor = () => {
    if (status === "CONNECTED") return "#4caf50";
    if (status === "SCANNING...") return "#ff9800";
    if (status === "READY") return "#2196f3";
    if (status === "DETECTING...") return "#9d72f0";
    if (status === "ERROR") return "#f44336";
    return "#9e9e9e";
  };

  const statusPercentage = (status) => {
    switch (status) {
      case "DETECTING...":
        return 10;
      case "READY":
        return 50;
      case "SCANNING...":
        return 75;
      case "CONNECTED":
        return 100;
      case "ERROR":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <>
      <Box
        sx={{
          // minHeight: "100vh",
          width: "100%",
          fontFamily: '"DM Sans", sans-serif',
          background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
          p: { xs: 1, sm: 2 },
          display: "flex",
          // alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "900px", lg: "1000px" },
            // height: { xs: "auto", sm: "auto" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, sm: 3 },
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              flex: { xs: "0 0 auto", md: 0.4 },
              minHeight: { xs: "auto", md: "320px" },
              maxHeight: { xs: "280px", md: "350px" },
              width: "100%",
              bgcolor: "#f0f7ff",
              borderRadius: 3,
              p: { xs: 2, sm: 2.5 },
              boxShadow: "0 8px 32px rgba(34, 117, 183, 0.35)",
              border: "1px solid rgba(34, 117, 183, 0.35)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                //  .. background: "linear-gradient(90deg, #9d72f0, #7b4dff, #9d72f0)",
                backgroundSize: "200% 100%",
                animation:
                  status !== "NOT READY"
                    ? "shimmer 3s infinite linear"
                    : "none",
              },
              "@keyframes shimmer": {
                "0%": { backgroundPosition: "200% 0" },
                "100%": { backgroundPosition: "-200% 0" },
              },
            }}
          >
            {/* Compact Header */}
            <Box
              sx={{
                background:
                  "linear-gradient(135deg, #2275b7 100%, #f0f7ff 100%)",
                color: "white",
                p: 1,
                borderRadius: 2,
                mb: 2,
                textAlign: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  mb: 0.25,
                }}
              >
                DEVICE STATUS
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.9,
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FingerprintIcon sx={{ fontSize: "12px", mr: 0.5 }} />
                Biometric Verification
              </Typography>
            </Box>

            {/* Status Indicator - Compact */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Current Status */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: getStatusColor(),
                      mr: 1,
                      boxShadow: `0 0 0 ${
                        status !== "NOT READY" ? "3px" : "0"
                      } ${getStatusColor()}40`,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "700",
                      color: getStatusColor(),
                      fontSize: "0.8rem",
                    }}
                  >
                    {status}
                  </Typography>
                </Box>

                {/* Status Progress Bar */}
                <Box sx={{ position: "relative", mb: 1 }}>
                  <Box
                    sx={{
                      width: "100%",
                      height: 12,
                      bgcolor: "#f0f7ff",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${statusPercentage(status)}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${getStatusColor()}99, ${getStatusColor()})`,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </Box>

                  {/* Status Labels */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 0.5,
                      px: 0.5,
                    }}
                  >
                    {["NOT READY", "READY", "CONNECTED"].map((text, i) => (
                      <Typography
                        key={i}
                        variant="caption"
                        sx={{
                          color: status === text ? getStatusColor() : "#9e9e9e",
                          fontWeight: status === text ? "700" : "500",
                          fontSize: "0.6rem",
                        }}
                      >
                        {text}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Scan Quality (if available) */}
              {scanQuality && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 2,
                    p: 1,
                    bgcolor: "rgba(34, 117, 183, 0.35)",
                    borderRadius: 1,
                    border: "1px solid rgba(34, 117, 183, 0.35)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "#2275b7", fontWeight: "600", mb: 0.5 }}
                  >
                    Scan Quality
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={parseInt(scanQuality) || 0}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      width: "100%",
                      mb: 0.5,
                      bgcolor: "rgba(34, 117, 183, 0.35)",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #2275b7, #1d63a0)",
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Chip
                    label={`${scanQuality}%`}
                    sx={{
                      bgcolor: "rgba(34, 117, 183, 0.35)",
                      color: "#2275b7",
                      fontWeight: "600",
                      height: 20,
                      fontSize: "0.7rem",
                    }}
                    size="small"
                    icon={
                      <GradeIcon sx={{ fontSize: "12px", color: "#ffc107" }} />
                    }
                  />
                </Box>
              )}

              {/* Device Connection Status */}
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: rdDevice ? "#4caf50" : "#9e9e9e",
                      mr: 0.5,
                      position: "relative",
                      "&::after": rdDevice
                        ? {
                            content: '""',
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            bgcolor: "#fff",
                          }
                        : {},
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "#2275b7", fontWeight: "500" }}
                  >
                    Device: {rdDevice ? "Connected" : "Not Connected"}
                  </Typography>
                </Box>

                {/* Quick Actions */}
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ justifyContent: "center", mt: 1 }}
                >
                  <Button
                    variant="outlined"
                    onClick={detectDevice}
                    disabled={loading}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      px: 1,
                      py: 0.25,
                      textTransform: "none",
                      fontWeight: "600",
                      color: "#2275b7",
                      borderColor: "#1d63a0",
                      fontSize: "0.7rem",
                      minWidth: "auto",
                    }}
                  >
                    Detect
                  </Button>
                  <Button
                    variant="contained"
                    onClick={startScan}
                    disabled={!rdDevice || loading}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      px: 1,
                      py: 0.25,
                      textTransform: "none",
                      fontWeight: "600",
                      background:
                        "linear-gradient(135deg, #2275b7 0%, #1d63a0 100%)",
                      fontSize: "0.7rem",
                      minWidth: "auto",
                    }}
                  >
                    Scan
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>

          {/* Right Panel - Authentication Form */}
          <Box
            sx={{
              flex: { xs: "0 0 auto", md: 0.6 },
              minHeight: { xs: "auto", md: "320px" },
              bgcolor: "#f0f7ff",
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
              boxShadow: "0 8px 32px rgba(34, 117, 183, 0.35)",
              border: "1px solid rgba(34, 117, 183, 0.35)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                color: "#2275b7",
                fontWeight: "600",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                display: "flex",
                alignItems: "center",
              }}
            >
              <BadgeIcon sx={{ fontSize: "18px", mr: 1 }} />
              Authentication Details
            </Typography>

            <Stack spacing={2} sx={{ flex: 1 }}>
              <TextField
                label="Aadhaar Number"
                value={aadhaar}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val?.length <= 12) setAadhaar(val);
                }}
                size="small"
                fullWidth
                error={aadhaar?.length > 0 && aadhaar?.length !== 12}
                helperText={
                  aadhaar?.length > 0 && aadhaar?.length !== 12
                    ? "Aadhaar must be 12 digits"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    fontSize: "0.9rem",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "0.7rem",
                  },
                }}
                inputProps={{ maxLength: 12 }}
              />
              <Autocomplete
                options={banks} // array of bank objects
                getOptionLabel={(option) =>
                  `${option.bank_name} (${option.bank_iin})`
                }
                value={
                  banks.find((b) => b.bank_iin === formData?.bank_iin) || null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    setFormData((prev) => ({
                      ...prev,
                      bank: newValue.bank_name,
                      bank_iin: newValue.bank_iin,
                    }));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Bank"
                    size="small"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        fontSize: "0.9rem",
                      },
                    }}
                  />
                )}
              />

              <TextField
                label="Mobile Number"
                value={formData?.mobile}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                }
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    fontSize: "0.9rem",
                  },
                }}
              />

              {formData?.activeTab === 0 && (
                <TextField
                  label="Amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      fontSize: "0.9rem",
                    },
                  }}
                />
              )}

              <Box>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  label="Select RD Device"
                  value={rdDevice ? rdDevice.info : ""}
                  onChange={(e) => {
                    const selectedDevice = rdDeviceList.find(
                      (d) => d.info === e.target.value
                    );
                    setRdDevice(selectedDevice);
                    setStatus(
                      selectedDevice ? selectedDevice.status : "NOT READY"
                    );
                  }}
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      fontSize: "0.9rem",
                    },
                  }}
                >
                  <option value="">-- Select Device --</option>
                  {rdDeviceList.map((d, i) => (
                    <option key={i} value={d.info}>
                      {d.info} ({d.status})
                    </option>
                  ))}
                </TextField>
                <Typography
                  variant="caption"
                  sx={{ color: "#9e9e9e", mt: 0.5, display: "block" }}
                >
                  {rdDeviceList.length} device(s) detected
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={startScan}
                disabled={
                  !rdDevice || !aadhaar || aadhaar.length !== 12 || loading
                }
                startIcon={<FingerprintIcon sx={{ fontSize: "16px" }} />}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  textTransform: "none",
                  fontWeight: "600",
                  background:
                    "linear-gradient(135deg, #2275B7 0%, #2272B3 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2275B7 0%, #2272B3 100%)",
                  },
                  mt: "auto",
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={16}
                    sx={{ color: "white", mr: 0.5 }}
                  />
                ) : (
                  "Start Biometric Authentication"
                )}
              </Button>
              {activeTab === 2 && bankStatement?.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() =>
                    navigate("/bank-statement", { state: { bankStatement } })
                  }
                >
                  View Full Statement
                </Button>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 2,
          p: 1,
          bgcolor: "rgba(34, 117, 183, 0.15)",
          borderRadius: 1,
          border: "1px solid rgba(34, 117, 183, 0.35)",
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: "16px", mr: 1, color: "#2275B7" }} />
        <Typography
          variant="caption"
          sx={{
            color: "#2275b7",
            fontSize: "0.75rem",
          }}
        >
          Connect scanner. Status turns{" "}
          <span style={{ color: "#4caf50", fontWeight: "bold" }}>green</span>{" "}
          when connected,{" "}
          <span style={{ color: "#f44336", fontWeight: "bold" }}>red</span> when
          not.
        </Typography>
      </Box>
    </>
  );
};

export default Aeps2FaCommon;
