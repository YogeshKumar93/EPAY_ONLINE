import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Templates from "./Templates";
import CommissionRule from "./CommissionRule";
import Layouts from "./Layouts";
import Logs from "./Logs";
import WebHooks from "./WebHooks";


const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{  }}>{children}</Box>}
    </div>
  );
};

export const Settings = () => {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tab Header */}
      <Tabs
        value={tab}
        onChange={handleChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Template" />
        <Tab label="Comm Rules" />
        <Tab label="Layout" />
        <Tab label="WebHooks" />
        <Tab label="Logs" />
       
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Templates />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <CommissionRule />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Layouts />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <WebHooks />
      </TabPanel>
      <TabPanel value={tab} index={4}>
        <Logs />
      </TabPanel>
    
    </Box>
  );
};
