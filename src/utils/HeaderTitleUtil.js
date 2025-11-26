// ✅ Title Map role wise
const titleMap = {
  admin: {
    "/admin/dashboard": "Dashboard",
    "/admin/users": "Users",
    "/admin/employees": "Employees",
    "/admin/transactions": "Transactions",
    "/admin/scheme": "Schemes",
    "/admin/prabhu": "Prabhu Transfer",
    "/admin/login_history": "Login History",
    "/admin/fund-request": "Fund Requests",
    "/admin/accounts": "Accounts",
    "/admin/bankings": "Bankings",
    "/admin/banks": "Banks",
      "/admin/unclaimed": "Unclaimed",
    "/admin/settings": "Settings",
    "/admin/messages": "Messages",
    "/admin/claimed": "Claimed",
    "/admin/templates": "Templates",
    "/admin/commissionrule": "Commission Rules",
    "/admin/logs": "Logs",
    "/admin/selectlayout": "Layout",
    "/admin/profile": "My Profile",
    "/admin/operators": "Operators",
    "/admin/account-ledger": "Account Ledger",
    "/admin/wallet-ledger": "Wallet Ledger",
    "/admin/wallet-transfer": "Wallet Transfer",
    "/admin/notification": "Notifications",
    "/admin/prabhu-transactions": "Prabhu Transactions",
    "/admin/prabhu-customers": "Prabhu Customers",
    "/admin/routes": "Routes",
    "/admin/plans": "Plans",
    "/admin/complaint": "Complaints",
    "/admin/risk": "Risk",
    "/admin/banking": "Banking",
    "/admin/pg-orders": "PG Orders",
    "/admin/virtual_accounts": "Virtual Accounts",
    "/admin/invoice": "Invoices",
  },

 
 

 
};

// ✅ Dynamic title generator
export const setTitleFunc = (path, states = {}) => {
  let role = path.split("/")[1];

  const roleMap = titleMap[role] || {};

  let title = roleMap[path] || "";

  if (path === "/admin/accountstatements") {
    return `Account Statement : ${states.establishment} (${states.mobile})`;
  }
  if (path === "/customer/khata-statement") {
    return `Khata Statement : ${states.name} (${states.id})`;
  }
  if (path.startsWith("/admin/bankstatements/")) {
    return `Bank Statements : ${states.bank_name}  (${states.acc_number}) `;
  }
  

  return title;
};
