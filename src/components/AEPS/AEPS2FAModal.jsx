/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AEPS2FAModal = ({ open, onClose }) => {
  const [aadhaar, setAadhaar] = useState("");
  const [rdDeviceList, setRdDeviceList] = useState([]);
  const [rdDevice, setRdDevice] = useState(null);
  const [status, setStatus] = useState("NOT READY");
  const [scanQuality, setScanQuality] = useState("");

  const detectDevice = () => {
    setTimeout(() => {
      const devices = [
        {
          status: "READY",
          rdport: "COM3",
          info: "Mantra MFS100 on COM3",
        },
      ];
      setRdDeviceList(devices);
      if (devices.length > 0) {
        setRdDevice(devices[0]);
        setStatus(devices[0].status);
      }
    }, 1000);
  };

  const startScan = () => {
    if (!rdDevice) return alert("Please select RD device first");
    if (!aadhaar) return alert("Enter Aadhaar Number first");

    setStatus("SCANNING...");
    setTimeout(() => {
      setStatus("CONNECTED");
      setScanQuality("85");
    }, 2000);
  };

  // Status color logic
  const getStatusColor = () => {
    if (status === "CONNECTED") return "green";
    if (status === "SCANNING...") return "orange";
    if (status === "READY") return "blue";
    return "gray";
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95vw", sm: "70vw", md: "60vw" },
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 3,
    p: 3,
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
                height: "100%",
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 80,
                  bgcolor: getStatusColor(),
                  borderRadius: 2,
                  transition: "all 0.3s ease",
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
              />

              <TextField
                select
                SelectProps={{ native: true }}
                label="Select RD Device"
                value={rdDevice?.info || ""}
                onChange={(e) =>
                  setRdDevice(rdDeviceList.find((d) => d.info === e.target.value))
                }
                size="small"
                fullWidth
              >
                <option value="">-- Select Device --</option>
                {rdDeviceList.map((d, i) => (
                  <option key={i} value={d.info}>
                    {d.info}
                  </option>
                ))}
              </TextField>

              <TextField
                label="Device Info"
                value={rdDevice?.info || ""}
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
                <Button variant="outlined" onClick={detectDevice}>
                  Detect Device
                </Button>
                <Button
                  variant="contained"
                  onClick={startScan}
                  disabled={!rdDevice || !aadhaar}
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
          <span style={{ color: "green", fontWeight: "bold" }}>green</span>)
        </Typography>
      </Box>
    </Modal>
  );
};

export default AEPS2FAModal;
