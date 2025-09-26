import React, { useContext, useState } from "react";
import CommonTabs from "../components/common/CommonTabs";

// Wallet components
import Wallet2WalletTransfer from "./Wallet2WalletTransfer";
import Wallet2Wallet1 from "./Wallet2Wallet1";
import Wallet3ToWallet1 from "./Wallet3ToWallet1";
import WalletIcon from "@mui/icons-material/Wallet";
// Icons
import { CurrencyRupee } from "@mui/icons-material";

import AuthContext from "../contexts/AuthContext";

export const WalletTransfer = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  let tabItems = [];

  if (user?.role === "ret" || user?.role === "dd") {
    // Retailer
    tabItems = [
      {
        label: (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WalletIcon fontSize="small" />
            W1 TO W1 Transfer
          </div>
        ),
        content: <Wallet2WalletTransfer />,
      },
      {
        label: (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CurrencyRupee fontSize="small" />
            Wallet2toWallet1
          </div>
        ),
        content: <Wallet2Wallet1 />,
      },
       {
        label: (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CurrencyRupee fontSize="small" />
            WALLET 3 TO WALLET 1
          </div>
        ),
        content: <Wallet3ToWallet1 />,
      },
    ];
  } else if (user?.role === "di" || user?.role === "md") {
    // Distributor / Master Distributor
    tabItems = [
      {
        label: (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WalletIcon fontSize="small" />
            W1 TO W1 Transfer
          </div>
        ),
        content: <Wallet2WalletTransfer />,
      },
      {
        label: (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WalletIcon fontSize="small" />
            W3 TO W1 Transfer
          </div>
        ),
        content: <Wallet3ToWallet1 />,
      },
    ];
  }

  return <CommonTabs tabs={tabItems} value={tab} onChange={handleChange} />;
};
