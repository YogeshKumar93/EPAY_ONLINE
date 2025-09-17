/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Simple device status constants
const RDDeviceStatus = {
  NOT_READY: "NOTREADY",
  READY: "READY",
  SCANNING: "SCANNING...",
  CONNECTED: "CONNECTED",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  height: "max-content",
  maxHeight: "90vh",
  overflowY: "auto",
  p: 2,
  pb: 3,
};

function getColor(status) {
  if (status === RDDeviceStatus.NOT_READY) return "red";
  if (status === RDDeviceStatus.READY) return "orange";
  if (status === RDDeviceStatus.CONNECTED) return "green";
  return "gray";
}

const AEPS2LoginModal = ({ open, onClose }) => {
  const [aadhaar, setAadhaar] = useState("");
  const [status, setStatus] = useState(RDDeviceStatus.NOT_READY);
  const [scanQuality, setScanQuality] = useState("");
  const [rdDeviceList, setRdDeviceList] = useState([]);
  const [rdDevice, setRdDevice] = useState(null);

  const detectDevice = () => {
    // simulate detecting RD device
    setTimeout(() => {
      const devices = [
        { status: RDDeviceStatus.READY, info: "Mantra MFS100 on COM3" },
      ];
      setRdDeviceList(devices);
      setRdDevice(devices[0]);
      setStatus(devices[0].status);
    }, 1000);
  };

  const startScan = () => {
    if (!rdDevice) return alert("Please select RD device first");
    if (!aadhaar) return alert("Enter Aadhaar Number first");

    setStatus(RDDeviceStatus.SCANNING);
    setTimeout(() => {
      setStatus(RDDeviceStatus.CONNECTED);
      setScanQuality("85");
    }, 2000);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Close button */}
        <CloseIcon
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            cursor: "pointer",
            fontSize: 28,
            color: "gray",
          }}
        />

        <Typography
          variant="h6"
          sx={{ mb: 2, textAlign: "center", fontWeight: "bold", color: "#1CA895" }}
        >
          AEPS 2FA Login
        </Typography>

        <Grid container spacing={2}>
          {/* Left: Device indicator */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: getColor(status),
                transition: "all 0.3s ease",
              }}
            />
            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
              {status}
            </Typography>
          </Grid>

          {/* Right: Form fields */}
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ width: "100%", mb: 2 }}>
              <TextField
                label="Aadhaar Number"
                size="small"
                value={aadhaar}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 12) setAadhaar(val);
                }}
              />
            </FormControl>

            <FormControl sx={{ width: "100%", mb: 2 }}>
              <TextField
                select
                SelectProps={{ native: true }}
                label="Select RD Device"
                size="small"
                value={rdDevice?.info || ""}
                onChange={(e) =>
                  setRdDevice(rdDeviceList.find((d) => d.info === e.target.value))
                }
              >
                <option value="">-- Select Device --</option>
                {rdDeviceList.map((d, i) => (
                  <option key={i} value={d.info}>
                    {d.info}
                  </option>
                ))}
              </TextField>
            </FormControl>

            <FormControl sx={{ width: "100%", mb: 2 }}>
              <TextField
                label="Scan Quality"
                size="small"
                value={scanQuality}
                InputProps={{ readOnly: true }}
              />
            </FormControl>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={detectDevice}>
                Detect Device
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#1CA895", textTransform: "none" }}
                disabled={!rdDevice || !aadhaar}
                onClick={startScan}
              >
                Start Scan
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "gray", fontStyle: "italic" }}
        >
          Note: Connect scanner to change status indicator color.  
          (Green = Connected, Orange = Ready, Red = Not Ready)
        </Typography>
      </Box>
    </Modal>
  );
};

export default AEPS2LoginModal;
