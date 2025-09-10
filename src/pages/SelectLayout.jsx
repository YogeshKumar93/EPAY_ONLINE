import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Layouts from "./Layouts";
import Navs from "./Navs";


 

// Reusable TabPanel
const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const SelectLayout = () => {
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
        <Tab label="Color Layouts" />
        <Tab label="Side Layout" />
      </Tabs>

      {/* Tab Content */}
      <TabPanel value={tab} index={0}>
        <Layouts />
      </TabPanel>
      <TabPanel value={tab} index={1}>
    <Navs />
      </TabPanel>
    </Box>
  );
};

export default SelectLayout;
