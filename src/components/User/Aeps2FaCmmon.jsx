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

  const handleBankChange = (e) => {
    const selectedIIN = e.target.value; // IIN aa gaya
    const selectedBank = banks.find((b) => b.iin === selectedIIN);

    setFormData((prev) => ({
      ...prev,
      bank_iin: selectedBank?.iin || "",
      bank_name: selectedBank?.bank_name || selectedBank?.name || "",
    }));
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    fontFamily: '"DM Sans", sans-serif',
    p: 2,
    boxSizing: "border-box",
  }}
>
  <Box
    sx={{
      width: "100%",
      maxWidth: "lg",
      p: { xs: 2, sm: 3 },
      borderRadius: 3,
      background: "linear-gradient(135deg, #ffffff 0%, #f8f5ff 100%)",
      boxShadow:
        "0 15px 35px rgba(157, 114, 240, 0.2), 0 0 0 1px rgba(157, 114, 240, 0.1)",
      border: "1px solid rgba(157, 114, 240, 0.15)",
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
        mx: { xs: -2, sm: -3 },
        mt: { xs: -2, sm: -3 },
        mb: 3,
        position: "relative",
      }}
    >
      <Box sx={{}}>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: { xs: "1.1rem", sm: "1.3rem" },
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
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <FingerprintIcon sx={{ fontSize: "18px", mr: 0.5 }} />
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
      flexWrap="wrap"
      sx={{ mb: 2 }}
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
          fontSize: "0.85rem",
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
          fontSize: "0.85rem",
        }}
        icon={<CheckCircleOutlineIcon fontSize="small" />}
      >
        {success}
      </Alert>
    )}

    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: "center",
        alignItems: "stretch",
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            bgcolor: "#faf8ff",
            borderRadius: 2,
            p: 2,
            boxShadow: "0 4px 16px rgba(157, 114, 240, 0.12)",
            border: "1px solid rgba(157, 114, 240, 0.12)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
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
              mb: 1.5,
              color: "#5a4b81",
              fontWeight: "600",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SettingsInputAntennaIcon sx={{ fontSize: "20px", mr: 1 }} />
            Device Status
          </Typography>

          {/* Status Indicator */}
          <Box sx={{ position: "relative", mb: 2 }}>
            <Box
              sx={{
                width: "100%",
                height: 20,
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
                mt: 1,
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
                    fontSize: "0.7rem",
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
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: getStatusColor(),
                mr: 1,
                boxShadow: `0 0 0 ${
                  status !== "NOT READY" ? "4px" : "0"
                } ${getStatusColor()}40`,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: "700",
                color: getStatusColor(),
                fontSize: "0.9rem",
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
                mt: 2,
                p: 1.5,
                bgcolor: "rgba(157, 114, 240, 0.05)",
                borderRadius: 1,
                border: "1px solid rgba(157, 114, 240, 0.1)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#5a4b81",
                  fontWeight: "600",
                  mb: 1,
                }}
              >
                Scan Quality
              </Typography>
              <LinearProgress
                variant="determinate"
                value={parseInt(scanQuality) || 0}
                sx={{
                  height: 8,
                  borderRadius: 3,
                  width: "100%",
                  mb: 1,
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
                  height: 24,
                  fontSize: "0.8rem",
                }}
                size="small"
                icon={
                  <GradeIcon
                    sx={{ fontSize: "16px!important", color: "#ffc107" }}
                  />
                }
              />
            </Box>
          )}

          {/* Device Connection Visualization */}
          <Box sx={{ mt: 2.5, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: rdDevice ? "#4caf50" : "#9e9e9e",
                  mr: 1,
                  position: "relative",
                  "&::after": rdDevice
                    ? {
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 7,
                        height: 7,
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
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            bgcolor: "#faf8ff",
            borderRadius: 2,
            p: 2,
            boxShadow: "0 4px 16px rgba(157, 114, 240, 0.12)",
            border: "1px solid rgba(157, 114, 240, 0.12)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              color: "#5a4b81",
              fontWeight: "600",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <BadgeIcon sx={{ fontSize: "20px", mr: 1 }} />
            Authentication Details
          </Typography>

          <Stack spacing={2} sx={{ flex: 1 }}>
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
                    fontSize: "0.95rem",
                  },
                  "& .MuiFormLabel-root": {
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.95rem",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "0.75rem",
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
            <TextField
              select
              label="Select Bank"
              value={formData?.bank_iin || ""}
              onChange={(e) => {
                const selectedIIN = e.target.value;
                const selectedBank = banks.find(
                  (b) => b.bank_iin === selectedIIN
                );

                if (selectedBank) {
                  setFormData((prev) => ({
                    ...prev,
                    bank: selectedBank.bank_name,
                    bank_iin: selectedBank.bank_iin,
                  }));
                }
              }}
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "0.95rem",
                },
                "& .MuiFormLabel-root": {
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "0.95rem",
                },
              }}
            >
              {banks.map((bank) => (
                <MenuItem key={bank.bank_iin} value={bank.bank_iin}>
                  {bank.bank_name} ({bank.bank_iin})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Mobile"
              value={formData?.mobile}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mobile: e.target.value }))
              }
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "0.95rem",
                },
                "& .MuiFormLabel-root": {
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "0.95rem",
                },
              }}
            />
            {/* Amount only for Cash Withdrawal */}
            {formData?.activeTab === 0 && (
              <TextField
                label="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.95rem",
                  },
                  "& .MuiFormLabel-root": {
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.95rem",
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
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.95rem",
                  },
                  "& .MuiFormLabel-root": {
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.95rem",
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
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={detectDevice}
                disabled={loading}
                startIcon={<SearchIcon sx={{ fontSize: "18px" }} />}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  textTransform: "none",
                  fontWeight: "600",
                  color: "#9d72f0",
                  borderColor: "#9d72f0",
                  "&:hover": {
                    borderColor: "#8c61e6",
                    bgcolor: "#f5f2ff",
                  },
                  flex: 1,
                  fontSize: "0.85rem",
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
                  py: 1,
                  textTransform: "none",
                  fontWeight: "600",
                  background:
                    "linear-gradient(135deg, #9d72f0 0%, #7b4dff 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #8c61e6 0%, #6b3dff 100%)",
                    boxShadow: "0 4px 12px rgba(157, 114, 240, 0.4)",
                  },
                  flex: 2,
                  boxShadow: "0 3px 8px rgba(157, 114, 240, 0.3)",
                  fontSize: "0.85rem",
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
        mt: 3,
        p: 1.5,
        bgcolor: "rgba(157, 114, 240, 0.05)",
        borderRadius: 1,
        border: "1px solid rgba(157, 114, 240, 0.1)",
      }}
    >
      <InfoOutlinedIcon
        sx={{ fontSize: "18px", mr: 1, color: "#9d72f0" }}
      />
      <Typography
        variant="caption"
        sx={{
          color: "#5a4b81",
          fontFamily: '"DM Sans", sans-serif',
          fontSize: "0.8rem",
        }}
      >
        Connect scanner. Status turns{" "}
        <span style={{ color: "#4caf50", fontWeight: "bold" }}>green</span>{" "}
        when connected,{" "}
        <span style={{ color: "#f44336", fontWeight: "bold" }}>red</span>{" "}
        when not.
      </Typography>
    </Box>
  </Box>
</Box>
  );
};

export default Aeps2FaCommon;
