import CommonTabs from "../components/common/CommonTabs";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";   // Banks
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // Accounts
import ReportProblemIcon from "@mui/icons-material/ReportProblem";     // Unclaimed

import Banks from "./Banks";
import Accounts from "./Accounts";
import Unclaimed from "./Unclaimed";

export const Banking = () => {
  const tabItems = [
    { label: "Banks", icon: <AccountBalanceIcon />, component: <Banks /> },
    { label: "Accounts", icon: <AccountBalanceWalletIcon />, component: <Accounts /> },
    { label: "Unclaimed", icon: <ReportProblemIcon />, component: <Unclaimed /> },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
