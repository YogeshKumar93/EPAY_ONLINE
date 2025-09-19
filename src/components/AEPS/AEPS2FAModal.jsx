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

const AEPS2FAModal = ({
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
}) => {

  const [rdDeviceList, setRdDeviceList] = useState([]);
  const [rdDevice, setRdDevice] = useState(null);
  const [status, setStatus] = useState("NOT READY");
  const [scanQuality, setScanQuality] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useToast();

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
            btn.bgcolor || "linear-gradient(135deg, #9d72f0 0%, #7b4dff 100%)",
          color: btn.color || "white",
          "&:hover": {
            background:
              btn.hoverColor ||
              "linear-gradient(135deg, #8c61e6 0%, #6b3dff 100%)",
            boxShadow: "0 4px 10px rgba(157, 114, 240, 0.35)",
            transform: "translateY(-1px)",
          },
          borderRadius: "10px",
          px: 2,
          py: 0.8,
          textTransform: "none",
          fontWeight: "600",
          fontSize: "0.85rem",
          boxShadow: "0 2px 6px rgba(157, 114, 240, 0.25)",
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
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        fontFamily: '"DM Sans", sans-serif',
        width: "100%",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f5ff 100%)",
        boxShadow:
          "0 10px 25px rgba(157, 114, 240, 0.15), 0 0 0 1px rgba(157, 114, 240, 0.05)",
        border: "1px solid rgba(157, 114, 240, 0.1)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #9d72f0, #7b4dff, #9d72f0)",
          backgroundSize: "200% 100%",
          animation:
            status !== "NOT READY" ? "shimmer 3s infinite linear" : "none",
        },
        "@keyframes shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      }}
    >
      {/* Header with gradient */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #9d72f0 0%, #7b4dff 100%)",
          color: "white",
          p: 2,
          borderRadius: "12px 12px 0 0",
          mx: -2,
          mt: -2,
          mb: 2,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "white",
            opacity: 0.8,
            transition: "all 0.2s",
            "&:hover": {
              opacity: 1,
              background: "rgba(255,255,255,0.15)",
            },
            p: 0.5,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: "1.1rem",
              mb: 0.5,
            }}
          >
            {title} 2FA
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              opacity: 0.9,
              fontWeight: "500",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FingerprintIcon sx={{ fontSize: "16px", mr: 0.5 }} />
            Secure biometric verification
          </Typography>
        </Box>
      </Box>

      {/* Buttons at top */}
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 2 }}
        flexWrap="wrap"
      >
        {renderButtons()}
      </Stack>

      {/* Error/Success Alerts */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 1,
            fontFamily: '"DM Sans", sans-serif',
            alignItems: "center",
            py: 0.5,
            fontSize: "0.8rem",
          }}
          icon={<ErrorOutlineIcon fontSize="small" />}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: 1,
            fontFamily: '"DM Sans", sans-serif',
            alignItems: "center",
            py: 0.5,
            fontSize: "0.8rem",
          }}
          icon={<CheckCircleOutlineIcon fontSize="small" />}
        >
          {success}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Left Side Status Panel */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 240,
              bgcolor: "#faf8ff",
              borderRadius: 2,
              p: 1.5,
              boxShadow: "0 4px 12px rgba(157, 114, 240, 0.08)",
              border: "1px solid rgba(157, 114, 240, 0.08)",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: getStatusColor(),
                opacity: 0.3,
              }}
            />

            <Typography
              variant="subtitle2"
              sx={{
                textAlign: "center",
                mb: 1,
                color: "#5a4b81",
                fontWeight: "600",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SettingsInputAntennaIcon sx={{ fontSize: "18px", mr: 0.5 }} />
              Device Status
            </Typography>

            {/* Status Indicator */}
            <Box sx={{ position: "relative", mb: 1.5 }}>
              <Box
                sx={{
                  width: "100%",
                  height: 18,
                  bgcolor: "#eef2ff",
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "relative",
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

              {/* Status Indicators */}
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
                  mr: 0.5,
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

            {scanQuality && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 1,
                  p: 1,
                  bgcolor: "rgba(157, 114, 240, 0.05)",
                  borderRadius: 1,
                  border: "1px solid rgba(157, 114, 240, 0.08)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#5a4b81",
                    fontWeight: "600",
                    mb: 0.5,
                  }}
                >
                  Scan Quality
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={parseInt(scanQuality) || 0}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    width: "100%",
                    mb: 0.5,
                    bgcolor: "rgba(157, 114, 240, 0.2)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #9d72f0, #7b4dff)",
                      borderRadius: 3,
                    },
                  }}
                />
                <Chip
                  label={`${scanQuality}%`}
                  sx={{
                    bgcolor: "rgba(157, 114, 240, 0.1)",
                    color: "#5a4b81",
                    fontWeight: "600",
                    height: 20,
                    fontSize: "0.7rem",
                  }}
                  size="small"
                  icon={
                    <GradeIcon
                      sx={{ fontSize: "14px!important", color: "#ffc107" }}
                    />
                  }
                />
              </Box>
            )}

            {/* Device Connection Visualization */}
            <Box sx={{ mt: 1.5, textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
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
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#fff",
                        }
                      : {},
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "#5a4b81", fontWeight: "500" }}
                >
                  {rdDevice ? "Connected" : "Not Connected"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Side Form */}
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              bgcolor: "#faf8ff",
              borderRadius: 2,
              p: 1.5,
              boxShadow: "0 4px 12px rgba(157, 114, 240, 0.08)",
              border: "1px solid rgba(157, 114, 240, 0.08)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                color: "#5a4b81",
                fontWeight: "600",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <BadgeIcon sx={{ fontSize: "18px", mr: 1 }} />
              Authentication Details
            </Typography>

            <Stack spacing={1.5} sx={{ flex: 1 }}>
              <Box>
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
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: "0.9rem",
                    },
                    "& .MuiFormLabel-root": {
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: "0.9rem",
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "0.7rem",
                      mx: 0,
                      mt: 0.5,
                    },
                  }}
                  inputProps={{
                    maxLength: 12,
                    style: { fontFamily: '"DM Sans", sans-serif' },
                  }}
                />
              </Box>

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
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: "0.9rem",
                    },
                    "& .MuiFormLabel-root": {
                      fontFamily: '"DM Sans", sans-serif',
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

              <TextField
                label="Device Info"
                value={rdDevice ? rdDevice.info : "No device selected"}
                size="small"
                InputProps={{
                  readOnly: true,
                  startAdornment: rdDevice ? (
                    <CheckCircleOutlineIcon
                      sx={{ color: "#4caf50", mr: 1, fontSize: "18px" }}
                    />
                  ) : (
                    <HighlightOffIcon
                      sx={{ color: "#f44336", mr: 1, fontSize: "18px" }}
                    />
                  ),
                }}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    fontFamily: '"DM Sans", sans-serif',
                    bgcolor: "#f5f2ff",
                    fontSize: "0.9rem",
                  },
                }}
              />

              <TextField
                select
                label="Select Bank"
                value={formData.bank}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bank: e.target.value }))
                }
                fullWidth
                size="small"
              >
                {banks.map((b, i) => (
                  <MenuItem key={i} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Mobile"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                }
                fullWidth
                size="small"
              />
              {/* Amount only for Cash Withdrawal */}
              {formData.activeTab === 0 && (
                <TextField
                  label="Amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  fullWidth
                  size="small"
                />
              )}
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={detectDevice}
                  disabled={loading}
                  startIcon={<SearchIcon sx={{ fontSize: "18px" }} />}
                  sx={{
                    borderRadius: 1,
                    py: 0.8,
                    textTransform: "none",
                    fontWeight: "600",
                    color: "#9d72f0",
                    borderColor: "#9d72f0",
                    "&:hover": {
                      borderColor: "#8c61e6",
                      bgcolor: "#f5f2ff",
                    },
                    flex: 1,
                    fontSize: "0.8rem",
                  }}
                >
                  Detect
                </Button>
                <Button
                  variant="contained"
                  onClick={startScan}
                  disabled={
                    !rdDevice || !aadhaar || aadhaar.length !== 12 || loading
                  }
                  startIcon={<FingerprintIcon sx={{ fontSize: "18px" }} />}
                  sx={{
                    borderRadius: 1,
                    py: 0.8,
                    textTransform: "none",
                    fontWeight: "600",
                    background:
                      "linear-gradient(135deg, #9d72f0 0%, #7b4dff 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #8c61e6 0%, #6b3dff 100%)",
                      boxShadow: "0 4px 10px rgba(157, 114, 240, 0.3)",
                    },
                    flex: 2,
                    boxShadow: "0 2px 6px rgba(157, 114, 240, 0.25)",
                    fontSize: "0.8rem",
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={16}
                      sx={{ color: "white", mr: 0.5 }}
                    />
                  ) : (
                    "Start Scan"
                  )}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Note at bottom */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 2,
          p: 1,
          bgcolor: "rgba(157, 114, 240, 0.03)",
          borderRadius: 1,
          border: "1px solid rgba(157, 114, 240, 0.08)",
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: "16px", mr: 1, color: "#9d72f0" }} />
        <Typography
          variant="caption"
          sx={{
            color: "#5a4b81",
            fontFamily: '"DM Sans", sans-serif',
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
    </Box>
  );
};

export default AEPS2FAModal;
