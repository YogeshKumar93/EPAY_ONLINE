import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import SideNavAndHeader from "../components/Layout/SideNavAndHeader";
import AuthContext from "../contexts/AuthContext";
import { useContext } from "react";
import AdminTransactions from "../components/UI/AdminTransactions";
import AccountLadger from "../components/UI/AccountLadger";
import MyPurchase from "../components/UI/MyPurchase";
import MySale from "../components/UI/MySale";
import FundRequest from "../components/UI/FundRequest";
import DmtContainer from "../components/UI/MoneyTransfer/DMTcontainer";
import RechargeAndBill from "../components/UI/rechange and bill/RechargeAndBill";
import Accounts from "../pages/Accounts";
import Notification from "../components/Notification/Notification";
import Services from "../pages/Services";
import Templates from "../pages/Templates";
import Logs from "../pages/Logs";
import RetailerLogs from "../pages/RetailerLogs";
import ProfilePage from "../components/MyProfile/Profile";
import Banks from "../pages/Banks";
import { Transaction } from "../pages/Transaction";
import Layouts from "../pages/Layouts";
import CommissionRule from "../pages/CommissionRule";
import { Banking } from "../pages/Banking";
import { Settings } from "../pages/Settings";
import SuperTransfer from "../pages/SuperTransfer";
import { Recharge } from "../pages/Recharge";
import LandingPage from "../components/LandingPages/LandingPage";
import NavBar from "../components/LandingPages/Navbar";
import LandingPageIntro from "../components/LandingPages/LandingPageIntro";
import LandingPageIntro1 from "../components/LandingPages/LandingPageIntro1";
import LandingPageIntro2 from "../components/LandingPages/LandingPageIntro2";
import LandingPageIntro3 from "../components/LandingPages/LandingPageIntro3";
import Footer from "../components/LandingPages/Footer";
import LandingServices from "../components/LandingPages/LandingServices";
import LandingAboutUs from "../components/LandingPages/LandingAboutUs";
import LandingContactUs from "../components/LandingPages/LandingContactUs";
import Navs from "../pages/Navs";

import Statements from "../pages/Statements";

