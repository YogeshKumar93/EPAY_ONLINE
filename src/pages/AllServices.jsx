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
import SendIcon from "@mui/icons-material/Send";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import TrainIcon from "@mui/icons-material/Train";
import QrCodeIcon from "@mui/icons-material/QrCode";
import PaymentsIcon from "@mui/icons-material/Payments";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import WifiIcon from "@mui/icons-material/Wifi";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FlightIcon from "@mui/icons-material/Flight";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssessmentIcon from "@mui/icons-material/Assessment";
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
          height: 85,
          width: 85,
          borderRadius: 3,
          background: isActive
            ? "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)"
            : "#F9FAFB",
          color: isActive ? "#FFF" : "#1E3C72",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: isActive
            ? "0 6px 14px rgba(37, 99, 235, 0.4)"
            : "0 2px 6px rgba(0,0,0,0.08)",
          "&:hover": {
            transform: "translateY(-4px) scale(1.04)",
            boxShadow: "0 8px 16px rgba(37, 99, 235, 0.35)",
            background: isActive
              ? "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)"
              : "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)",
          },
          p: 1.5,
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
            width: 42,
            height: 42,
            mb: 1,
            borderRadius: "12px",
            backgroundColor: isActive
              ? "rgba(255,255,255,0.25)"
              : "rgba(37, 99, 235, 0.08)",
            transition: "all 0.3s ease",
            "& img": {
              width: "55%",
              height: "55%",
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
            fontWeight: 500,
            fontSize: "0.60rem",
            textAlign: "center",
            lineHeight: 1,
            letterSpacing: "0.3px",
            color: isActive ? "#FFF" : "#1E3C72",
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "80px",
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
          height: { xs: 80, sm: 90 },
          width: { xs: 80, sm: 90 },
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
            width: 40,
            height: 40,
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
            fontWeight: 500,
            fontSize: "0.65rem",
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
    if (!user) return false;
    return user[permissionKey] !== 1; // Show menu if permission is NOT 1
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
    hasPermission("monettransfer") && {
      key: "monettransfer",
      label: "Money Transfer",
      icon: mt,
      subMenu: [
        {
          key: "dmt1",
          label: "Dmt1",
          icon: mt,
          component: Dmt,
          type: "mobile",
          title: "Dmt1",
        },
        {
          key: "dmt2",
          label: "Dmt2",
          icon: mt,
          component: Dmt2,
          type: "mobile",
          title: "Dmt2",
        },
      ],
    },
    hasNonZeroPermission("dmt4") && {
      key: "ppiWallet",
      label: "Fund Transfer",
      icon: vapy_1,
      subMenu: [
        {
          key: "walletSuper",
          label: "Fund Transfer",
          icon: AccountBalanceWalletIcon,
          component: SuperTransfer,
          type: "super",
        },
      ],
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
      ],
    },
    hasPermission("aeps") && {
      key: "aeps",
      label: "AEPS",
      icon: aeps1,
      component: Aeps,
    },
    hasPermission("billpay") && {
      key: "billPayments",
      label: "BBPS(OFFLINE)",
      icon: BBPS,
      subMenu: [
        {
          key: "electricity",
          label: "Electricity",
          icon: electricity1,
          component: BBPS,
          type: "C04",
        },
        {
          key: "broadband",
          label: "Broadband",
          icon: broadband_1,
          component: BBPS,
          type: "C05",
        },
        {
          key: "gas",
          label: "Gas Bill",
          icon: gas_1,
          component: BBPS,
          type: "C07",
        },
        {
          key: "water",
          label: "Water Bill",
          icon: water_1,
          component: BBPS,
          type: "C08",
        },
        {
          key: "insurance",
          label: "Insurance",
          icon: insurance_1,
          component: BBPS,
          type: "C11",
        },
        {
          key: "landline",
          label: "Landline Bill",
          icon: landline_1,
          component: BBPS,
          type: "C02",
        },
      ],
    },
    hasPermission("bbps") && {
      key: "bbps",
      label: "BBPS ",
      icon: BBPS,
      component: Bbps,
    },

    hasPermission("mt") && {
      key: "recharge",
      label: "Recharge",
      icon: recharge,
      subMenu: [
        {
          key: "prepaid",
          label: "Prepaid",
          icon: recharge,
          component: Prepaid,
          type: "mobile",
          title: "Prepaid",
        },
        {
          key: "postpaid",
          label: "Postpaid",
          icon: postpaid_1,
          component: Prepaid,
          type: "mobile",
          title: "Postpaid",
        },
        {
          key: "dth",
          label: "DTH",
          icon: dth_1,
          component: Dth,
          type: "dth",
        },
      ],
    },
    {
      key: "credit",
      label: "Credit Card Bill",
      icon: credit_card1,
      subMenu: [
        {
          key: "pipe1",
          label: "Credit Card Bill Payment",
          icon: CreditCardIcon,
        },
        {
          key: "pipe2",
          label: "Credit Card Bill(BBPS)",
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
          key: "cms",
          label: "Cms",
          icon: DashboardIcon,
          component: Cms,
          type: "C04",
        },
      ],
    },
    {
      key: "travel",
      label: "Travel",
      icon: plane_1,
      subMenu: [
        {
          key: "flite",
          label: "Flight Tickets",
          icon: plane_1,
          type: "dth",
        },
        {
          key: "train",
          label: "Train Tickets",
          icon: train_1,
        },
        {
          key: "bus",
          label: "Bus Tickets",
          icon: bus_1,
        },
      ],
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

  return (
    <Box
      sx={{
        p: { xs: 1, md: 2 },
        backgroundColor: "#F5F4FA",
      }}
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {menuData.map((menu) => (
          <Grid
            item
            key={menu.key}
            xs={4}
            sm={3}
            md={2.4}
            lg={2}
            sx={{ display: "flex", justifyContent: "center" }}
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
