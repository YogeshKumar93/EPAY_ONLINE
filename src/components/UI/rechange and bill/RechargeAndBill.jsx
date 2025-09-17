import React, { useState } from "react";
import { 
  Box, 
  Paper, 
  useTheme,
  useMediaQuery 
} from "@mui/material";

import Diversity2Icon from "@mui/icons-material/Diversity2";
import SettingsCellIcon from "@mui/icons-material/SettingsCell";
import SatelliteIcon from "@mui/icons-material/Satellite";
import BoltIcon from "@mui/icons-material/Bolt";
import RouterIcon from "@mui/icons-material/Router";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import OpacityIcon from "@mui/icons-material/Opacity";
import SecurityIcon from "@mui/icons-material/Security";
import CallIcon from "@mui/icons-material/Call";

import ElectricityForm from "./ElectricityForm";
import CustomTabs from "../../common/CustomTabs";

const RechargeAndBill = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    {
      label: (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          minWidth: "80px",
          justifyContent: "flex-start",
        }}>
          <Diversity2Icon fontSize="small" />
          <span>Postpaid</span>
        </div>
      ),
    },
    {
      label: (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          minWidth: "80px",
          justifyContent: "flex-start",
        }}>
          <SettingsCellIcon fontSize="small" />
          <span>Prepaid</span>
        </div>
      ),
    },
    {
      label: (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          minWidth: "80px",
          justifyContent: "flex-start",
        }}>
          <SatelliteIcon fontSize="small" />
          <span>DTH</span>
        </div>
      ),
    },
    {
      label: (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          minWidth: "80px",
          justifyContent: "flex-start",
        }}>
          <BoltIcon fontSize="small" />
          <span>Electricity</span>
        </div>
      ),
    },
    {
      label: (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          minWidth: "80px",
          justifyContent: "flex-start",
        }}>
          <RouterIcon fontSize="small" />
          <span>Broadband</span>
        </div>
      ),
    },
    {
      label: (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          minWidth: "80px",
          justifyContent: "flex-start",
        }}>
          <LocalGasStationIcon fontSize="small" />
          <span>Gas</span>
        </div>
      ),
    },
    {
      label: (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          minWidth: "80px",
          justifyContent: "flex-start",
        }}>
          <OpacityIcon fontSize="small" />
          <span>Water</span>
        </div>
      ),
    },
    {
      label: (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          minWidth: "80px",
          justifyContent: "flex-start",
        }}>
          <SecurityIcon fontSize="small" />
          <span>Insurance</span>
        </div>
      ),
    },
    {
      label: (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          minWidth: "80px",
          justifyContent: "flex-start",
        }}>
          <CallIcon fontSize="small" />
          <span>Landline</span>
        </div>
      ),
    },
  ];

  const tabComponents = [
    <ElectricityForm type="POSTPAID" />,
    <ElectricityForm type="PREPAID" />,
    <ElectricityForm type="DTH" />,
    <ElectricityForm type="ELECTRICITY" />,
    <ElectricityForm type="BRODBAND" />,
    <ElectricityForm type="GAS" />,
    <ElectricityForm type="WATER" />,
    <ElectricityForm type="INSURANCE" />,
    <ElectricityForm type="LANDLINE" />,
  ];

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 4,
        background: theme.palette.background.paper,
      }}
    >
      <Box 
        sx={{ 
          borderBottom: 1, 
          borderColor: "divider",
          mb: 3,
        }}
      >
        <CustomTabs 
          tabs={tabs} 
          value={currentTab} 
          onChange={handleChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
        />
      </Box>

      <Box 
        sx={{ 
          p: isMobile ? 1 : 2,
          borderRadius: 2,
          backgroundColor: theme.palette.grey[50],
          boxShadow: theme.shadows[1],
        }}
      >
        {tabComponents[currentTab]}
      </Box>
    </Paper>
  );
};

export default RechargeAndBill;
