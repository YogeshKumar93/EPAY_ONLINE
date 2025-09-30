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

const CommonTabs = ({ tabs = [], value, onChange, defaultTab = 0 }) => {
  // internal state (only used if value/onChange not passed)
  const [internalTab, setInternalTab] = useState(defaultTab);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const activeTab = value !== undefined ? value : internalTab;
  const handleChange = (event, newValue) => {
    if (onChange) {
      onChange(event, newValue); // controlled
    } else {
      setInternalTab(newValue); // uncontrolled
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Custom Styled Tabs */}
      <Box
        sx={{
          bgcolor: "#d4e8e8ff",
          borderRadius: { xs: "0 0 8px 8px", sm: "0 0 8px 8px" },
          display: "flex",
          justifyContent: "center",
          p: { xs: 0.5, sm: 1 },
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "100%",
          overflowX: "auto",
          mx: "auto",
          mt: { xs: -2, sm: -2.5 },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            minHeight: "24px",
            "& .MuiTab-root": {
              minWidth: { xs: 80, sm: 100, md: 130 },
              minHeight: "24px",
              borderRadius: "10px",
              textTransform: "uppercase",
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
              color: "#49299eff",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              padding: { xs: "2px 4px", sm: "2px 6px" },
            },
            "& .MuiTab-root .MuiTab-wrapper": {
              fontFamily: `"DM Sans", sans-serif !important`,
            },
            "& .Mui-selected": {
              backgroundColor: "#f2f2ebff",
              color: "#2ecb46ff",
              fontWeight: 500,
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
        <TabPanel key={index} value={activeTab} index={index}>
          {/* ✅ use `component` instead of `content` */}
          {tabItem.component || tabItem.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default CommonTabs;
