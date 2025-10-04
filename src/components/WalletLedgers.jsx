import React, { useState, useContext } from "react";
import CommonTabs from "../components/common/CommonTabs";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";

import AccountLadger from "./UI/AccountLadger";
import WalletLedger2 from "./UI/WalletLedger2";
import WalletLedger3 from "../pages/WalletLedger3";
import AuthContext from "../contexts/AuthContext"; // ✅ Example if you're using AuthContext

export const WalletLedgers = () => {
  const [tab, setTab] = useState(0);
  const { user } = useContext(AuthContext) || {}; // ✅ adjust based on your setup
  const isAdmin = user?.role === "adm"; // or user?.isAdmin, depending on your data

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  // ✅ Base tabs visible to everyone
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
          Wallet Ledger 2
        </div>
      ),
      content: <WalletLedger2 />,
    },
  ];

  // ✅ Add Wallet Ledger 3 only if user is admin
  if (isAdmin) {
    tabItems.push({
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ReceiptIcon fontSize="small" />
          Wallet Ledger 3
        </div>
      ),
      content: <WalletLedger3 />,
    });
  }

  return <CommonTabs tabs={tabItems} value={tab} onChange={handleChange} />;
};
