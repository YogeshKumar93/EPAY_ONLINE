import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";

import AEPS2FAModal from "./AEPS/AEPS2FAModal";

const banks = ["Bank A", "Bank B", "Bank C"];

const AepsMainComponent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [aeps2FAOpen, setAeps2FAOpen] = useState(false);
  const [fingerprintData, setFingerprintData] = useState(null);

  const [formData, setFormData] = useState({
    bank: "",
    mobile: "",
    aadhaar: "",
    amount: "",
  });

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStartAeps2FA = () => {
    setAeps2FAOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, fontFamily: '"DM Sans", sans-serif"' }}>
      <Grid container spacing={3}>
        {/* Left Side: AEPS2FAModal */}
        <Grid item xs={12} md={5} sx={{ order: { xs: 2, md: 1 } }}>
          <Box
            sx={{
              position: { xs: "relative", md: "sticky" },
              top: { md: 20 },
            }}
          >
            <AEPS2FAModal
              open={aeps2FAOpen}
              onClose={() => setAeps2FAOpen(false)}
              title="AEPS"
              onScanSuccess={(data) => setFingerprintData(data)}
              buttons={[
                {
                  label: "Start Scan",
                  onClick: handleStartAeps2FA,
                  variant: "contained",
                  bgcolor: "#9d72f0",
                  color: "#fff",
                  hoverColor: "#8756e5",
                },
              ]}
            />
          </Box>
        </Grid>

        {/* Right Side: Tabs + Forms */}
        <Grid item xs={12} md={7} sx={{ order: { xs: 1, md: 2 } }}>
          <Box
            sx={{
              bgcolor: "#faf8ff",
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(157,114,240,0.08)",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 3,
                "& .MuiTabs-indicator": {
                  height: "4px",
                  borderRadius: "4px",
                  background: "linear-gradient(135deg,#9d72f0,#7b4dff)",
                },
              }}
            >
              <Tab label="Cash Withdrawal" />
              <Tab label="Balance Enquiry" />
              <Tab label="Mini Statement" />
            </Tabs>

            <Stack spacing={2}>
              {/* Common Fields */}
              <TextField
                select
                label="Select Bank"
                name="bank"
                value={formData.bank}
                onChange={handleInputChange}
                fullWidth
                size="small"
              >
                {banks.map((bank, i) => (
                  <MenuItem key={i} value={bank}>
                    {bank}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />

              <TextField
                label="Aadhaar Number"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />

              {/* Conditional Fields */}
              {activeTab === 0 && (
                <TextField
                  label="Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                />
              )}

              {/* AEPS 2FA Button */}
              <Button
                variant="contained"
                onClick={handleStartAeps2FA}
                sx={{
                  bgcolor: "#9d72f0",
                  "&:hover": { bgcolor: "#8756e5" },
                  width: "100%",
                  py: 1.5,
                  fontWeight: 600,
                  mt: 1,
                }}
              >
                Authenticate via AEPS 2FA
              </Button>

              {/* Fingerprint Data Display */}
              {fingerprintData && (
                <Typography
                  sx={{
                    mt: 2,
                    fontSize: "0.85rem",
                    color: "#4caf50",
                    wordBreak: "break-word",
                  }}
                >
                  Fingerprint Captured: {JSON.stringify(fingerprintData)}
                </Typography>
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AepsMainComponent;
