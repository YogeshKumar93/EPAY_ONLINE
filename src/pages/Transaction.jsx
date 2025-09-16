import React from "react";
import CommonTabs from "../components/common/CommonTabs";

// Import your transaction components
import DmtTxn from "../components/Transactions/DmtTxn";
import BbpxTxn from "../components/Transactions/BbpsTxn";
import AepsTxn from "../components/Transactions/AepsTxn";
import RechargeTxn from "../components/Transactions/RechargeTxn";
import PayoutTxn from "../components/Transactions/PayoutTxn";
import MatmTxn from "../components/Transactions/MatmTxn";
import IrctcTxn from "../components/Transactions/IrctcTxn";

// Icons
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import TrainIcon from "@mui/icons-material/Train";
import { Wallet } from "@mui/icons-material";
import Wallet2WalletTransfer from "./Wallet2WalletTransfer";

export const Transaction = () => {
  const tabItems = [
    { label: "DMT", icon: <SwapHorizIcon />, component: <DmtTxn /> },
    { label: "BBPS", icon: <ReceiptIcon />, component: <BbpxTxn /> },
    { label: "Aeps", icon: <FingerprintIcon />, component: <AepsTxn /> },
    { label: "Matm", icon: <CreditCardIcon />, component: <MatmTxn /> },
    { label: "Fund Transfer", icon: <PaymentIcon />, component: <PayoutTxn /> },
    { label: "Recharge", icon: <PhoneIphoneIcon />, component: <RechargeTxn /> },
    { label: "Irctc", icon: <TrainIcon />, component: <IrctcTxn /> },
    { label: "W2W", icon: <Wallet />, component: <Wallet2WalletTransfer /> },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
