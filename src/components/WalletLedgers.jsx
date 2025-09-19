import CommonTabs from "../components/common/CommonTabs";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";

import AccountLadger from "./UI/AccountLadger";
import WalletLedger2 from "./UI/WalletLedger2";

export const WalletLedgers = () => {
  const tabItems = [
    {
      label: "Wallet Ledger 1",
      icon: <SwapHorizIcon />,
      component: <AccountLadger />,
    },
    {
      label: "Wallet Ledger 2",
      icon: <ReceiptIcon />,
      component: <WalletLedger2 />,
    },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
