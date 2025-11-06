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
      sadm: "/admin/dashboard",
      ret: "/customer/dashboard",
      dd: "/customer/dashboard",
      di: "/di/dashboard",
      md: "/md/dashboard",
      asm: "/asm/dashboard",
      zsm: "/zsm/dashboard",
      api: "/api/dashboard",
    },
    roles: ["sadm", "adm", "ret", "di", "md", "asm", "zsm", "api", "dd"],
  },

  // Manage Users
  {
    title: "Manage Users",
    icon: usersImage,
    icon2: "👥",
    to: {
      adm: "/admin/users",
      sadm: "/admin/users",
      asm: "/asm/users",
      zsm: "/zsm/users",
      md: "/md/users",
    },
    roles: ["adm", "sadm", "asm", "zsm", "md"],
  },

  // Recharge & Bill Payments
  {
    title: "Recharge",
    icon: rechargeNew,
    icon2: "🔋",
    to: {
      ret: "/customer/recharge-bill",
      dd: "/customer/recharge-bill",
      default: "/recharge",
    },
    roles: ["ret", "dd"],
    permissionKey: "recharge",
  },

  {
    title: "Money Transfer",
    icon: transImage,
    icon2: "💸",
    to: {
      ret: "/customer/money-transfer",
      dd: "/customer/money-transfer",
      default: "/money-transfer",
    },
    roles: ["ret", "dd"],
    permissionKey: "dmt1",
  },

  // Fund Transfer
  {
    title: "Fund Transfer",
    icon: fundReqImage,
    icon2: "🛠️",
    to: {
      ret: "/customer/transfer",
      dd: "/customer/transfer",
    },
    roles: ["ret", "dd"],
  },

  // AEPS
  {
    title: "AEPS",
    icon: aepsImage,
    icon2: "👥",
    to: {
      ret: "/customer/aeps",
      dd: "/customer/aeps",
    },
    roles: ["ret", "dd"],
    permissionKey: "aeps1",
  },

  // BBPS Online
  {
    title: "BBPS Online",
    icon: bbps_1,
    icon2: "📒",
    to: {
      ret: "/customer/bbps",
      dd: "/customer/bbps",
    },
    roles: ["ret", "dd"],
    // permissionKey: "bbps_online",
  },

  // BBPS Offline
  {
    title: "BBPS Offline",
    icon: serviceImage,
    icon2: "🛠️",
    to: {
      ret: "/customer/bbps-offline",
      dd: "/customer/bbps-offline",
    },
    roles: ["ret", "dd"],
    permissionKey: "bbps_offline",
  },

  // CMS
  {
    title: "CMS",
    icon: cmsImage,
    icon2: "📒",
    to: {
      ret: "/customer/cms",
      dd: "/customer/cms",
    },
    roles: ["ret", "dd"],
    // permissionKey: "cms",
  },

  // Wallet Transfer
  {
    title: "Wallet Transfer",
    icon: walletTransferImage,
    icon2: "🛠️",
    to: {
      ret: "/customer/wallet-transfer",
      dd: "/customer/wallet-transfer",
      di: "/di/wallet-transfer",
      md: "/md/wallet-transfer",
    },
    roles: ["ret", "di", "md", "dd"],
    permissionKey: "wallet_transfer",
  },

  // Fund Request
  {
    title: "Fund Request",
    icon: fundReqImage,
    icon2: "🛠️",
    to: {
      adm: "/admin/fund-request",
      sadm: "/admin/fund-request",
      ret: "/customer/fund-request",
      dd: "/customer/fund-request",
      md: "/md/fund-request",
      api: "/api/fund-request",
      di: "/di/fund-request",
    },
    roles: ["sadm", "adm", "ret", "md", "api", "dd", "di"],
    permissionKey: "fund_req",
  },

  // Transactions
  {
    title: "Transactions",
    icon: transImage,
    icon2: "💳",
    to: {
      adm: "/admin/transactions",
      sadm: "/admin/transactions",
      ret: "/customer/transactions",
      dd: "/customer/transactions",
      di: "/di/transactions",
      asm: "/asm/transcations",
      zsm: "/zsm/transcations",
      api: "/api/transcations",
      md: "/md/transcations",
    },
    roles: ["sadm", "adm", "ret", "di", "asm", "zsm", "api", "md", "dd"],
    permissionKey: "txn",
  },

  {
    title: "Bankings",
    icon: bankImage,
    icon2: "🏦",
    to: {
      adm: "/admin/bankings",
      sadm: "/admin/bankings",
    },
    permissionKey: "banking",
    roles: ["adm", "sadm"],
  },

  // Services
  {
    title: "Services",
    icon: serviceImage,
    icon2: "🛠️",
    to: {
      adm: "/admin/services",
      sadm: "/admin/services",
      ret: "/customer/allServices",
      dd: "/customer/allServices",
    },
    roles: ["adm", "ret", "dd", "sadm"],
  },

  // Wallet Ledger
  {
    title: "Wallet Ledger",
    icon: walletLdgerImage,
    icon2: "📒",
    to: {
      adm: "/admin/wallet-ledger",
      sadm: "/admin/wallet-ledger",
      ret: "/customer/wallet-ledger",
      dd: "/customer/wallet-ledger",
      di: "/di/wallet-ledger",
      asm: "/asm/wallet-ledger",
      zsm: "/zsm/wallet-ledger",
      md: "/md/wallet-ledger",
    },
    roles: ["sadm", "adm", "ret", "di", "asm", "zsm", "md", "dd"],
  },

  // Settings
  {
    title: "Settings",
    icon: settingImage,
    icon2: "⚙️",
    to: {
      adm: "/admin/settings",
      sadm: "/admin/settings",
    },
    permissionKey: "settings",
    roles: ["adm", "sadm"],
  },

  // Complaint
  {
    title: "Complaint",
    icon: complainImage,
    icon2: "📝",
    to: {
      adm: "/admin/complaint",
      sadm: "/admin/complaint",
      ret: "/customer/complaint",
      dd: "/customer/complaint",
      api: "/api/complaint",
    },
    roles: ["adm", "ret", "api", "dd", "sadm"],
  },

  // Risk
  {
    title: "Risk",
    icon: riskImage,
    icon2: "⚠️",
    to: {
      adm: "/admin/risk",
      sadm: "/admin/risk",
      ret: "/customer/risk",
      dd: "/customer/risk",
      di: "/di/risk",
    },
    roles: ["adm", "di", "sadm"],
    permissionKey: "",
  },

  // Login History
  {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "📱",
    to: {
      adm: "/admin/login_history",
      sadm: "/admin/login_history",
      ret: "/customer/login_history",
      dd: "/customer/login_history",
      di: "/di/login_history",
      asm: "/asm/login_history",
      zsm: "/zsm/login_history",
      md: "/md/login_history",
    },
    roles: ["adm", "ret", "di", "asm", "zsm", "md", "dd", "sadm"],
    permissionKey: "",
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
  adm: {
    default: [
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
    // 1: ["Services", "Transactions", "Wallet Ledger", "Risk"], // Layout 1
  },
  sadm: {
    default: [
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
    // 1: ["Services", "Transactions", "Wallet Ledger", "Risk"], // Layout 1
  },
  md: {
    default: [
      "Dashboard",
      "Users",
      "Fund Request",
      "Transactions",
      "Wallet Transfer",
      "Wallet Ledger",
      "Login History",
    ],
    // 1: ["Services", "Transactions", "Wallet Ledger", "Risk"],
  },
  di: {
    default: [
      "Dashboard",
      "Users",
      "Transactions",
      "Fund Request",
      "Wallet Transfer",
      "Wallet Ledger",
      // "Risk",
      "Login History",
    ],
    // 1: ["Services", "Transactions", "Wallet Ledger", "Risk"],
  },
  ret: {
    default: [
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
    2: [
      "Dashboard",
      "Services",
      "Fund Request",
      "Transactions",
      "Complaint",
      "Wallet Ledger",
      "Risk",
      "Login History",
    ],
  },
  dd: {
    default: [
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
    2: [
      "Dashboard",
      "Services",
      "Fund Request",
      "Transactions",
      "Wallet Ledger",
      "Complaint",
      "Risk",
    ],
  },
  asm: {
    default: [
      "Manage Users",
      "Transactions",
      "Wallet Ledger",
      "Transactions",
      "Login History",
    ],
    // 1: ["Services", "Transactions", "Wallet Ledger", "Risk"],
  },
  zsm: {
    default: [
      "Dashboard",
      "Manage Users",
      "Wallet Ledger",
      "Transactions",
      "Login History",
    ],
    // 1: ["Services", "Transactions", "Wallet Ledger", "Risk"],
  },
  api: {
    default: ["Dashboard", "Fund Request", "Transactions", "Complaint"],
    // 1: ["Services", "Transactions", "Wallet Ledger", "Risk"],
  },
};

export const buildNavForRole = (role, permissions = {}, layout = "default") => {
  if (!role) return [];

  // Get allowed nav items for this role
  let allowedItems = navConfig.filter((item) => item.roles.includes(role));

  // Pick hierarchy for this role and layout
  const hierarchyObj = roleHierarchy[role] || {};
  const hierarchy = hierarchyObj[layout] || hierarchyObj.default || [];

  // Filter nav items according to hierarchy and permissions
  return hierarchy
    .map((title) =>
      allowedItems.find((item) => {
        // If role is 'sadm', skip permission check completely
        if (role === "sadm") return item.title === title;

        // Otherwise, check permission normally
        const hasPermission =
          !item.permissionKey || permissions[item.permissionKey];
        return item.title === title && hasPermission;
      })
    )
    .filter(Boolean); // remove undefined
};
