import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

// Reusable TabPanel
const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const CommonTabs = ({ tabs = [], defaultTab = 0 }) => {
  const [tab, setTab] = useState(defaultTab);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Custom Styled Tabs */}
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "0 0 24px 24px",
          display: "flex",
          p: 1,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "fit-content",
          mx: "auto",
          mt: -3,
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
              minWidth: 180,
              borderRadius: "16px",
              textTransform: "none",
              fontSize: "0.75rem",
              color: "#1976d2",
              display: "flex",
              flexDirection: "column",
              padding: "8px 12px",
            },
            "& .Mui-selected": {
              bgcolor: "#e3f2fd",
              color: "#1976d2",
              fontWeight: "bold",
            },
          }}
        >
          {tabs.map((tabItem, index) => (
            <Tab
              key={index}
              icon={tabItem.icon}
              label={tabItem.label}
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