import UpiTransfer from "../pages/UpiTransfer";
import BankStatements from "../pages/BankStatements";
import AccountStatement from "../pages/AccountStatement";
import Aeps from "../pages/Aeps";
import AllServices from "../pages/AllServices";
import Dmt from "../pages/Dmt";
import Bbps from "../pages/Bbps";
import Wallet2WalletTransfer from "../pages/Wallet2WalletTransfer";
import W2wTransfer from "../pages/w2wTransfer";
import { SelectLayout } from "../pages/SelectLayout";
import Cms from "../pages/Cms";
import QrLoginPage from "../pages/QrLoginPage";
import BusinessDetails from "../components/BusinessDetails";
import Complaint from "../pages/Complaint";
import Risk from "../pages/Risk";
import Virtual_Accounts from "../pages/Virtual_Accounts";
import Login_History from "../pages/Login_History";
import KycPending from "../pages/KycPending";
import { MoneyTransfer } from "../components/UI/MoneyTransfer/MoneyTransfer";
import MD_Dashboard from "../pages/Dashboard";
import { Transfer } from "../pages/Transfer";
import DmtReceipt1 from "../pages/DmtReceipt1";
import PrintDmt from "../pages/printDmt";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (user) {
    if (user.status === 1) {
      // ✅ KYC approved → allow access
      return children;
    } else if (user.status === 2) {
      // ✅ KYC pending
      return <KycPending />;
    } else if (user.status > 2) {
      // ✅ Some other case → go to profile
      return <ProfilePage user={user} />;
    }
  }

  // 🚨 Not logged in
  return <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  const { user } = useContext(AuthContext) || {};
  const role = user?.role;
  const isAdmin = role === "adm" || role === "sadm";
  const isCustomer = role === "ret" || role === "dd";
  const isDi = role === "di";
  const isAsm = role === "asm";
  const isZsm = role === "zsm";
  const isApi = role === "api";
  const isMd = role === "api";

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="" element={<LandingPage />}/>
          <Route path="navbar" element={<NavBar />} />
          <Route path="footer" element={<Footer />} />
          <Route path="landingservices" element={<LandingServices />} />
          <Route path="landingaboutus" element={<LandingAboutUs />} />
          <Route path="landingcontactus" element={<LandingContactUs />} />
          <Route path="landingpageintro" element={<LandingPageIntro />} />
          <Route path="landingpageintro1" element={<LandingPageIntro1 />} />
          <Route path="landingpageintro2" element={<LandingPageIntro2 />} />
          <Route path="landingpageintro3" element={<LandingPageIntro3 />} /> */}

        <Route path="/login" element={<QrLoginPage />} />
        <Route path="/print-receipt" element={<DmtReceipt1 />} />
         <Route path="/print-dmt" element={<PrintDmt />} />

        {/* Protected layout */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <SideNavAndHeader
                userRole={role}
                userName={user?.name || "Guest"}
                userAvatar="/path/to/avatar.jpg"
              />
            </PrivateRoute>
          }
        >
          {/* ADMIN */}
          {isAdmin && (
            <>
              <Route path="admin/dashboard" element={<Dashboard />} />
              <Route path="admin/users" element={<Users />} />
              <Route path="admin/transactions" element={<Transaction />} />
              <Route path="admin/notification" element={<Notification />} />
              <Route path="admin/fund-request" element={<FundRequest />} />
              <Route path="admin/accounts" element={<Accounts />} />
              <Route path="admin/services" element={<Services />} />
              <Route path="admin/bankings" element={<Banking />} />
              <Route path="admin/settings" element={<Settings />} />
              <Route path="admin/templates" element={<Templates />} />
              <Route path="admin/logs" element={<Logs />} />
              <Route path="admin/profile" element={<ProfilePage />} />
              <Route path="admin/banks" element={<Banks />} />
              <Route path="admin/wallet-ledger" element={<AccountLadger />} />
              <Route
                path="admin/bankstatements/:id"
                element={<BankStatements />}
              />
              <Route
                path="admin/accountstatements/:id"
                element={<AccountStatement />}
              />
              <Route
                path="admin/wallet-transfer"
                element={<Wallet2WalletTransfer />}
              />
              <Route path="admin/layout" element={<Layouts />} />
              <Route path="admin/commissionrule" element={<CommissionRule />} />
              <Route path="admin/sidenav" element={<Navs />} />
              <Route path="admin/selectlayout" element={<SelectLayout />} />
              <Route path="admin/aeps" element={<Aeps />} />
              <Route path="admin/selectlayout" element={<Layouts />} />

              <Route path="admin/statements" element={<Statements />} />
              <Route path="admin/complaint" element={<Complaint />} />
              <Route path="admin/risk" element={<Risk />} />
              <Route
                path="admin/virtual_accounts"
                element={<Virtual_Accounts />}
              />
              <Route path="admin/login_history" element={<Login_History />} />

              {/* 
              <Route
                path="admin/*"
                element={<Navigate to="/admin/dashboard" replace />}
              /> */}
            </>
          )}

          {/* CUSTOMER (ret, dd) */}
          {isCustomer && (
            <>
              <Route path="customer/dashboard" element={<Dashboard />} />
              <Route path="customer/services" element={<Dashboard />} />
              <Route path="customer/transfer" element={<Transfer />} />
              <Route
                path="customer/account-ledger"
                element={<AccountLadger />}
              />
              <Route path="customer/retailerlogs" element={<RetailerLogs />} />
              <Route
                path="customer/money-transfer"
                element={<MoneyTransfer />}
              />
          
              <Route
                path="customer/wallet-transfer"
                element={<Wallet2WalletTransfer />}
              />
              <Route
                path="customer/wallet-ledger"
                element={<AccountLadger />}
              />
              <Route path="customer/w2w-transfer" element={<W2wTransfer />} />
              {/* <Route path="customer/upi-transfer" element={<UpiTransfer />} /> */}
              <Route path="customer/transactions" element={<Transaction />} />
              <Route path="customer/recharge-bill" element={<Recharge />} />
              <Route path="customer/purchase" element={<MyPurchase />} />
              <Route path="customer/fund-request" element={<FundRequest />} />
              <Route path="customer/sale" element={<MySale />} />
              <Route path="customer/aeps" element={<Aeps />} />
              <Route path="customer/bbps" element={<Bbps />} />
              <Route path="customer/profile" element={<ProfilePage />} />
              <Route path="customer/cms" element={<Cms />} />
              {/* <Route path="customer/print-dmt" element={<PrintDmt />} /> */}

              <Route
                path="customer/*"
                element={<Navigate to="/customer/dashboard" replace />}
              />
              <Route path="customer/accounts" element={<Accounts />} />
              <Route path="customer/allServices" element={<AllServices />} />
            </>
          )}
          {isDi && (
            <>
              <Route path="di/dashboard" element={<AdminTransactions />} />
              <Route path="di/users" element={<Users />} />

              <Route path="di/wallet-ledger" element={<AccountLadger />} />
              <Route path="di/transactions" element={<Transaction />} />
              <Route
                path="di/wallet-transfer"
                element={<Wallet2WalletTransfer />}
              />
                  <Route path="di/profile" element={<ProfilePage />} />
            </>
          )}

          {isAsm && (
            <>
              <Route path="asm/dashboard" element={<Dashboard />} />
              <Route path="asm/users" element={<Users />} />
              <Route path="asm/transcations" element={<Transaction />} />
                  <Route path="di/profile" element={<ProfilePage />} />
            </>
          )}

          {isZsm && (
            <>
              <Route path="zsm/dashboard" element={<Dashboard />} />
              <Route path="zsm/users" element={<Users />} />
              <Route path="zsm/transcations" element={<Transaction />} />
                  <Route path="zsm/profile" element={<ProfilePage />} />
            </>
          )}

          {isApi && (
            <>
              <Route path="api/dashboard" element={<Dashboard />} />
              <Route path="api/users" element={<Users />} />
              <Route path="api/transcations" element={<Transaction />} />
                  <Route path="api/profile" element={<ProfilePage />} />
            </>
          )}

          {isMd && (
            <>
              <Route path="md/dashboard" element={<MD_Dashboard />} />
              <Route path="md/users" element={<Users />} />
              <Route path="md/transcations" element={<Transaction />} />
                  <Route path="md/profile" element={<ProfilePage />} />
            </>
          )}

          {/* Fallback inside protected area */}
          <Route
            path="*"
            element={
              <Navigate
                replace
                to={
                  isAdmin
                    ? "/admin/dashboard"
                    : isCustomer
                    ? "/customer/dashboard"
                    : "/login"
                }
              />
            }
          />
        </Route>

        {/* Final catch-all for non-matching + not authed */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
