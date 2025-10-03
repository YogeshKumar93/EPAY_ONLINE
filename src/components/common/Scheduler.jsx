import React, { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Typography, Tooltip } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useToast } from "../../utils/ToastContext";

const Scheduler = ({ onRefresh }) => {
  const { showToast } = useToast();
  const [anchorEl, setAnchorEl] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null);
  const [countdownInterval, setCountdownInterval] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleIntervalSelect = (interval) => {
    handleClose();

    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      setAutoRefreshInterval(null);
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }

    if (interval === 0) {
      setCountdown(0);
      showToast("Auto-refresh stopped", "info");
      return;
    }

    onRefresh(); // Call immediately
    setCountdown(interval);

    const intervalId = setInterval(() => {
      onRefresh();
      setCountdown(interval);
    }, interval * 1000);

    setAutoRefreshInterval(intervalId);

    const countdownId = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : interval));
    }, 1000);

    setCountdownInterval(countdownId);

    showToast(`Auto-refresh every ${interval} seconds enabled`, "success");
  };

  useEffect(() => {
    return () => {
      if (autoRefreshInterval) clearInterval(autoRefreshInterval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [autoRefreshInterval, countdownInterval]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <Tooltip title="Scheduler">
        <IconButton onClick={handleClick}>
          <ScheduleIcon />
        </IconButton>
      </Tooltip>

      {countdown > 0 && (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {countdown}s
        </Typography>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleIntervalSelect(5)}>Every 5 sec</MenuItem>
        <MenuItem onClick={() => handleIntervalSelect(10)}>Every 10 sec</MenuItem>
        <MenuItem onClick={() => handleIntervalSelect(20)}>Every 20 sec</MenuItem>
        <MenuItem onClick={() => handleIntervalSelect(30)}>Every 30 sec</MenuItem>
        <MenuItem onClick={() => handleIntervalSelect(0)}>Stop Auto-Refresh</MenuItem>
      </Menu>
    </div>
  );
};

export default Scheduler;
