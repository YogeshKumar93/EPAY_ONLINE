import React, { useContext, useState } from "react";
import CommonTabs from "../components/common/CommonTabs";

// Wallet components
import Wallet2WalletTransfer from "./Wallet2WalletTransfer";
import Wallet2Wallet1 from "./Wallet2Wallet1";
import Wallet3ToWallet1 from "./Wallet3Wallet1";

// Icons
import WalletIcon from "@mui/icons-material/Wallet";
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

  const createTabLabel = (icon, text) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: "100px",
        justifyContent: "flex-start",
      }}
    >
      {icon}
      <span>{text}</span>
    </div>
  );

  if (user?.role === "ret" || user?.role === "dd") {
    // Retailer
    tabItems = [
      {
        label: createTabLabel(<WalletIcon fontSize="small" />, "W1 TO W1 Transfer"),
        component: <Wallet2WalletTransfer />,
      },
      {
        label: createTabLabel(<WalletIcon fontSize="small" />, "W2 TO W1 Transfer"),
        component: <Wallet2Wallet1 />,
      },
      // Uncomment if needed
      // {
      //   label: createTabLabel(<CurrencyRupee fontSize="small" />, "W3 TO W1 Transfer"),
      //   component: <Wallet3ToWallet1 />,
      // },
    ];
  } else if (user?.role === "di" || user?.role === "md") {
    // Distributor / Master Distributor
    tabItems = [
      {
        label: createTabLabel(<WalletIcon fontSize="small" />, "W1 TO W1 Transfer"),
        component: <Wallet2WalletTransfer />,
      },
      {
        label: createTabLabel(<WalletIcon fontSize="small" />, "W3 TO W1 Transfer"),
        component: <Wallet3ToWallet1 />,
      },
    ];
  }

  return <CommonTabs tabs={tabItems} defaultTab={0} onChange={handleChange} />;
};
