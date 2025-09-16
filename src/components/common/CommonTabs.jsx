import React, { useState } from "react";
import { Box, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";

// Reusable TabPanel
const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: { xs: 1, sm: 2 } }}>{children}</Box>}
    </div>
  );
};

const CommonTabs = ({ tabs = [], defaultTab = 0 }) => {
  const [tab, setTab] = useState(defaultTab);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // small screens

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Custom Styled Tabs */}
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: { xs: "0 0 16px 16px", sm: "0 0 24px 24px" },
          display: "flex",
          p: { xs: 0.5, sm: 1 },
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "100%",
          overflowX: "auto",
          mx: "auto",
          mt: { xs: -2, sm: -3 },
        }}
      >
        <Tabs
          value={tab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            "& .MuiTab-root": {
              minWidth: { xs: 80, sm: 100, md: 130 },
              borderRadius: "10px",
              textTransform: "uppercase",
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
              color: "#364a63",
              display: "flex",
              flexDirection: "column",
              padding: { xs: "4px 4px", sm: "4px 6px" },
            },
            "& .MuiTab-root .MuiTab-wrapper": {
              fontFamily: `"DM Sans", sans-serif !important`, // 👈 yaha lagao
            },
            "& .Mui-selected": {
              backgroundColor: "#ebeef2",
              color: "#9d72ff",
              fontWeight: "bold",
            },
          }}
        >
          {tabs.map((tabItem, index) => (
            <Tab
              key={index}
              icon={tabItem.icon}
              label={isMobile ? null : tabItem.label}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {tabs.map((tabItem, index) => (
        <TabPanel key={index} value={tab} index={index}>
          {tabItem.component}
        </TabPanel>
      ))}
    </Box>
  );
};

export default CommonTabs;
