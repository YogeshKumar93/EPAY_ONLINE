import { Avatar } from "@mui/material";
import {
  aeps1,
  aepsImage,
  bankImage,
  bbps_1,
  bbps_2,
  cms1,
  cmsImage,
  complainImage,
  complainImageNew,
  dashboardImage,
  fundReqImage,
  loginHistoryImage,
  profileNewImage,
  rechargeNew,
  riskImage,
  sendmoney,
  sendmoney2,
  serviceImage,
  settingImage,
  settingNew,
  transImage,
  usersImage,
  walletLdgerImage,
  walletLedgerImg,
  walletTransferImage,
} from "../../iconsImports";

// Normal User Navigation
export const nav = [
  { title: "Dashboard", icon: dashboardImage, icon2: "📊", to: "/dashboard" },
  { title: "Recharge", icon: rechargeNew, icon2: "🔋", to: "/recharge" },
  {
    title: "Money Transfer",
    icon: fundReqImage,
    icon2: "💸",
    to: "/money-transfer",
  },
];

// Admin Navigation
export const Admin_nav = [
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/admin/dashboard",
  },
  { title: "Manage Users", icon: usersImage, icon2: "👥", to: "/admin/users" },
  {
    title: "Fund Request",
    icon: bankImage,
    icon2: "🛠️",
    to: "/admin/fund-request",
  },
  // { title: "Notification", icon: "💳", icon2: "💳", to: "/admin/notification" },
  {
    title: "Transactions",
    icon: transImage,
    icon2: "💳",
    to: "/admin/transactions",
  },
  // { title: "Statement", icon: "💳", icon2: "💳", to: "/admin/statement" },
  {
    title: "Bankings",
    icon: bankImage,
    icon2: bankImage,
    to: "/admin/bankings",
  },
  { title: "Services", icon: serviceImage, icon2: "👥", to: "/admin/services" },

  // {
  //   title: "Wallet Transfer",
  //   icon: walletTransferImage,
  //   icon2: "🛠️",
  //   to: "/admin/wallet-transfer",
  // },
  {
    title: "Wallet Ledger",
    icon: walletLedgerImg,
    icon2: "🛠️",
    to: "/admin/wallet-ledger",
  },
  { title: "Settings", icon: settingImage, icon2: "👥", to: "/admin/settings" },
  // { title: "Purpose", icon: settingImage, icon2: "👥", to: "/admin/purposes" },

  // {
  //   title: "Layouts",
  //   icon: layoutImage,
  //   icon2: "👥",
  //   to: "/admin/selectlayout",
  // },

  {
    title: "Complaint",
    icon: complainImage,
    icon2: "👥",
    to: "/admin/complaint",
  },
  { title: "Risk", icon: riskImage, icon2: "👥", to: "/admin/risk" },
  // { title: "Virtual Accounts", icon: virtuanAccountImage, icon2: "👥", to: "/admin/virtual_accounts" },
  {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "👥",
    to: "/admin/login_history",
  },
];

// Customer Navigation
export const customer_nav = [
  // {
  //   title: "Dashboard",
  //   icon: dashboardImage,
  //   icon2: "📊",
  //   to: "/customer/dashboard",
  // },
  {
    title: "Recharge",
    icon: rechargeNew,
    icon2: "🛠️",
    to: "/customer/recharge-bill",
  },

  {
    title: "Money transfer",
    icon: bankImage,
    icon2: "🛠️",
    to: "/customer/money-transfer",
  },

  {
    title: "Fund Transfer",
    icon: fundReqImage,
    icon2: "🛠️",
    to: "/customer/transfer",
  },
  { title: "AEPS", icon: aepsImage, icon2: "👥", to: "/customer/aeps" },

  {
    title: "BBPS Online",
    icon: bbps_1,
    icon2: "📒",
    to: "/customer/bbps",
  },
  {
    title: "BBPS Offline",
    icon: serviceImage,
    icon2: "🛠️",
    to: "/customer/bbps-offline",
  },

  { title: "Cms", icon: cms1, icon2: "📒", to: "/customer/cms" },

  //  {
  //   title: "Fund Transfer",
  //   icon: fundReqImage,
  //   icon2: "🛠️",
  //   to: "/customer/fund-transfer",
  // },

  //  {
  //   title: "Upi Transfer",
  //   icon: walletTransferImage,
  //   icon2: "🛠️",
  //   to: "/customer/upi-transfer",
  // },

  {
    title: "Wallet Transfer",
    icon: walletTransferImage,
    icon2: "🛠️",
    to: "/customer/wallet-transfer",
  },

  {
    title: "Fund Request",
    icon: fundReqImage,
    icon2: "🛠️",
    to: "/customer/fund-request",
  },
  {
    title: "Transactions",
    icon: serviceImage,
    icon2: "💳",
    to: "/customer/transactions",
  },

  // {
  //   title: "W2W Transfer",
  //   icon: "🛠️",
  //   icon2: "🛠️",
  //   to: "/customer/w2w-transfer",
  // },

  {
    title: "Wallet Ledger",
    icon: walletLedgerImg,
    icon2: "📒",
    to: "/customer/wallet-ledger",
  },
  {
    title: "Complaints",
    icon: complainImageNew,
    icon2: "📒",
    to: "/customer/complaint",
  },
  { title: "Risk", icon: riskImage, icon2: "👥", to: "/customer/risk" },
  // {
  //   title: "My Purchase",
  //   icon: transImage,
  //   icon2: "🛠️",
  //   to: "/customer/purchase",
  // },
  // {
  //   title: "Complaints",
  //   icon: fundReqImage,
  //   icon2: "📒",
  //   to: "/customer/complaint",
  // },

  {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "📒",
    to: "/customer/login_history",
  },
];
export const di_nav = [
  // {
  //   title: "Dashboard",
  //   icon: dashboardImage,
  //   icon2: "📊",
  //   to: "/di/dashboard",
  // },
  { title: "Users", icon: usersImage, icon2: "👥", to: "/di/users" },
  {
    title: "Transaction",
    icon: serviceImage,
    icon2: "🛠️",
    to: "/di/transactions",
  },
  {
    title: "Wallet Transfer",
    icon: walletTransferImage,
    icon2: "🛠️",
    to: "/di/wallet-transfer",
  },
  {
    title: "Wallet Ledger",
    icon: walletLedgerImg,
    icon2: "📒",
    to: "/di/wallet-ledger",
  },
  {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "📒",
    to: "/di/login_history",
  },
];

