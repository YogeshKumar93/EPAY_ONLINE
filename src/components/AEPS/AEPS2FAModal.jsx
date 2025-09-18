/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Import the Mantra SDK functions
import { 
  CaptureFingerPrintAeps2, 
  GetMFS100InfoLoad 
} from "../../utils/MantraCapture";

const AEPS2FAModal = ({ open, onClose }) => {
  const [aadhaar, setAadhaar] = useState("");
  const [rdDeviceList, setRdDeviceList] = useState([]);
  const [rdDevice, setRdDevice] = useState(null);
  const [status, setStatus] = useState("NOT READY");
  const [scanQuality, setScanQuality] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Detect devices when modal opens
  useEffect(() => {
    if (open) {
      detectDevice();
    }
  }, [open]);

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
          const readyDevice = devices.find(d => d.status === "READY");
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
        
        // Here you would typically send the captured data to your backend
        console.log("Fingerprint data:", data);
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
    if (status === "CONNECTED") return "green";
    if (status === "SCANNING...") return "orange";
    if (status === "READY") return "blue";
    if (status === "DETECTING...") return "purple";
    if (status === "ERROR") return "red";
    return "gray";
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95vw", sm: "70vw", md: "60vw" },
    maxWidth: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 3,
    p: 3,
    maxHeight: "90vh",
    overflow: "auto",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Close Icon */}
        <CloseIcon
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            cursor: "pointer",
            color: "gray",
            fontSize: 32,
          }}
        />

        <Typography
          variant="h6"
          sx={{
            mb: 3,
            textAlign: "center",
            fontWeight: "bold",
            color: "#1CA895",
          }}
        >
          AEPS 2 Factor Authentication
        </Typography>

        {/* Buttons at top */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1CA895",
              "&:hover": { bgcolor: "#138f79" },
              borderRadius: "12px",
              px: 4,
              py: 2,
              textTransform: "none",
            }}
          >
            AEPS1
          </Button>

          <Button
            variant="outlined"
            sx={{
              borderColor: "#1CA895",
              color: "#1CA895",
              "&:hover": { borderColor: "#138f79", color: "#138f79" },
              borderRadius: "12px",
              px: 4,
              py: 2,
              textTransform: "none",
            }}
          >
            AEPS2
          </Button>
        </Stack>

        {/* Error/Success Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left Side Status Bar */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                width: 60,
                height: 200,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                position: "relative",
              }}
            >
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
              <Box
                sx={{
                  width: 20,
                  height: 80,
                  bgcolor: getStatusColor(),
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.5 : 1,
                }}
              />
              <Typography
                variant="body2"
                sx={{ mt: 1, fontWeight: "bold", color: getStatusColor() }}
              >
                {status}
              </Typography>
            </Box>
          </Grid>

          {/* Right Side Form */}
          <Grid item xs={12} sm={6}>
            <Stack spacing={2}>
              <TextField
                label="Aadhaar Number"
                value={aadhaar}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 12) setAadhaar(val);
                }}
                size="small"
                fullWidth
                error={aadhaar.length > 0 && aadhaar.length !== 12}
                helperText={
                  aadhaar.length > 0 && aadhaar.length !== 12
                    ? "Aadhaar must be 12 digits"
                    : ""
                }
              />

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
                  setStatus(selectedDevice ? selectedDevice.status : "NOT READY");
                }}
                size="small"
                fullWidth
              >
                <option value="">-- Select Device --</option>
                {rdDeviceList.map((d, i) => (
                  <option key={i} value={d.info}>
                    {d.info} ({d.status})
                  </option>
                ))}
              </TextField>

              <TextField
                label="Device Info"
                value={rdDevice ? rdDevice.info : ""}
                size="small"
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Scan Quality"
                value={scanQuality}
                size="small"
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  onClick={detectDevice}
                  disabled={loading}
                >
                  Detect Device
                </Button>
                <Button
                  variant="contained"
                  onClick={startScan}
                  disabled={!rdDevice || !aadhaar || aadhaar.length !== 12 || loading}
                  sx={{ bgcolor: "#1CA895", textTransform: "none" }}
                >
                  Start Scan
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Note at bottom */}
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            textAlign: "center",
            color: "gray",
            fontStyle: "italic",
          }}
        >
          Note: Connect scanner for scanning the impression.  
          (When scanner is connected, the status bar turns{" "}
          <span style={{ color: "green", fontWeight: "bold" }}>green</span>.
          If not connected, it shows{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>red</span>)
        </Typography>
      </Box>
    </Modal>
  );
};

export default AEPS2FAModal;