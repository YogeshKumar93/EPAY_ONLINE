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
    "/admin/settings": "Settings",
    "/admin/messages": "Messages",
    "/admin/services": "Services",
    "/admin/templates": "Templates",
    "/admin/commissionrule": "Commission Rules",
    "/admin/logs": "Logs",
    "/admin/selectlayout": "Layout",
    "/admin/my-profile": "My Profile",
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

  customer: {
    "/customer/dashboard": "Dashboard",
    "/customer/recharge": "Recharge/Bill Payments",
    "/customer/fund-request": "Fund Requests",
    "/customer/transactions": "Transactions",
    "/customer/account-ledger": "Account Ledger",
    "/customer/sale": "Sales",
    "/customer/transfer": "Transfer",
    "/customer/recharge-bill": "Recharge",
    "/customer/wallet-ledger": "Wallet Ledger",
    "/customer/purchase": "Purchase",
    "/customer/money-transfer": "Money Transfer",
    "/customer/express-transfer": "Express Transfer",
    "/customer/fund-transfer": "Fund Transfer",
    "/customer/settlements": "Settlements",
    "/customer/nepal-transfer": "Nepal Transfer",
    "/customer/upi-transfer": "UPI Transfer",
    "/customer/bbps": "BBPS (Online)",
    "/customer/bbpsoffline": "BBPS (Offline)",
    "/customer/aeps": "AEPS Services",
    "/customer/wallet-transfer": "Wallet Transfer",
    "/customer/payment_transfer": "Payments",
    "/customer/cms": "Cash Management System",
    "/customer/complaint": "Complaints",
    "/customer/khata-book": "Khata Book",
    "/customer/my-profile": "My Profile",
    "/customer/services": "Services",
    "/customer/loginHistory": "Login History",
    "/customer/invoice": "Invoices",
    "/customer/travel": "Travel Booking",
  },

  asm: {
    "/asm/dashboard": "Dashboard",
    "/asm/users": "Users",
    "/asm/transactions": "Transactions",
    "/asm/cred-req": "Fund Requests",
    "/asm/my-profile": "My Profile",
  },

  zsm: {
    "/zsm/dashboard": "Dashboard",
    "/zsm/users": "Users",
    "/zsm/transactions": "Transactions",
    "/zsm/cred-req": "Fund Requests",
    "/zsm/my-profile": "My Profile",
  },

  md: {
    "/md/dashboard": "Dashboard",
    "/md/users": "Users",
    "/md/cred-req": "Fund Requests",
    "/md/transactions": "Transactions",
    "/md/sale": "My Sale",
    "/md/purchase": "My Purchase",
    "/md/ledger": "My Ledger",
    "/md/my-profile": "My Profile",
    "/md/khata-book": "Khata Book",
  },

  ad: {
    "/ad/dashboard": "Dashboard",
    "/ad/users": "Users",
    "/ad/cred-req": "Fund Requests",
    "/ad/transactions": "Transactions",
    "/ad/sale": "My Sale",
    "/ad/purchase": "My Purchase",
    "/ad/ledger": "My Ledger",
    "/ad/my-profile": "My Profile",
    "/ad/khata-book": "Khata Book",
  },

  "api-user": {
    "/api-user/dashboard": "Dashboard",
    "/api-user/transactions": "Transaction",
    "/api-user/cred-req": "Fund Requests",
    "/api-user/invoice": "Invoices",
    "/api-user/my-profile": "My Profile",
  },

  // ✅ New DI role
  di: {
    "/di/dashboard": "Dashboard",
    "/di/users": "Users",
    "/di/transactions": "Transactions",
    "/di/cred-req": "Fund Requests",
    "/di/wallet-transfer": "Wallet Transfer",
    "/di/wallet-ledger": "Wallet Ledger",
    "/di/my-profile": "My Profile",
  },
};

// ✅ Dynamic title generator
export const setTitleFunc = (path, states = {}) => {
  let role = path.split("/")[1];

  const roleMap = titleMap[role] || {};

  let title = roleMap[path] || "";

  if (path === "/admin/accountStatement") {
    return `Account Statement ${states.acc_name} (${states.mobile})`;
  }
  if (path === "/customer/khata-statement") {
    return `Khata Statement ${states.name} (${states.id})`;
  }
  if (path === "/admin/bankStatement") {
    return `${states.bank_name} Bank Statement`;
  }

  return title;
};
