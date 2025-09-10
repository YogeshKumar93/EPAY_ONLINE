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
import SelectLayout from "../pages/SelectLayout";
import { Recharge } from "../pages/Recharge";
import Navs from "../pages/Navs";
import AccountStatement from "../pages/AccountStatement";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  console.log("THe aufdgaegaee", isAuthenticated);
  if (loading) {
    return <div>Loading...</div>; // spinner or splash screen
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
export default function AppRoutes() {
  const { user } = useContext(AuthContext) || {};
  const role = user?.role;
  const isAdmin = role === "adm" || role === "sadm";
  const isCustomer = role === "ret" || role === "dd";
  const isDi = role === "di";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

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
              <Route path="admin/dashboard" element={<AdminTransactions />} />
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
              <Route path="admin/layout" element={<Layouts />} />
              <Route path="admin/commissionrule" element={<CommissionRule />} />
              <Route path="admin/sidenav" element={<Navs />} />
                <Route path="admin/selectlayout" element={<SelectLayout />} />
                <Route path="admin/statement" element={<AccountStatement />} />
              <Route
                path="admin/*"
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </>
          )}

          {/* CUSTOMER (ret, dd) */}
          {isCustomer && (
            <>
              <Route
                path="customer/dashboard"
                element={<AdminTransactions />}
              />
              <Route path="customer/services" element={<Dashboard />} />
              <Route
                path="customer/account-ledger"
                element={<AccountLadger />}
              />
              <Route path="customer/logs" element={<RetailerLogs />} />
              <Route
                path="customer/money-transfer"
                element={<DmtContainer />}
              />
              <Route
                path="customer/fund-transfer"
                element={<SuperTransfer />}
              />
              <Route
                path="customer/upi-transfer"
                element={<SuperTransfer />}
              />
              <Route
                path="customer/transactions"
                element={<Transaction />}
              />
              <Route
                path="customer/recharge-bill"
                element={<Recharge />}
              />
              <Route path="customer/purchase" element={<MyPurchase />} />
              <Route path="customer/fund-request" element={<FundRequest />} />
              <Route path="customer/sale" element={<MySale />} />
              
              <Route path="customer/profile" element={<ProfilePage />} />
            
              <Route
                path="customer/*"
                element={<Navigate to="/customer/dashboard" replace />}
              />
              <Route path="customer/accounts" element={<Accounts />} />
            </>
          )}
          {isDi && (
            <>
              <Route
                path="di/dashboard"
                element={<AdminTransactions />}
              />
              <Route path="di/services" element={<Dashboard />} />
              <Route
                path="customer/account-ledger"
                element={<AccountLadger />}
              />
              <Route path="customer/logs" element={<RetailerLogs />} />
              <Route
                path="customer/money-transfer"
                element={<DmtContainer />}
              />
              <Route
                path="customer/recharge-bill"
                element={<RechargeAndBill />}
              />
              <Route path="customer/purchase" element={<MyPurchase />} />
              <Route path="customer/fund-request" element={<FundRequest />} />
              <Route path="customer/sale" element={<MySale />} />
         
              <Route path="customer/profile" element={<ProfilePage />} />
        
              <Route
                path="customer/*"
                element={<Navigate to="/customer/dashboard" replace />}
              />
              <Route path="customer/accounts" element={<Accounts />} />
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
