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

export const navConfig = [
  // Dashboard
  {
    title: "Dashboard",
    icon: dashboardImage,
    icon2: "📊",
    to: {
      adm: "/admin/dashboard",
      ret: "/customer/dashboard",
      di: "/di/dashboard",
      md: "/md/dashboard",
      asm: "/asm/dashboard",
      zsm: "/zsm/dashboard",
      api: "/api/dashboard",
    },
    roles: ["adm", "ret", "di", "md", "asm", "zsm", "api"],
  },

  // Manage Users
  {
    title: "Manage Users",
    icon: usersImage,
    icon2: "👥",
    to: {
      adm: "/admin/users",
      asm: "/asm/users",
      zsm: "/zsm/users",
      md: "/md/users",
    },
    roles: ["adm"],
  },

  // Recharge & Bill Payments
  {
    title: "Recharge",
    icon: rechargeNew,
    icon2: "🔋",
    to: {
      ret: "/customer/recharge-bill",
      default: "/recharge",
    },
    roles: ["ret"],
    permissionKey: "recharge",
  },

  {
    title: "Money Transfer",
    icon: transImage,
    icon2: "💸",
    to: {
      ret: "/customer/money-transfer",
      default: "/money-transfer",
    },
    roles: ["ret"],
    permissionKey: "dmt1",
  },

  // Fund Transfer
  {
    title: "Fund Transfer",
    icon: fundReqImage,
    icon2: "🛠️",
    to: {
      ret: "/customer/transfer",
    },
    roles: ["ret"],
  },

  // AEPS
  {
    title: "AEPS",
    icon: aepsImage,
    icon2: "👥",
    to: {
      ret: "/customer/aeps",
    },
    roles: ["ret"],
  },

  // BBPS Online
  {
    title: "BBPS Online",
    icon: bbps_1,
    icon2: "📒",
    to: {
      ret: "/customer/bbps",
    },
    roles: ["ret"],
    // permissionKey: "bbps_online",
  },

  // BBPS Offline
  {
    title: "BBPS Offline",
    icon: serviceImage,
    icon2: "🛠️",
    to: {
      ret: "/customer/bbps-offline",
    },
    roles: ["ret"],
    permissionKey: "bbps_offline",
  },

  // CMS
  {
    title: "CMS",
    icon: cmsImage,
    icon2: "📒",
    to: {
      ret: "/customer/cms",
    },
    roles: ["ret"],
    // permissionKey: "cms",
  },

  // Wallet Transfer
  {
    title: "Wallet Transfer",
    icon: walletTransferImage,
    icon2: "🛠️",
    to: {
      ret: "/customer/wallet-transfer",
      di: "/di/wallet-transfer",
      md: "/md/wallet-transfer",
    },
    roles: ["ret", "di", "md"],
  },

  // Fund Request
  {
    title: "Fund Request",
    icon: fundReqImage,
    icon2: "🛠️",
    to: {
      adm: "/admin/fund-request",
      ret: "/customer/fund-request",
      md: "/md/fund-request",
      api: "/api/fund-request",
    },
    roles: ["adm", "ret", "md", "api"],
    permissionKey: "fund_req",
  },

  // Transactions
  {
    title: "Transactions",
    icon: transImage,
    icon2: "💳",
    to: {
      adm: "/admin/transactions",
      ret: "/customer/transactions",
      di: "/di/transactions",
      asm: "/asm/transcations",
      zsm: "/zsm/transcations",
      api: "/api/transcations",
      md: "/md/transcations",
    },
    roles: ["adm", "ret", "di", "asm", "zsm", "api", "md"],
  },

  {
    title: "Bankings",
    icon: bankImage,
    icon2: "🏦",
    to: {
      adm: "/admin/bankings",
    },
    permissionKey: "banking",
    roles: ["adm"],
  },

  // Services
  {
    title: "Services",
    icon: serviceImage,
    icon2: "🛠️",
    to: {
      adm: "/admin/services",
      ret: "/customer/allServices",
    },
    roles: ["adm", "ret"],
  },

  // Wallet Ledger
  {
    title: "Wallet Ledger",
    icon: walletLdgerImage,
    icon2: "📒",
    to: {
      adm: "/admin/wallet-ledger",
      ret: "/customer/wallet-ledger",
      di: "/di/wallet-ledger",
      asm: "/asm/wallet-ledger",
      zsm: "/zsm/wallet-ledger",
      md: "/md/wallet-ledger",
    },
    roles: ["adm", "ret", "di", "asm", "zsm", "md"],
  },

  // Settings
  {
    title: "Settings",
    icon: settingImage,
    icon2: "⚙️",
    to: {
      adm: "/admin/settings",
    },
    permissionKey: "settings",
    roles: ["adm"],
  },

  // Complaint
  {
    title: "Complaint",
    icon: complainImage,
    icon2: "📝",
    to: {
      adm: "/admin/complaint",
      ret: "/customer/complaint",
      api: "/api/complaint",
    },
    roles: ["adm", "ret", "api"],
  },

  // Risk
  {
    title: "Risk",
    icon: riskImage,
    icon2: "⚠️",
    to: {
      adm: "/admin/risk",
      ret: "/customer/risk",
      di: "/di/risk",
    },
    roles: ["adm", "ret", "di"],
  },

  // Login History
  {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "📱",
    to: {
      adm: "/admin/login_history",
      ret: "/customer/login_history",
      di: "/di/login_history",
      asm: "/asm/login_history",
      zsm: "/zsm/login_history",
      md: "/md/login_history",
    },
    roles: ["adm", "ret", "di", "asm", "zsm", "md"],
  },

  {
    title: "Users",
    icon: usersImage,
    icon2: "👥",
    to: {
      di: "/di/users",
      md: "/md/users",
      zsm: "/zsm/users",
      asm: "/asm/users",
    },
    roles: ["di", "asm", "zsm", "md"],
  },
];
// Role-wise hierarchy
const roleHierarchy = {
  adm: [
    "Dashboard",
    "Manage Users",
    "Fund Request",
    "Transactions",
    "Bankings",
    "Services",
    "Wallet Ledger",
    "Settings",
    "Complaint",
    "Risk",
    "Login History",
  ],
  md: [
    "Dashboard",
    "Users",
    "Fund Request",
    "Transactions",
    "Wallet Transfer",
    "Wallet Ledger",
    "Login History",
  ],
  di: [
    "Dashboard",
    "Users",
    "Transactions",
    "Wallet Transfer",
    "Wallet Ledger",
    "Risk",
    "Login History",
  ],
  ret: [
    "Dashboard",
    "Recharge",
    "Money Transfer",
    "Fund Transfer",
    "AEPS",
    "BBPS Online",
    "BBPS Offline",
    "CMS",
    "Wallet Transfer",
    "Fund Request",
    "Transactions",
    "Wallet Ledger",
    "Complaint",
    "Risk",
    "Login History",
  ],
  asm: [
    "Manage Users",
    "Transactions",
    "Wallet Ledger",
    "Transactions",
    "Login History",
  ],
  zsm: [
    "Dashboard",
    "Manage Users",
    "Wallet Ledger",
    "Transactions",
    "Login History",
  ],
  api: ["Dashboard", "Fund Request", "Transactions", "Complaint"],
};

// Function to build nav for current role with permission check
export const buildNavForRole = (role, permissions = {}) => {
  const allowedItems = navConfig.filter((item) => item.roles.includes(role));
  const hierarchy = roleHierarchy[role] || [];

  return hierarchy
    .map((title) =>
      allowedItems.find((item) => {
        const hasPermission =
          !item.permissionKey || permissions[item.permissionKey];
        return item.title === title && hasPermission;
      })
    )
    .filter(Boolean); // remove undefined if any
};