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
  failed_vdo,
  fundReqImage,
  loginHistoryImage,
  paytm_img,
  profileNewImage,
  rechargeNew,
  riskImage,
  sendmoney,
  sendmoney2,
  serviceImage,
  settingImage,
  settingNew,
  transaction,
  transImage,
  upiWeb,
  usersImage,
  virtuanAccountImage,
  walletLdgerImage,
  walletLedgerImg,
  walletTransferImage,
} from "../../iconsImports";

export const navConfig = [
  // Dashboard
  // {
  //   title: "Dashboard",
  //   icon: dashboardImage,
  //   icon2: "📊",
  //   to: {
  //     adm: "/admin/dashboard",
  //     sadm: "/admin/dashboard",
     
  //   },
  //   roles: ["sadm", "adm", ],
  // },

  // Manage Users
  // {
  //   title: "Manage Users",
  //   icon: usersImage,
  //   icon2: "👥",
  //   to: {
  //     adm: "/admin/users",
  //     sadm: "/admin/users",
  //     asm: "/asm/users",
  //     zsm: "/zsm/users",
  //     md: "/md/users",
  //   },
  //   roles: ["adm", "sadm", "asm", "zsm", "md"],
  // },

  

  

   

 

  

  

 

 
 

  ,

  {
    title: "Banks",
    icon: bankImage,
    icon2: "🏦",
    to: {
      adm: "/admin/banks",
      sadm: "/admin/banks",
    },
    permissionKey: "banks",
    roles: ["adm", "sadm"],
  },

   {
    title: "Accounts",
    icon: virtuanAccountImage,
    icon2: "🏦",
    to: {
      adm: "/admin/accounts",
      sadm: "/admin/accounts",
    },
    permissionKey: "accounts",
    roles: ["adm", "sadm"],
  },
 
 {
    title: "Unclaimed",
    icon: riskImage,
    icon2: "🏦",
    to: {
      adm: "/admin/unclaimed",
      sadm: "/admin/unclaimed",
    },
    permissionKey: "unclaimed",
    roles: ["adm", "sadm"],
  },
  

  // Settings
  // {
  //   title: "Settings",
  //   icon: settingImage,
  //   icon2: "⚙️",
  //   to: {
  //     adm: "/admin/settings",
  //     sadm: "/admin/settings",
  //   },
  //   permissionKey: "settings",
  //   roles: ["adm", "sadm"],
  // },

 

  

  // Login History
  {
    title: "Login History",
    icon: loginHistoryImage,
    icon2: "📱",
    to: {
      adm: "/admin/login_history",
      sadm: "/admin/login_history",
      
    },
    roles: ["adm","sadm"],
    permissionKey: "login_history",
  },

  // {
  //   title: "Users",
  //   icon: usersImage,
  //   icon2: "👥",
  //   to: {
  //     di: "/di/users",
  //     md: "/md/users",
  //     zsm: "/zsm/users",
  //     asm: "/asm/users",
  //   },
  //   roles: ["di", "asm", "zsm", "md"],
  // },
];
// Role-wise hierarchy
const roleHierarchy = {
  adm: {
    default: [
      // "Dashboard",
      // "Manage Users",
      // "Fund Request",
      // "Transactions",
       "Banks",
      "Accounts",
      "Unclaimed",
      // "Services",
      // "Wallet Ledger",
      // "Settings",
      // "Complaint",
      // "Risk",
      "Login History",
    ],
    // 1: ["Services", "Transactions", "Wallet Ledger", "Risk"], // Layout 1
  },
  sadm: {
    default: [
    //  "Dashboard",
      // "Manage Users",
      // "Fund Request",
      // "Transactions",
      "Banks",
      "Accounts",
      "Unclaimed",
      // "Services",
      // "Wallet Ledger",
      // "Settings",
      // "Complaint",
      // "Risk",
      "Login History",
    ],
    // 1: ["Services", "Transactions", "Wallet Ledger", "Risk"], // Layout 1
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
