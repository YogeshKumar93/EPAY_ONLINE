import React from "react";
import CommonTabs from "../components/common/CommonTabs";
import SuperTransfer from "./SuperTransfer";
import UpiTransfer from "./UpiTransfer";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import QrCodeIcon from "@mui/icons-material/QrCode";

import SyncAltIcon from "@mui/icons-material/SyncAlt";




export const Transfer = () => {
  const tabItems = [
  { label: "Fund Transfer", icon: <SyncAltIcon />, component: <SuperTransfer /> },
  { label: "UPI", icon: <QrCodeIcon />, component: <UpiTransfer /> },

  
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
