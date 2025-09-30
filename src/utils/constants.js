
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import PersonIcon from "@mui/icons-material/Person";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import Person2Icon from "@mui/icons-material/Person2";
import Person4Icon from "@mui/icons-material/Person4";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import TrainIcon from "@mui/icons-material/Train";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import ApiEndpoints from "../api/ApiEndpoints";
export const RDDeviceStatus = {
  UNKNOWN: "UNKNOWN",
  NOT_READY: "NOTREADY",
  READY: "READY",
  SCANNING: "SCANNING",
  SCAN_SUCCESS: "SUCCESS",
  SCAN_FAILED: "FAILED",
};
export const AEPS = {
  CASH_WITHDRAWAL: "WAP",
  BALANCE_ENQUIRY: "BAP",
  STATEMENT: "SAP",
  APAY: "MZZ",
};
// only for transaction page
export const columnOptions = [
  "Route",
  "OrderId",
  "Operator",
  "EST",
  "Number",
  "Info",
  "Amount",
  "Closing",
  "Status",
  "Action",
];
// only for transaction page
export const nonAdminColOptions = {
  dd: ["OrderId", "Operator", "Number", "Info", "Amount", "Closing", "Status"],
  ret: ["OrderId", "Operator", "Number", "Info", "Amount", "Closing", "Status"],
  ad: [
    "OrderId",
    "EST",
    "Operator",
    "Number",
    "Info",
    "Amount",
    "Closing",
    "Status",
  ],
  asm: [
    "OrderId",
    "EST",
    "Operator",
    "Number",
    "Info",
    "Amount",
    "Closing",
    "Status",
  ],
  api: ["OrderId", "Operator", "Number", "Info", "Amount", "Closing", "Status"],
};
// only for transaction page
export const searchOptions = {
  admin: [
    { field: "Number", parameter: "number" },
    { field: "Account", parameter: "ben_acc" },
    { field: "Username", parameter: "username" },
  ],
  ad: [
    { field: "Number", parameter: "number" },
    { field: "Account", parameter: "ben_acc" },
  ],
  dd: [
    { field: "Number", parameter: "number" },
    { field: "Account", parameter: "ben_acc" },
  ],
  ret: [
    { field: "Number", parameter: "number" },
    { field: "Account", parameter: "ben_acc" },
  ],
  asm: [
    { field: "Number", parameter: "number" },
    { field: "Account", parameter: "ben_acc" },
  ],
  api: [
    { field: "Number", parameter: "number" },
    { field: "Account", parameter: "ben_acc" },
  ],
};

// NEPAL CONSTANTS

export const customerType = [
  { label: "Salaried", value: 1 },
  { label: "Self Employed including Professional", value: 2 },
  { label: "Farmer", value: 3 },
  { label: "Housewife", value: 4 },
];

export const SourceIncomeType = [
  { label: "Govt", value: 1 },
  { label: "Public sector", value: 2 },
  { label: "Private Sector", value: 3 },
  { label: "Business", value: 4 },
  { label: "Agriculture", value: 5 },
  { label: "Dependent", value: 6 },
];

export const annualIncome = [
  { label: "₹ 0.00 lacs - ₹ 2.00 Lacs", value: 1 },
  { label: "₹ 2.00 Lacs - ₹ 5 Lacs", value: 2 },
  { label: "₹ 5 Lacs - ₹ 10 Lacs", value: 3 },
  { label: "More than ₹ 10 Lacs", value: 4 },
];

export const genders = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Others", value: "OTHERS" },
];

export const PROJECTS = {
  imps: "TRANSUP",
  paisakart: "PaisaKart",
  moneyoddr: "MoneyOddr",
};

export const AEPS_TYPE = {
  AEPS1: "aeps1",
  AEPS2: "aeps2",
  BOTH: "both",
};
export const TWOFASTATUS = {
  LOGINREQUIRED: "LOGINREQUIRED",
  LOGGEDIN: "LOGGEDIN",
};
export const COMPLAINT_STATUS = [
  {
    label: "Open",
    value: "OPEN",
  },
  {
    label: "Closed",
    value: "CLOSED",
  },
];

