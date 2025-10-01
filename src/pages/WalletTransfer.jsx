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
    tabItems = [
      // {
      //   label: createTabLabel(
      //     <WalletIcon fontSize="small" />,
      //     "W1 TO W1 Transfer"
      //   ),
      //   component: <Wallet2WalletTransfer />,
      // },
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
            <WalletIcon fontSize="small" />
            <span>W1 TO W1 Transfer</span>
          </div>
        ),
        component: <Wallet2WalletTransfer />,
      },
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
            <WalletIcon fontSize="small" />
            <span>W2 TO W1 Transfer</span>
          </div>
        ),
        component: <Wallet2Wallet1 />,
      },
      // {
      //   label: createTabLabel(
      //     <WalletIcon fontSize="small" />,
      //     "W2 TO W1 Transfer"
      //   ),
      //   component: <Wallet2Wallet1 />,
      // },
    ];
  } else if (user?.role === "di" || user?.role === "md") {
    // Distributor / Master Distributor
    tabItems = [
      {
        label: createTabLabel(
          <WalletIcon fontSize="small" />,
          "W1 TO W1 Transfer"
        ),
        component: <Wallet2WalletTransfer />,
      },
      {
        label: createTabLabel(
          <WalletIcon fontSize="small" />,
          "W3 TO W1 Transfer"
        ),
        component: <Wallet3ToWallet1 />,
      },
    ];
  }

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
