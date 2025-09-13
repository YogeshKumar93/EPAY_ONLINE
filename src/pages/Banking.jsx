
import React from "react";
import CommonTabs from "../components/common/CommonTabs";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Banks from "./Banks";
import Accounts from "./Accounts";
import Unclaimed from "./Unclaimed";

export const Banking = () => {
  const tabItems = [
    { label: "BANKS", icon: <SwapHorizIcon />, component: <Banks /> },
    { label: "Accounts", icon: <ReceiptIcon />, component: <Accounts /> },
    { label: "Unclaimed", icon: <CreditCardIcon />, component: <Unclaimed /> },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
