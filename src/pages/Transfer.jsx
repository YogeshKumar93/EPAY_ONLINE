import React from "react";
import CommonTabs from "../components/common/CommonTabs";
import SuperTransfer from "./SuperTransfer";
import UpiTransfer from "./UpiTransfer";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import QrCodeIcon from "@mui/icons-material/QrCode";

import SyncAltIcon from "@mui/icons-material/SyncAlt";




export const Transfer = () => {
  const tabItems = [
   

  {
    label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: "80px", 
          justifyContent: "flex-start", 
        }}
      >
        <SyncAltIcon fontSize="small" />
        <span>Fund Transfer</span>
      </div>
    ),
    component: <SuperTransfer />,
  },
  {
    label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: "80px", // same width for consistency
          justifyContent: "flex-start",
        }}
      >
        <QrCodeIcon fontSize="small" />
        <span>UPI</span>
      </div>
    ),
    component: <UpiTransfer />,
  },

  
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
