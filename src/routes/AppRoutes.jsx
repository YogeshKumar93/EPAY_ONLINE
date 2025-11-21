import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
 
import SideNavAndHeader from "../components/Layout/SideNavAndHeader";
import AuthContext from "../contexts/AuthContext";
import { useContext } from "react";
 
import Accounts from "../pages/Accounts"; 
 
import ProfilePage from "../components/MyProfile/Profile";
import Banks from "../pages/Banks";
 
 
import { Banking } from "../pages/Banking";
 
 
import Navs from "../pages/Navs";

import Statements from "../pages/Statements";

 
import BankStatements from "../pages/BankStatements";
import AccountStatement from "../pages/AccountStatement";
 
 
 
import Virtual_Accounts from "../pages/Virtual_Accounts";
import Login_History from "../pages/Login_History";
 
 
 
 

 

 
 
import OnBoarding from "../components/OnBoarding";
 
import BankStatementDesign from "../components/AEPS/BankStatementDesign";
 
// import Terms from "../pages/Terms";
import DownloadExcel from "../pages/DownloadExcel";
import UploadExcel from "../pages/UploadExcel";
import Unclaimed from "../pages/Unclaimed";
import VpaQrGenerator from "../pages/VpaQrGenerator";

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
    } else if (user.status === 3) {
      // ✅ Some other case → go to profile
      return <OnBoarding user={user} />;
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
  const isMd = role === "md";

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

        {/* <Route path="/aepsReceipt" element={<AepsReceipt />} /> */}

        {/* <Route path="/qrLogin" element={<QrLoginPage />} /> */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/print-receipt" element={<DmtReceipt1 />} />
        <Route path="/print-dmt" element={<PrintDmt />} />
        <Route path="/print-dmt2" element={<PrintDmt2 />} />
        <Route path="/print-aeps" element={<PrintAeps />} />
        <Route path="/print-bbps" element={<PrintBbps />} />
        <Route path="/print-recharge" element={<PrintRecharge />} />
        <Route path="/print-irctc" element={<PrintIrctc />} />
        <Route path="/print-payout" element={<PrintPayout />} />
        <Route path="/print-w2w" element={<PrintW2W />} />
        <Route path="/print-creditCard" element={<PrintCreditCard />} />
        <Route path="/terms-conditions" element={<Terms />} />
        <Route path="/bank-statement" element={<BankStatementDesign />} />
        <Route path="/adminagreement" element={<AdminAgreement />} /> */}
       
      

         

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
              {/* <Route path="admin/dashboard" element={<Dashboard />} /> */}
              {/* <Route path="admin/users" element={<Users />} /> */}
              {/* <Route path="admin/transactions" element={<Transaction />} /> */}
              {/* <Route path="admin/notification" element={<Notification />} /> */}
              {/* <Route path="admin/fund-request" element={<FundRequest />} /> */}
              <Route path="admin/accounts" element={<Accounts />} />
              {/* <Route path="admin/services" element={<Services />} /> */}
              <Route path="admin/bankings" element={<Banking />} />
              {/* <Route path="admin/settings" element={<Settings />} /> */}
              {/* <Route path="admin/templates" element={<Templates />} /> */}
              {/* <Route path="admin/logs" element={<Logs />} /> */}
              <Route path="admin/profile" element={<ProfilePage />} />
              <Route path="admin/banks" element={<Banks />} />
                <Route path="admin/unclaimed" element={<Unclaimed />} />
              {/* <Route path="admin/wallet-ledger" element={<WalletLedgers />} /> */}
              {/* <Route path="admin/purpose" element={<Purposes />} /> */}
              <Route path="admin/downloadexcel" element={<DownloadExcel />} />
              <Route path="admin/uploadexcel" element={<UploadExcel />} />

               <Route path="admin/vpaqr" element={<VpaQrGenerator />} />
              <Route
                path="admin/bankstatements/:id"
                element={<BankStatements />}
              />
              <Route
                path="admin/accountstatements"
                element={<AccountStatement />}
              />
              {/* <Route
                path="admin/wallet-transfer"
                element={<Wallet2WalletTransfer />}
              /> */}
              {/* <Route path="admin/layout" element={<Layouts />} /> */}
              {/* <Route path="admin/commissionrule" element={<CommissionRule />} /> */}
              <Route path="admin/sidenav" element={<Navs />} />
              {/* <Route path="admin/selectlayout" element={<SelectLayout />} /> */}
              {/* <Route path="admin/aeps" element={<Aeps />} /> */}
              {/* <Route path="admin/selectlayout" element={<Layouts />} /> */}

              <Route path="admin/statements" element={<Statements />} />
              {/* <Route path="admin/complaint" element={<Complaint />} /> */}
              {/* <Route path="admin/risk" element={<Risk />} /> */}
              {/* <Route path="admin/news" element={<News />} /> */}

              <Route
                path="admin/virtual_accounts"
                element={<Virtual_Accounts />}
              />
              <Route path="admin/login_history" element={<Login_History />} />
              {/* <Route path="admin/allServices" element={<AllServices />} /> */}
              {/* 
              <Route
                path="admin/*"
                element={<Navigate to="/admin/dashboard" replace />}
              /> */}
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
                    ? "/admin/banks"
                    : isCustomer
                    ? "/customer/banks"
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
