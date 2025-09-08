import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

import Banks from "./Banks";
import Accounts from "./Accounts";
import Unclaimed from "./Unclaimed";

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{  }}>{children}</Box>}
    </div>
  );
};

export const Banking = () => {
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
        <Tab label="BANKS" />
        <Tab label="ACCOUNTS" />
        <Tab label="UNCLAIMED" />
    
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Banks />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Accounts />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Unclaimed />
      </TabPanel>
     
    </Box>
  );
};
