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
  Dialog,
  DialogTitle,
  DialogContent,
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

const AEPS2FAModalCommon = ({
  open,
  onClose,
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

  useEffect(() => {
    detectDevice();
  }, []);

  const detectDevice = () => {
    setLoading(true);
    setError("");
    GetMFS100InfoLoad(
      setLoading,
      (devices) => {
        setLoading(false);
        setRdDeviceList(devices);
        const ready = devices.find((d) => d.status === "READY");
        if (ready) setRdDevice(ready);
      },
      (err) => setError(err)
    );
  };

  const startScan = () => {
    if (!rdDevice || !aadhaar || aadhaar.length !== 12) {
      setError("Fill Aadhaar and select device");
      return;
    }

    setLoading(true);
    CaptureFingerPrintAeps2(
      rdDevice.rdport,
      (quality, data) => {
        setLoading(false);
        setScanQuality(data.qScore);
        setSuccess("Fingerprint captured");
        onFingerSuccess && onFingerSuccess(data);
      },
      (err) => {
        setLoading(false);
        setError(err);
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>AEPS 2FA</DialogTitle>
      <DialogContent>
        <TextField
          label="Aadhaar"
          value={aadhaar}
          onChange={(e) =>
            setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))
          }
          fullWidth
          size="small"
          margin="dense"
        />
        <TextField
          select
          label="Select Device"
          value={rdDevice?.info || ""}
          onChange={(e) =>
            setRdDevice(rdDeviceList.find((d) => d.info === e.target.value))
          }
          fullWidth
          size="small"
          margin="dense"
        >
          {rdDeviceList.map((d, i) => (
            <MenuItem key={i} value={d.info}>
              {d.info} ({d.status})
            </MenuItem>
          ))}
        </TextField>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Button
          variant="contained"
          onClick={startScan}
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Scanning..." : "Start Scan"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default AEPS2FAModalCommon