export const PRABHUTXN_TYPE = {
  PRABHU: ApiEndpoints.NEPAL_TRANSACTION,
  UNVERIFIED: ApiEndpoints.NEPAL_UVTRANSACTION,
  COMPLIANCE: ApiEndpoints.NEPAL_COMPLIANCE_TRANSACTION,
};
export const vendor_tab_value = {
  0: "express",
  1: "super",
};

export const USER_ROLES = {
  ADMIN: "Admin",
  ASM: "Asm",
  API: "Api",
  ACC: "Acc",
  RET: "Ret",
  DD: "Dd",
  MD: "Md",
  AD: "Ad",
};

export const ROLE_LIST = [
  {
    label: "Corporates",
    value: "Api",
  },
  {
    label: "Zonal Sales Manager",
    value: "Zsm",
  },
  {
    label: "Sales Manager",
    value: "Asm",
  },
  {
    label: "Area Distributor",
    value: "Ad",
  },
  {
    label: "Direct Dealer",
    value: "Dd",
  },
  {
    label: "Retailer",
    value: "Ret",
  },
];

export const OPERATORLIST = [
  {
    label: "AIR",
    value: "AIR",
  },
  {
    label: "JIO",
    value: "JIO",
  },
  {
    label: "VOD",
    value: "VOD",
  },
  {
    label: "IDE",
    value: "IDE",
  },
];

export const ROLE_LIST4AD = [
  {
    label: "Corporates",
    value: "Api",
  },
  {
    label: "Retailer",
    value: "Ret",
  },
];

// PIPE CONSTANTS USED IN ADMIN OPERATOR TABLE
export const PIPES = [
  { label: "Bank 1", value: "bank1" },
  { label: "Bank 2", value: "bank2" },
  { label: "Bank 3", value: "bank3" },
];

export const BOM = {
  id: 1,
  CityCode: "BOM",
  CityName: "Mumbai",
  CountryName: "India",
  Synonyms: "Bombay",
  AirportName: "Chhatrapati Shivaji International Airport",
  Domestic: 1,
  ActiveStatus: 1,
  TimeStamp: "0900.0",
  Continent: "Asia",
  Lattitude: "19.0912",
  Logitude: "72.866",
  Otherame: "Chatrapati Shivaji",
  CountryCounter: "0",
  created_at: "2023-08-15T05:08:13.000000Z",
  updated: "2023-08-15 05:08:13",
};
export const DEL = {
  id: 2,
  CityCode: "DEL",
  CityName: "New Delhi",
  CountryName: "India",
  Synonyms: "Delhi|Dilli",
  AirportName: "Indira Gandhi International Airport",
  Domestic: 1,
  ActiveStatus: 1,
  TimeStamp: "0900.0",
  Continent: "Asia",
  Lattitude: "28.5632",
  Logitude: "77.1183",
  Otherame: "Idira Gadhi",
  CountryCounter: "0",
  created_at: "2023-08-15T05:08:13.000000Z",
  updated: "2023-08-15 05:08:13",
};
export const BOOKINGSTEP = {
  REVIEW: "REVIEW",
  TRAVELLERS: "TRAVELLERS",
  PAYMENT: "PAYMENT",
};

export const paymentModes = [
  {
    name: "IMPS",
    style: {
      backgroundColor: "#70AD47",
      color: "#fff",
      borderColor: "#70AD47",
    },
  },
  {
    name: "NEFT",
    style: {
      backgroundColor: "#5B9BD5",
      color: "#fff",
      borderColor: "#5B9BD5",
    },
  },
  {
    name: "UPI",
    style: {
      backgroundColor: "#3d5a80",
      color: "#fff",
      borderColor: "#3d5a80",
    },
  },
];

export const BeneKycStatus = [
  { label: "Completed", value: "1" },
  { label: "Pending", value: "2" },
  { label: "Not Done", value: "0" },
];
export const PaymentMethods = [
  { label: "Paytm", value: "paytm" },
  { label: "PhonePe", value: "ybl" },
  { label: "Google Pay (okhdfcbank)", value: "okhdfcbank" },
  { label: "Google Pay (okicici)", value: "okicici" },
  { label: "Google Pay (oksbi)", value: "oksbi" },
  { label: "Amazon Pay", value: "apl" },
  { label: "BHIM", value: "upi" },
  { label: "ICICI Bank", value: "icici" },
  { label: "HDFC Bank", value: "hdfcbank" },
  { label: "Axis Bank", value: "axisbank" },
  { label: "SBI (State Bank of India)", value: "sbi" },
  { label: "Kotak Mahindra Bank", value: "kotak" },
  { label: "Punjab National Bank (PNB)", value: "pnb" },
  { label: "Bank of Baroda", value: "barodampay" },
  { label: "Yes Bank", value: "yesbank" },
  { label: "Other", value: "Other" },
];

