import CommonTabs from "../components/common/CommonTabs";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";

import AccountLadger from "./UI/AccountLadger";
import WalletLedger2 from "./UI/WalletLedger2";

export const WalletLedgers = () => {
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
        <SwapHorizIcon fontSize="small" />
        <span>Wallet Ledger 1</span>
      </div>
    ),
    component: <AccountLadger />,
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
        <ReceiptIcon fontSize="small" />
        <span>Wallet Ledger 2</span>
      </div>
    ),
    component: <WalletLedger2 />,
  },
    
    
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
