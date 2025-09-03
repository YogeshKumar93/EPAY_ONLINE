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

// PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const isAuthenticated = authCtx?.isAuthenticated;
  console.log("isAuthenticated", isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const RoleBasedRoutes = ({ user }) => {
  return (
    <Routes>
      {/* Admin routes */}
      {user?.role === "adm" ||
        (user?.role === "sadm" && (
          <>
            <Route path="admin/dashboard" element={<AdminTransactions />} />
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/transactions" element={<Dashboard />} />
            <Route path="admin/notification" element={<Notification />} />
            {/* Default redirect for admin */}
            <Route
              path="admin/*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </>
        ))}

      {/* Retailer & DD routes */}
      {(user?.role === "ret" || user?.role === "dd") && (
        <>
          <Route path="customer/dashboard" element={<AdminTransactions />} />
          <Route path="customer/services" element={<Dashboard />} />
          <Route path="customer/account-ledger" element={<AccountLadger />} />
          <Route path="customer/money-transfer" element={<DmtContainer />} />
          <Route path="customer/recharge-bill" element={<RechargeAndBill />} />
          <Route path="customer/purchase" element={<MyPurchase />} />
          <Route path="customer/fund-request" element={<FundRequest />} />
          <Route path="customer/sale" element={<MySale />} />
          {/* Default redirect for customer */}
          <Route
            path="customer/*"
            element={<Navigate to="/customer/dashboard" replace />}
          />
        </>
      )}
    </Routes>
  );
};

export default function AppRoutes() {
  const { user } = useContext(AuthContext);
  // console.log("user data", user);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        <Route path="customer/accounts" element={<Accounts />} />

        {/* Protected routes with layout */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <SideNavAndHeader
                userRole={user?.role}
                userName={user?.name || "Guest"}
                userAvatar="/path/to/avatar.jpg"
              />
            </PrivateRoute>
          }
        >
          {/* This is where the nested routes will be rendered */}
          <Route path="*" element={<RoleBasedRoutes user={user} />} />
        </Route>

        {/* Catch-all for non-existent routes */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
