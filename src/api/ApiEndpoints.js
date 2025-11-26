// export const BASE_URL = "https://api.impsguru.com/";
// export const BASE_URL = "https://uat.impsguru.com/";
// export const BASE_URL = "https://api.dillipay.com/";
// export const BASE_URL = "http://192.168.1.14/impsguru-php/";
// export const BASE_URL = "https://newapi.impsguru.com/";

export const BASE_URL = "https://api.epaysolutions.online/";
// export const BASE_URL = "https://api.transup.in/";
// export const BASE_URL = "https://api.p2pae.com/";

const ApiEndpoints = {
  COOKIE: "sanctum/csrf-cookie",

  REQUEST_HASH: "auth/signRequest",
  GET_LOGIN_HISTORY: "user/getLoginHistory",

  GET_FILES: "user/getFile",
  AGEMENT_DATE: "admin/aggreementDate",
  SEND_OTP_Okyc: "user/sendOtpOkyc",
  VERIFY_OTP_OKYC: "user/verifyOtpOkyc",

  GET_ME_USER: "user/getUser",

  OBTAIN_DOCS: "auth/getDocs",
  GET_RECENT_DATA: "reports/recentHistory",
  GET_USERS: "user/getUsers",
  GET_USERS_ACC: "",
  VERIFY_PIC: "admin/approveRejectKyc",


  GET_USER_BY_USERNAME: "auth/getUserByUsername",
  GET_USER_BY_ID: "admin/getUserById",
  
  USER_PROFIT: "admin/userProfitability",
  DELETE_USER: "admin/deleteUser",
  API_USERS_CHARGES: "admin/charges",

  API_USERS_KEYS: "admin/userKeys",
  BLOCK_UNBLOCK: "admin/blockUnblock",
  GET_TRANSACTIONS: "admin/getTransactions",
  GET_ACC_TRANSACTIONS: "",

  ADD_BANK: "admin/createBank",

  GET_ROUTE: "admin/getRoutes",
  GET_CATEGORIES: "admin/getCategories",

  GET_BANK_BALANCE: "bank/getBankBalance",
  
  CREATE_WHITE_LISTED_ACCOUNT: "risk/createWhiteListedAccount",
  UPDATE_WHITE_LISTED_ACCOUNT: "risk/updateWhiteListedAccount",
  DELETE_WHITE_LISTED_ACCOUNT: "risk/deleteWhiteListedAccount",
  GET_WHITE_LISTED_ACCOUNT: "risk/getWhiteListedAccount",
   
  CREATE_BLACK_LISTED_ACCOUNT: "risk/createBlackListedAccount",
  UPDATE_BLACK_LISTED_ACCOUNT: "risk/updateBlackListedAccount",
  DELETE_BLACK_LISTED_ACCOUNT: "risk/deleteBlackListedAccount",
  GET_BLACK_LISTED_ACCOUNT: "risk/getBlackListedAccount",
  

  CHANGE_TWO_FA: "auth/changeTwoFa",
  // ****************************** NEW API'S ******************************
  SIGN_IN: "auth/signIn",
  LOGIN_OTP_VALIDATE: "auth/secureLogin",
  LOGOUT: "auth/Logout",
  FORGOT_PASS: "auth/forgetPassword",
  RESET_MPIN: "auth/resetMpin",
  RESEND_OTP: "auth/resendOtp",
  CHANGE_PASS: "auth/changePassword",
  CHANGE_MPIN: "auth/changeMpin",
  INITIATE_NUMBER: "auth/initiateChangeNumber",
  VERIFY_CHAGNE_NUMBER: "auth/verifyChangeNumber",
  CHANGE_ROLE: "auth/changeRole",
  GET_ACCOUNTS: "account/getAccounts",
  CREATE_ACCOUNT: "account/createAccount",
  DELETE_ACCOUNT: "account/deleteAccount",
  UPDATE_ACCOUNT: "account/updateAccount",
  GET_SERVICES: "service/getServices",
  CREATE_SERVICE: "service/createService",
  UPDATE_SERVICE: "service/updateService",
  GET_TEMPLATES: "template/getTemplates",
  CREATE_TEMPLATE: "template/createTemplate",
  UPDATE_TEMPLATE: "template/updateTemplate",
  DELETE_TEMPLATE: "template/deleteTemplate",
  GET_LOGS: "auditlog/getAuditLogs",
  DELETE_LOG: "auditlog/deleteAuditLog",
  GET_LOG: "auditlog/getAuditLog",

  UPDATE_CLAIMED_ENTRIES: "bankStatement/updateClaimedEntries",


  GET_BY_TYPE: "business/getByType",
  UPDATE_BY_TYPE: "business/updateByType",
  GET_ALL_BY_USER: "business/getAllByUser",
  APPROVE_REJECT_DOCS: "business/approveReject",


  LOGIN_HISTORY: "userDevice/getUserDevice",
  GET_WEBHOOKS: "webhook/getWebhook",
  GET_USER_DEBOUNCE: "user/getUserDebounce",
  GET_SENDER_UPI: "payout/getSenderUpi",

  // ****************************** NEW API'S ABOVE ******************************

  // dashboard apis.
  GET_TXN_SUMMARY: "dashboard/getRetTxnSummary",
  GET_SERVICE_WISE_PROFIT: "dashboard/getServiceWiseProfitSummary",
  GET_SERVICE_WISE_PROFIT_DI: "dashboard/getServiceWiseProfitSummaryForDi",
  GET_SERVICE_WISE_PROFIT_MD: "dashboard/getServiceWiseProfitSummaryForMd",
  GET_SERVICE_WISE_PROFIT_ADMIN: "dashboard/getServiceWiseProfitSummaryNew",
  // -------




  GET_BANKS: "bank/getBanks",

  QR_LOGIN: "auth/generateQr",
  QR_STATUS: "auth/qrStatus",
  // ****************************** NEW API'S ABOVE ******************************
  

  // bank statement apis
  GET_BANK_STATEMENTS: "bankStatement/getBankStatement",
  CREATE_BANK_STATEMENT: "bankStatement/createBankStatement",
  UPDATE_BANK_STATEMENT: "bankStatement/updateBankStatement",
  DELETE_BANK_STATEMENT: "bankStatement/deleteBankStatement",
  GET_BANK_STATEMENT_SCHEMA: "bankStatement/getBankStatementSchema",
  // -----

  GET_DASHBOARD1: "dashboard/getRoleWiseCounts",
  GET_DASHBOARD2: "dashboard/getServiceWiseSummary",
  GET_ACCOUNT_STATEMENTS: "accountStatement/getAccountStatement",
  CREATE_ACCOUNT_STATEMENT: "accountStatement/createAccountStatement",
  UPDATE_ACCOUNT_STATEMENT: "accountStatement/updateAccountStatement",
  GET_ACCOUNT_STATEMENT_SCHEMA: "accountStatement/getAccountStatementSchema",
  DELETE_ACCOUNT_STATEMENT: "account/deleteLastTransaction",
  CREATE_BANK_ADMIN: "bank/createBank",
  UPDATE_BANK: "bank/updateBank",
  DELETE_BANK: "bank/deleteBank",


  GET_ACCOUNT_SCHEMA: "account/getAccountSchema",
  GET_BANK_SCHEMA: "bank/getBankSchema",
  GET_NOTIFICATION_SCHEMA: "notification/getNotificationSchema",
  GET_COLOR_SCHEMA: "layout/colorSchema",
  GET_COLOURS: "layout/getColours",
  CREATE_COLOUR: "layout/createColour",
  UPDATE_COLOUR: "layout/updateColour",

  GET_SENDER: "payout/getSender",


  GET_UUID: "misc/getUuid",
  REFUND_TXN_BYADMIN: "refund/refundTxnByAdmin",


  REFUND_FAILED_TXN: "refund/failedTxn",
  REFUND_SUCCESS_TXN: "refund/successTxn",


  UPDATE_USER_PERMISSIONS: "user/updateUserPermissions",
  GET_PLANS_BY_OPERATOR: "recharge/getPlansByOperator",
  RECHARGE: "recharge/recharge",
  GET_SIDENAV: "layout/getSideNav",
  GET_ACCOUNT_STATEMENT: "accountStatement/getStatements",


  ASSIGN_PLAN: "plan/asignPlan",
  GET_PLAN_SCHEMA: "plan/getPlanSchema",
  GET_UPI_SCHEMA: "payout/getBeneficiarySchemaUpi",
  UPDATE_USER_STATUS: "user/blockAndUnblock",

  CHANGE_USER_LAYOUT: "user/changeLayout",


  BLOCK_UNBLOCK_SERVICE: "service/blockUnblock",
  CREATE_USER: "signup/createUser",
  GET_SIGNUP_SCHEMA: "signup/getSignupSchema",

  GET_ROUTES: "admin/getRoutes",
  DELETE_LAST_TXN: "bank/deleteLastTxn",
  DELETE_ACCOUNT_LAST: "account/deleteLastTxn",
  CREATE_BASIC: "business/createBasic",
  CREATE_CONTACT: "business/createContact",
  CREATE_ADDRESS: "business/createAddress",
  CREATE_IDENTIFICATION: "business/createIdentification",
  CREATE_BANK: "business/createBank",
  CREATE_DOCUMENTS: "business/createDocuments",
  CREATE_KYC: "business/createKyc",
  CREATE_STATUS: "business/createStatus",



  BASIC_SCHEMA: "business/basicSchema",
  CONTACT_SCHEMA: "business/contactSchema",
  ADDRESS_SCHEMA: "business/addressSchema",
  IDENTIFICATION_SCHEMA: "business/identificationSchema",
  BANK_SCHEMA: "business/bankSchema",
  DOCUMENTS_SCHEMA: "business/documentsSchema",
  KYC_SCHEMA: "business/kycSchema",
  STATUS_SCHEMA: "business/statusSchema",
  

  CREATE_ADMIN_COMMISSIONS: "commission/createAdminCommissionRule",
  UPDATE_ADMIN_COMMISSIONS: "commission/updateAdminCommissionRule",
  GET_ADMIN_COMMISSIONS_SCHEMA: "commission/getAdminCommissionSchema",

  UPDATE_USER_PROFILE_NEW: "user/updateProfileImage",



  // ****************************** NEW API'S ABOVE ******************************
  ADD_INST_ID: "auth/insertInstId",
  SEND_OTP: "user/sendOtp",
  GET_API_TOKEN: "user/getApiToken",
  GET_API_KEY: "user/getApiKey",
  RESET_API_TOKEN: "user/resetApiToken",
  RESET_API_KEY: "user/resetApiKey",
  GET_UNCLAIMED_ENTERIES: "bankStatement/getUnclaimedEntries",
  CHECK_STAUS: "",

  GET_SENDER_BY_ACC: "payout/getSenderByAcc",

  // wallet
  GET_NUMBER_INFO: "prepaid/getNumberInfo",


  VALIDATE_OTP: "dmr/validateRemitter",
  VALIDATE_DMT2: "dmr/validateRemitterDmt2",
  GET_USER_DEVICE: "userDevice/getUserDevice",
  NEW_VALIDATE_OTP: "dmr/verifyExpRemitter",
  VERIFY_REM_UPI: "dmr/verifyRemitterUpi",
  EKYC_INITIATE: "dmr/initiateEkyc",

  GET_BANK_DMR: "dmr/getBanks",
  // DMT2_BANK_LIST: "dmr/getBanksDmt2",
  DMT2_BANK_LIST: "dmr/getLiveBanksDmt2",
  ADD_BENE: "dmr/registerBeneficiary",
 

  VERIFY_ACC: "dmr/accountVerification",

  GET_TIME: "https://timeapi.io/api/time/current/zone?timeZone=Asia%2FKolkata",
};
export default ApiEndpoints;