export const mt_tab_value = {
  0: "dmt1",
  1: "dmt2",
  2: "express",
  3: "super",
  4: "nepal",
  5: "upi",
};
export const cms_tab_value = {
  0: "cms1",
  1: "cms2",
};
export const Transaction_Tab = {
  0: "",
  1: "PREPAID",
  2: "DTH",
  3: "UTILITY",
  4: "VERIFICATION",
  5: "MONEY TRANSFER",
  6: "COLLECTIONS",
  7: "IRCTC",
  8: "PAYMENTS",
};
export const travel_Tab = {
  0: "AIR",
  1: "BUS",
  2: "HOTELS",
  3: "TRAIN",
};

export const Status = [
  { label: "APPROVED", value: "APPROVED" },
  { label: "REJECTED", value: "REJECTED" },
  { label: "PENDING", value: "PENDING" },
];

export const my_profile = {
  0: "personal",
  1: "business",
  2: "bank",
  3: "document",
  4: "authentication",
  5: "bc",
  6: "irctc",
};
export const Admin_profile = {
  0: "personal",
  1: "business",

  2: "document",
  3: "authentication",
  4: "service",
};
export const Categories = [
  {
    id: 1,
    name: "PREPAID",
    created_at: "2022-05-24T05:14:04.000000Z",
    updated_at: "2022-05-24T05:14:04.000000Z",
  },
  {
    id: 2,
    name: "DTH",
    created_at: "2022-05-24T05:14:04.000000Z",
    updated_at: "2022-05-24T05:14:04.000000Z",
  },
  {
    id: 3,
    name: "UTILITY",
    created_at: "2022-05-24T05:14:35.000000Z",
    updated_at: "2022-05-24T05:14:35.000000Z",
  },
  {
    id: 4,
    name: "VERIFICATION",
    created_at: "2022-05-24T05:14:35.000000Z",
    updated_at: "2022-05-24T05:14:35.000000Z",
  },
  {
    id: 5,
    name: "MONEY TRANSFER",
    created_at: "2022-05-24T05:15:00.000000Z",
    updated_at: "2022-05-24T05:15:25.000000Z",
  },
  {
    id: 6,
    name: "COLLECTIONS",
    created_at: "2022-05-24T05:15:00.000000Z",
    updated_at: "2022-05-24T05:15:00.000000Z",
  },
  {
    id: 7,
    name: "IRCTC",
    created_at: "2022-05-24T05:15:08.000000Z",
    updated_at: "2022-05-24T05:15:08.000000Z",
  },
  {
    id: 8,
    name: "ADMIN TRANSFER",
    created_at: "2022-05-24T05:16:19.000000Z",
    updated_at: "2022-08-22T07:44:44.000000Z",
  },
  {
    id: 9,
    name: "SECONDARY",
    created_at: "2022-05-24T05:16:19.000000Z",
    updated_at: "2022-05-24T05:16:19.000000Z",
  },
  {
    id: 10,
    name: "W2W TRANSFER",
    created_at: "2022-05-24T05:16:46.000000Z",
    updated_at: "2022-05-24T05:16:46.000000Z",
  },
  {
    id: 11,
    name: "PAYMENTS",
    created_at: "2022-05-24T05:16:46.000000Z",
    updated_at: "2022-05-24T05:16:46.000000Z",
  },
  {
    id: 12,
    name: "CMS",
    created_at: "2022-05-24T05:16:46.000000Z",
    updated_at: "2022-05-24T05:16:46.000000Z",
  },
];

export const formatInLakh = (num) => {
  const value = Number(num);

  // invalid / null / undefined / NaN
  if (!num || isNaN(value)) return "₹ 0.00 Lakh";

  // अगर value negative है
  if (value < 0) return `-₹ ${(Math.abs(value) / 100000).toFixed(2)} Lakh`;

  // Normal case
  return `₹ ${(value / 100000).toFixed(2)} Lakh`;
};
