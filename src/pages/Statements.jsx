import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

import AccountStatement from "./AccountStatement";
import BankStatements from "./BankStatements";


 

// Reusable TabPanel
const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const Statements = () => {
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
        <Tab label="Account Statements" />
        <Tab label="Bank Statements" />
      </Tabs>

      {/* Tab Content */}
      <TabPanel value={tab} index={0}>
   <AccountStatement />
      </TabPanel>
      <TabPanel value={tab} index={1}>
    <BankStatements />
      </TabPanel>
    </Box>
  );
};

export default Statements;
