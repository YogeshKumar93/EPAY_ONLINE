import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import DmtTxn from "../components/Transactions/DmtTxn";
import BbpxTxn from "../components/Transactions/BbpsTxn";
import AepsTxn from "../components/Transactions/AepsTxn";
import RechargeTxn from "../components/Transactions/RechargeTxn";
import PayoutTxn from "../components/Transactions/PayoutTxn";
import MatmTxn from "../components/Transactions/MatmTxn";
import IrctcTxn from "../components/Transactions/IrctcTxn";

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{  }}>{children}</Box>}
    </div>
  );
};

export const Transaction = () => {
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
        <Tab label="DMT Txn" />
        <Tab label="BBPS Txn" />
        <Tab label="Aeps Txn" />
        <Tab label="Matm Txn" />
        <Tab label="Payout Txn" />
        <Tab label="Recharge Txn" />
        <Tab label="Irctc Txn" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <DmtTxn />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <BbpxTxn />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <AepsTxn />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <MatmTxn />
      </TabPanel>
      <TabPanel value={tab} index={4}>
        <PayoutTxn />
      </TabPanel>
      <TabPanel value={tab} index={5}>
        <RechargeTxn />
      </TabPanel>
      <TabPanel value={tab} index={6}>
        <IrctcTxn />
      </TabPanel>
    </Box>
  );
};