export const service_nav = [
  // {
  //   title: "Dashboard",
  //   icon: dashboardImage,
  //   icon2: "📊",
  //   to: "/customer/dashboard",
  // },
  {
    title: "All Services",
    icon: serviceImage,
    icon2: "🛠️",
    to: "/customer/allServices",
  },
  // {
  //   title: "Wallet Transfer",
  //   icon: walletTransferImage,
  //   icon2: "🛠️",
  //   to: "/customer/wallet-transfer",
  // },
  {
    title: "Wallet Ledger",
    icon: walletLdgerImage,
    icon2: "🛠️",
    to: "/customer/wallet-ledger",
  },
  {
    title: "Transactions",
    icon: transImage,
    icon2: "💳",
    to: "/customer/transactions",
  },
  {
    title: "Fund Request",
    icon: bankImage,
    icon2: "🛠️",
    to: "/customer/fund-request",
  },
  {
    title: "Activity Logs",
    icon: riskImage,
    icon2: "📒",
    to: "/customer/login_history",
  },
   {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "👥",
    to: "/customer/login_history",
  },
];

export const asm_nav = [
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/asm/dashboard",
  },
  {
    title: "Manage Users",
    icon: usersImage,
    icon2: usersImage,
    to: "/asm/users",
  },
  {
    title: "Transactions",
    icon: serviceImage,
    icon2: "📊",
    to: "/asm/transcations",
  },
  // { title: "Profile", icon: serviceImage, icon2: "📊", to: "/asm/profile" },
  {
    title: "Wallet Ledger",
    icon: walletLdgerImage,
    icon2: "📊",
    to: "/asm/wallet-ledger",
  },
  {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "📒",
    to: "/asm/login_history",
  },
];

export const zsm_nav = [
  // {
  //   title: "Dashboard",
  //   icon: dashboardImage,
  //   icon2: "📊",
  //   to: "/zsm/dashboard",
  // },
  { title: "Users", icon: usersImage, icon2: "📊", to: "/zsm/users" },
  {
    title: "Transcations",
    icon: transImage,
    icon2: "📊",
    to: "/zsm/transcations",
  },
  { title: "Profile", icon: profileNewImage, icon2: "📊", to: "/zsm/profile" },
  {
    title: "Wallet Ledger",
    icon: walletLdgerImage,
    icon2: "📊",
    to: "/zsm/wallet-ledger",
  },
  {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "📒",
    to: "/zsm/login_history",
  },
];

export const api_nav = [
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/api/dashboard",
  },
  { title: "Users", icon: usersImage, icon2: "📊", to: "/api/users" },
  {
    title: "Transcations",
    icon: transImage,
    icon2: "📊",
    to: "/api/transcations",
  },
  { title: "Profile", icon: profileNewImage, icon2: "📊", to: "/api/profile" },
  {
    title: "Complaint",
    icon: complainImageNew,
    icon2: "📊",
    to: "/api/complaint",
  },
  {
    title: "Fund Request",
    icon: bankImage,
    icon2: "📊",
    to: "/api/fund-request",
  },
  {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "📒",
    to: "/api/login_history",
  },
];

export const md_nav = [
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/md/dashboard",
  },
  { title: "Users", icon: usersImage, icon2: "📊", to: "/md/users" },

  {
    title: "Fund Request",
    icon: bankImage,
    icon2: "🛠️",
    to: "/md/fund-request",
  },
  {
    title: "Transcations",
    icon: transImage,
    icon2: "📊",
    to: "/md/transcations",
  },
  {
    title: "Wallet Transfer",
    icon: walletTransferImage,
    icon2: "🛠️",
    to: "/md/wallet-transfer",
  },
  {
    title: "Wallet Ledger",
    icon: walletLedgerImg,
    icon2: "🛠️",
    to: "/md/wallet-ledger",
  },
  {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "📒",
    to: "/md/login_history",
  },
];
