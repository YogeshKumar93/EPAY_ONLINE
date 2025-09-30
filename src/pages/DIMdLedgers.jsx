import React, { useState } from "react";
import CommonTabs from "../components/common/CommonTabs";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";

import WalletLedger3 from "./WalletLedger3";
import AccountLadger from "../components/UI/AccountLadger";

export const DiMdLedgers = () => {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const tabItems = [
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SwapHorizIcon fontSize="small" />
          Wallet Ledger 1
        </div>
      ),
      content: <AccountLadger />,
    },
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ReceiptIcon fontSize="small" />
          Wallet Ledger 3
        </div>
      ),
      content: <WalletLedger3 />,
    },
  ];

  return <CommonTabs tabs={tabItems} value={tab} onChange={handleChange} />;
};
