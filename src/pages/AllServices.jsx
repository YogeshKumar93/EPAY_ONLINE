import React, { useContext, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Card,
  CardContent,
  useTheme,
  alpha,
  Container,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DashboardIcon from "@mui/icons-material/Dashboard";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  aeps1,
  plane_1,
  BBPS,
  broadband_1,
  bus_1,
  cms1,
  credit_card1,
  dth_1,
  electricity1,
  gas_1,
  insurance_1,
  landline_1,
  mt,
  moneyTransfer,
  postpaid_1,
  recharge,
  train_1,
  upi_1,
  vapy_1,
  water_1,
  airtel2,
  aepsImage,
  aepsaeps,
  sendmoney,
  thumbPrint,
  mobileRechargeNew,
  wallet1,
  bp,
} from "../iconsImports";
import SuperTransfer from "./SuperTransfer";

import AuthContext from "../contexts/AuthContext";
import { Recharge } from "./Recharge";
import UpiTransfer from "./UpiTransfer";
import Bbps from "./Bbps";
import Dmt from "./Dmt";
import Dmt2 from "./Dmt2";
import Aeps from "./Aeps";
import Cms from "./Cms";
import Prepaid from "../components/UI/rechange and bill/Prepaid";
import Dth from "../components/UI/rechange and bill/Dth";
import {
  AIR1,
  FINO,
  PG1,
  QRCODE1,
  TATAPOWER1,
  UBER1,
} from "../utils/iconsImports";
import { bg } from "date-fns/locale";
import { color } from "framer-motion";
import Wallet2WalletTransfer from "./Wallet2WalletTransfer";
import Wallet2Wallet1 from "./Wallet2Wallet1";
import Aeps2 from "./Aeps2";
import AepsLayout2 from "./AepsLayout2";
import ComingSoon from "./ComingSoon";
import CreditCardBillPayment from "../components/CrediCardPayment/CreditCardBill";
import LevinFundTransfer from "./LevinFundTransfer";
import CreditCardBbps from "../components/CrediCardPayment/CreditCardBbps";
import BbpsBillers from "./BbpsBillers";
import BillPayments from "./BillPayments";
import W2wTransfer from "./w2wTransfer";
import LevinUpiTransfer from "./LevinUpiTransfer";

