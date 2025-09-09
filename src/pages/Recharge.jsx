import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import DmtTxn from "../components/Transactions/DmtTxn";
import BbpxTxn from "../components/Transactions/BbpsTxn";
import Prepaid from "../components/UI/rechange and bill/Prepaid";
import Postpaid from "../components/UI/rechange and bill/Postpaid";

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{  }}>{children}</Box>}
    </div>
  );
};

export const Recharge = () => {
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
        <Tab label="Prepaid" />
        <Tab label="Postpaid" />
   
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Prepaid />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Postpaid />
      </TabPanel>
    </Box>
  );
};
