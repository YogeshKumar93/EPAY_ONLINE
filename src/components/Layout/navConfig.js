import { Avatar } from "@mui/material";
import {
  aepsImage,
  bankImage,
  complainImage,
  dashboardImage,
  fundReqImage,
  loginHistoryImage,
  riskImage,
  serviceImage,
  settingImage,
  transImage,
  usersImage,
  walletLdgerImage,
  walletTransferImage,
} from "../../iconsImports";

// Normal User Navigation
export const nav = [
  { title: "Dashboard", icon: dashboardImage, icon2: "📊", to: "/dashboard" },
  { title: "Recharge", icon: "🔋", icon2: "🔋", to: "/recharge" },
  {
    title: "Money Transfer",
    icon: transImage,
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
    icon: fundReqImage,
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
    icon: walletLdgerImage,
    icon2: "🛠️",
    to: "/admin/wallet-ledger",
  },
  { title: "Settings", icon: settingImage, icon2: "👥", to: "/admin/settings" },
  { title: "Purpose", icon: settingImage, icon2: "👥", to: "/admin/settings" },

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
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/customer/dashboard",
  },
  {
    title: "Recharge",
    icon: serviceImage,
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

  { title: "Bbps(Online)", icon: aepsImage, icon2: "📒", to: "/customer/bbps" },
  {
    title: "Bbps(Offline)",
    icon: aepsImage,
    icon2: "📒",
    to: "/customer/bbpsoffline",
  },

  { title: "Cms", icon: transImage, icon2: "📒", to: "/customer/cms" },

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
    icon: bankImage,
    icon2: "🛠️",
    to: "/customer/fund-request",
  },

  {
    title: "Transactions",
    icon: transImage,
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
    icon: bankImage,
    icon2: "📒",
    to: "/customer/wallet-ledger",
  },

  // {
  //   title: "My Purchase",
  //   icon: transImage,
  //   icon2: "🛠️",
  //   to: "/customer/purchase",
  // },
  {
    title: "Complaints",
    icon: fundReqImage,
    icon2: "📒",
    to: "/customer/complaint",
  },

  // {
  //   title: "Activity Logs",
  //   icon: riskImage,
  //   icon2: "📒",
  //   to: "/customer/retailerlogs",
  // },
];
export const di_nav = [
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/di/dashboard",
  },
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
    icon: bankImage,
    icon2: "📒",
    to: "/di/wallet-ledger",
  },
];

export const service_nav = [
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/customer/dashboard",
  },
  {
    title: "All Services",
    icon: serviceImage,
    icon2: "🛠️",
    to: "/customer/allServices",
  },
  {
    title: "Wallet Transfer",
    icon: walletTransferImage,
    icon2: "🛠️",
    to: "/customer/wallet-transfer",
  },
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
    to: "/customer/retailerlogs",
  },
];

export const asm_nav = [
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/asm/dashboard",
  },
  { title: "Users", icon: "📊", icon2: "📊", to: "/asm/users" },
  { title: "Transcations", icon: "📊", icon2: "📊", to: "/asm/transcations" },
];

export const zsm_nav = [
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/zsm/dashboard",
  },
  { title: "Users", icon: "📊", icon2: "📊", to: "/zsm/users" },
  { title: "Transcations", icon: "📊", icon2: "📊", to: "/zsm/transcations" },
];

export const api_nav = [
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/api/dashboard",
  },
  { title: "Users", icon: "📊", icon2: "📊", to: "/api/users" },
  { title: "Transcations", icon: "📊", icon2: "📊", to: "/api/transcations" },
];

export const md_nav = [
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: "/md/dashboard",
  },
  { title: "Users", icon: "📊", icon2: "📊", to: "/md/users" },
  { title: "Transcations", icon: "📊", icon2: "📊", to: "/md/transcations" },
];