const MenuCard = ({ icon, label, onClick, isActive, user }) => {
  return (
    <Zoom in={true} style={{ transitionDelay: Math.random() * 80 + "ms" }}>
      <Box
        onClick={onClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 140,
          width: 140,
          borderRadius: 3,
          background: isActive
            ? "linear-gradient(135deg, #5210c1 0%, #7b3fe3 100%)"
            : "#F9FAFB",
          color: isActive ? "#FFF" : "#2E1065",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: isActive
            ? "0 6px 14px rgba(82, 16, 193, 0.4)"
            : "0 2px 6px rgba(0,0,0,0.08)",
          "&:hover": {
            transform: "translateY(-4px) scale(1.04)",
            boxShadow: "0 8px 16px rgba(123, 63, 227, 0.35)",
            background: isActive
              ? "linear-gradient(135deg, #5210c1 0%, #7b3fe3 100%)"
              : "linear-gradient(135deg, #F3E8FF 0%, #FFFFFF 100%)",
          },
          p: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Icon Container */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            mb: 1.5,
            borderRadius: "12px",
            backgroundColor: isActive
              ? "rgba(255,255,255,0.25)"
              : "rgba(37, 99, 235, 0.08)",
            transition: "all 0.3s ease",
            "& img": {
              width: "75%",
              height: "75%",
              objectFit: "contain",
            },
          }}
        >
          {typeof icon === "string" ? (
            <img src={icon} alt="icon" />
          ) : (
            React.createElement(icon, {
              sx: {
                fontSize: 22,
                color: isActive ? "#FFF" : "#2563EB",
              },
            })
          )}
        </Box>

        {/* Label */}
        <Typography
          sx={{
            fontWeight: 800, // max bold
            textAlign: "center",
            lineHeight: 1,
            letterSpacing: "0.3px",
            color: isActive ? "#FFF" : "#1E3C72",
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "130px",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Zoom>
  );
};

const SubMenuCard = ({ icon, label, onClick, isActive, user }) => {
  return (
    <Fade in={true} style={{ transitionDelay: Math.random() * 100 + "ms" }}>
      <Box
        onClick={onClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: { xs: 80, sm: 120 },
          width: { xs: 80, sm: 150 },

          borderRadius: 2.5,
          background: isActive
            ? "linear-gradient(135deg, #5210c1 0%, #7b3fe3 100%)"
            : "linear-gradient(135deg, #F5F4FA 0%, #FFFFFF 100%)",
          color: isActive ? "#FFF" : "#2B1A4C",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isActive
            ? "0 6px 12px rgba(82, 16, 193, 0.2)"
            : "0 3px 8px rgba(0,0,0,0.06)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: isActive
              ? "0 8px 16px rgba(82, 16, 193, 0.25)"
              : "0 6px 12px rgba(0,0,0,0.1)",
            background: isActive
              ? "linear-gradient(135deg, #5210c1 0%, #7b3fe3 100%)"
              : "linear-gradient(135deg, #E9E8F5 0%, #F5F4FA 100%)",
          },
          p: 1.2,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 60,
            height: 60,
            mb: 0.8,
            borderRadius: "50%",
            backgroundColor: isActive
              ? "rgba(255,255,255,0.2)"
              : "rgba(82, 16, 193, 0.08)",
            "& img": {
              width: "60%",
              height: "60%",
              objectFit: "contain",
            },
            transition: "all 0.2s ease",
          }}
        >
          {typeof icon === "string" ? (
            <img src={icon} alt="icon" />
          ) : (
            React.createElement(icon, {
              sx: {
                fontSize: 20,
                color: isActive ? "#FFF" : "#5210c1",
              },
            })
          )}
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            fontSize: "1rem",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Fade>
  );
};
export default function AllServices() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const authCtx = useContext(AuthContext);
  const user = authCtx.user || {};
  const theme = useTheme();
  const [currentView, setCurrentView] = useState("");

  const hasPermission = (permissionKey) => {
    if (!user || !user.permissions) return false;
    return user.permissions[permissionKey] === 1; // Show menu only if permission is 1
  };

  const hasNonZeroPermission = (permissionKey) => {
    if (!user) return false;
    return user[permissionKey] !== 0; // Show menu if permission is NOT 0
  };

  const menuData = [
    // (hasPermission("dmt1") || hasPermission("dmt2")) && {
    //   key: "moneyTransfer",
    //   label: "Money Transfer",
    //   icon: mt,
    //   component: Dmt,
    // },
    {
      key: "money",
      label: "Money Transfer",
      icon: sendmoney,
      subMenu: [
        hasPermission("dmt1") && {
          key: "dmt1",
          label: "Airtel Dmt",
          icon: AIR1,
          component: Dmt,
          type: "mobile",
          title: "Dmt1",
        },
        hasPermission("dmt2") && {
          key: "dmt2",
          label: "Fino Dmt",
          icon: FINO,
          component: Dmt2,
          type: "mobile",
          title: "Dmt2",
        },
      ].filter(Boolean),
    },
    {
      key: "ppiWallet",
      label: "Fund Transfer",
      icon: vapy_1,
      subMenu: [
        // Fund Transfer1 → requires vendor permission
        hasPermission("vendor") && {
          key: "walletSuper",
          label: "Fund Transfer1",
          icon: AccountBalanceWalletIcon,
          component: SuperTransfer,
          type: "super",
        },
        // Fund Transfer2 → requires levin permission
        hasPermission("levin") && {
          key: "fundtransfer2",
          label: "Fund Transfer2",
          icon: AccountBalanceWalletIcon,
          component: LevinFundTransfer,
          type: "super",
        },
      ].filter(Boolean), // remove null items
    },
    hasPermission("upi") && {
      key: "qrUpi",
      label: "UPI Transfer",
      icon: upi_1,
      subMenu: [
        {
          key: "upiPay",
          label: "UPI Pay",
          icon: QrCodeIcon,
          component: UpiTransfer,
          type: "upi",
        },
        {
          key: "LEVIN UPI",
          label: "Levin UPI",
          icon: QrCodeIcon,
          component: LevinUpiTransfer,
          type: "upi",
        },
      ],
    },
    {
      key: "aeps",
      label: "AEPS",
      icon: thumbPrint,
      // component: Aeps,
      subMenu: [
        hasPermission("aeps1") && {
          key: "aeps1",
          label: "Aeps 1",
          icon: AccountBalanceWalletIcon,
          component: AepsLayout2,
        },
        hasPermission("aeps2") && {
          key: "aeps2",
          label: "Aeps 2",
          icon: AccountBalanceWalletIcon,
          component: Aeps2,
        },
      ],
    },
    hasPermission("bbps_offline") && {
      key: "billPayments",
      label: "Bill Payments",
      icon: bp,
      component: BillPayments,
    },
    hasPermission("bbps") && {
      key: "bbps",
      label: "BBPS ",
      icon: BBPS,
      component: Bbps,
    },

    hasPermission("recharge") && {
      key: "recharge",
      label: "Recharge",
      icon: mobileRechargeNew,
      subMenu: [
        {
          key: "prepaid",
          label: "Prepaid",
          icon: recharge,
          component: Prepaid,
          type: "mobile",
          title: "Prepaid",
        },
        // {
        //   key: "postpaid",
        //   label: "Postpaid",
        //   icon: postpaid_1,
        //   component: Prepaid,
        //   type: "mobile",
        //   title: "Postpaid",
        // },
        {
          key: "dth",
          label: "DTH",
          icon: dth_1,
          component: Dth,
          type: "dth",
        },
      ],
    },
    hasPermission("credit_card") && {
      key: "credit",
      label: "Credit Card Bill",
      icon: credit_card1,
      subMenu: [
        {
          key: "pipe1",
          label: "Credit Card Bill Payment",
          component: CreditCardBillPayment,

          icon: CreditCardIcon,
        },
        {
          key: "pipe2",
          label: "Credit Card Bill(BBPS)",
          component: CreditCardBbps,
          icon: CreditCardIcon,
          type: "C15",
        },
      ],
    },
    {
      key: "cms",
      label: "CMS",
      icon: cms1,
      subMenu: [
        {
          key: "Airtel cms",
          label: " Airtel Cms",
          icon: AIR1,
          component: ComingSoon,
          type: "C04",
        },
        {
          key: "Uber cms",
          label: " Uber Cms",
          icon: UBER1,
          component: Cms,
          type: "C04",
        },
        {
          key: "cms",
          label: "Cms",
          icon: DashboardIcon,
          component: ComingSoon,
          type: "C04",
        },
      ],
    },
    hasPermission("travel") && {
      key: "travel",
      label: "Travel",
      icon: plane_1,
      subMenu: [
        {
          key: "flite",
          label: "Flight Tickets",
          icon: plane_1,
          component: ComingSoon,
          type: "dth",
        },
        {
          key: "train",
          label: "Train Tickets",
          component: ComingSoon,
          icon: train_1,
        },
        {
          key: "bus",
          label: "Bus Tickets",
          component: ComingSoon,
          icon: bus_1,
        },
      ],
    },
    hasPermission("w_txn") && {
      key: "w2w",
      label: "W 2 W",
      icon: wallet1,
      subMenu: [
        {
          key: "w1w1",
          label: "Wallet to Wallet",
          icon: wallet1,
          type: "dth",
          component: W2wTransfer,
        },
        {
          key: "w2w1",
          label: "Aeps Wallet to Main Wallet",
          icon: wallet1,
          component: Wallet2Wallet1,
        },
      ],
    },
    {
      key: "pg",
      label: "Paymnent Gateway",
      icon: PG1,
      component: ComingSoon,

      // subMenu: [
      //   {
      //     key: "upiPay",
      //     label: "UPI Pay",
      //     icon: PG1,
      //     component: ComingSoon,
      //     type: "upi",
      //   },
      // ],
    },
    {
      key: "qrcoll",
      label: "Qr Collection",
      icon: QRCODE1,
      component: ComingSoon,
      // subMenu: [
      //   {
      //     key: "upiPay",
      //     label: "UPI Pay",
      //     icon: QrCodeIcon,
      //     component: UpiTransfer,
      //     type: "upi",
      //   },
      // ],
    },
    {
      key: "partpaynent",
      label: "Part Payment",
      icon: TATAPOWER1,
      component: ComingSoon,

      // subMenu: [
      //   {
      //     key: "upiPay",
      //     label: "UPI Pay",
      //     icon: QrCodeIcon,
      //     component: UpiTransfer,
      //     type: "upi",
      //   },
      // ],
    },
  ].filter(Boolean);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu.key);
    setActiveSubMenu(null);

    if (!menu.subMenu) {
      setCurrentView({
        component: menu.component,
        menuLabel: menu.label,
        subMenuLabel: null,
        type: null,
        title: null,
      });
    } else {
      setCurrentView(null);
    }
  };

  const handleSubMenuClick = (sub, parentMenu) => {
    setActiveSubMenu(sub.key);
    setCurrentView({
      component: sub.component,
      menuLabel: parentMenu.label,
      subMenuLabel: sub.label,
      type: sub.type,
      title: sub.title,
    });
  };

  const resetView = () => {
    setCurrentView(null);
    setActiveSubMenu(null);
    setActiveMenu(null); // 👈 forcefully null
  };
  const activeMenuData = menuData.find((m) => m.key === activeMenu) || null;
  const isScrollable = currentView && currentView.component;

  return (
    <Box
      sx={{
        p: { xs: 1, md: 2 },
        backgroundColor: "#F5F4FA",
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          mb: 2,
          flexWrap: currentView?.component ? "nowrap" : "wrap", // only collapse to single row if component opened
          overflowX: currentView?.component ? "auto" : "unset", // scrollable only if component opened
        }}
      >
        {menuData.map((menu) => (
          <Grid
            item
            key={menu.key}
            xs={4}
            sm={3}
            md={2.4}
            lg={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              minWidth: currentView?.component ? "120px" : "auto", // optional, to prevent shrinking
            }}
          >
            <MenuCard
              icon={menu.icon}
              user={user}
              label={menu.label}
              onClick={() => handleMenuClick(menu)}
              isActive={activeMenu === menu.key}
            />
          </Grid>
        ))}
      </Grid>
      {/* 
      {!activeMenu && (
        <Box
          sx={{
            mt: 4,
            p: 6,
            textAlign: "center",
            color: "text.secondary",
            border: "1px dashed #E9E8F5",
            borderRadius: 3,
            backgroundColor: "#FAFAFA",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#5210c1" }}>
            Select a service to proceed
          </Typography>
        </Box>
      )} */}
      {/* ✅ Neeche wala section */}
      {activeMenuData && (
        <Box
          sx={{
            mb: 4,
            p: 1,
            borderRadius: 3,
            backgroundColor: "#FFF",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "1px solid #E9E8F5",
          }}
        >
          {/* Heading */}
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: 600,
              color: "#2B1A4C",
              display: "flex",
              alignItems: "center",
              position: "relative",
              paddingLeft: "16px",
              "&:before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: "4px",
                height: "20px",
                backgroundColor: "#5210c1",
                borderRadius: "2px",
              },
            }}
          >
            {currentView?.subMenuLabel || activeMenuData.label}
          </Typography>

          {activeMenuData.subMenu && !currentView && (
            <Grid container spacing={2}>
              {activeMenuData.subMenu.map((sub) => (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  lg={2.4}
                  key={sub.key}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <SubMenuCard
                    icon={sub.icon}
                    user={user}
                    label={sub.label}
                    onClick={() => handleSubMenuClick(sub, activeMenuData)}
                    isActive={activeSubMenu === sub.key}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* 👇 Agar submenu me se koi component select ho gaya */}
          {currentView && currentView.component && (
            <Box sx={{ mt: 1 }}>
              <currentView.component
                type={currentView.type}
                title={currentView.title}
                resetView={resetView}
              />
            </Box>
          )}

          {!activeMenuData.subMenu &&
            activeMenuData.component &&
            !currentView && (
              <Box sx={{ mt: 1 }}>
                <activeMenuData.component />
              </Box>
            )}

          {/* 👇 Fallback for menus without components */}
          {!activeMenuData.subMenu && !activeMenuData.component && (
            <Box
              sx={{ mt: 2, p: 2, textAlign: "center", color: "text.secondary" }}
            >
              <Typography>No content available for this menu</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
