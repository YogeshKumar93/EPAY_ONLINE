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

const MenuCard = ({ icon, label, onClick, isActive, user }) => {
  return (
    <Zoom in={true} style={{ transitionDelay: Math.random() * 100 + "ms" }}>
      <Box
        onClick={onClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: { xs: 90, sm: 100 },
          width: { xs: 90, sm: 100 },
          borderRadius: 3,
          background: isActive
            ? "linear-gradient(135deg, #5210c1 0%, #7b3fe3 100%)"
            : "linear-gradient(135deg, #F5F4FA 0%, #FFFFFF 100%)",
          color: isActive ? "#FFF" : "#2B1A4C",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: isActive
            ? "0 8px 16px rgba(82, 16, 193, 0.25)"
            : "0 4px 12px rgba(0,0,0,0.08)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: isActive
              ? "0 12px 20px rgba(82, 16, 193, 0.3)"
              : "0 8px 16px rgba(0,0,0,0.12)",
            background: isActive
              ? "linear-gradient(135deg, #5210c1 0%, #7b3fe3 100%)"
              : "linear-gradient(135deg, #E9E8F5 0%, #F5F4FA 100%)",
          },
          p: 1.5,
          position: "relative",
          overflow: "hidden",
          "&::before": isActive
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                // background: "linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)",
                borderRadius: "3px 3px 0 0",
              }
            : {},
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 50,
            height: 50,
            mb: 1,
            borderRadius: "50%",
            backgroundColor: isActive
              ? "rgba(255,255,255,0.2)"
              : "rgba(82, 16, 193, 0.08)",
            "& img": {
              width: "60%",
              height: "60%",
              objectFit: "contain",
            },
            transition: "all 0.3s ease",
          }}
        >
          {typeof icon === "string" ? (
            <img src={icon} alt="icon" />
          ) : (
            React.createElement(icon, {
              sx: {
                fontSize: 24,
                color: isActive ? "#FFF" : "#5210c1",
              },
            })
          )}
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: "0.7rem",
            textAlign: "center",
            lineHeight: 1.2,
            transition: "all 0.3s ease",
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
  const [activeMenu, setActiveMenu] = useState("qrUpi");
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const theme = useTheme();
  const setCurrentView = authCtx.setCurrentView;
  const currentView = authCtx.currentView;

  const menuData = [
    (user?.dmt1 !== 1 || user?.dmt2 !== 1) && {
      key: "moneyTransfer",
      label: "Money Transfer",
      icon: mt,
      subMenu: [
        user?.dmt1 === 1 && {
          key: "dmt1",
          label: "DMT 1",
          icon: CompareArrowsIcon,
          type: "dmt1",
        },
        user?.dmt2 === 1 && {
          key: "dmt2",
          label: "DMT 2",
          icon: CompareArrowsIcon,
          type: "dmt2",
        },
      ].filter(Boolean),
    },

    user?.dmt4 !== 0 && {
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
    user?.upi_transfer !== 1 && {
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
    user?.aeps !== 1 && {
      key: "aeps",
      label: "AEPS",
      icon: aeps1,
      subMenu: [
        {
          key: "aepsTxn",
          label: "AEPS 1",
          icon: LocalAtmIcon,
        },
      ],
    },
    // user?.billpay !== 1 && {
    //   key: "billPayments",
    //   label: "BBPS(OFFLINE)",
    //   icon: BBPS,
    //   subMenu: [
    //     {
    //       key: "electricity",
    //       label: "Electricity",
    //       icon: electricity1,
    //       type: "C04",
    //     },
    //     {
    //       key: "broadband",
    //       label: "Broadband",
    //       icon: broadband_1,
    //       type: "C05",
    //     },
    //     {
    //       key: "gas",
    //       label: "Gas Bill",
    //       icon: gas_1,
    //       type: "C07",
    //     },
    //     {
    //       key: "water",
    //       label: "Water Bill",
    //       icon: water_1,
    //       type: "C08",
    //     },
    //     {
    //       key: "insurance",
    //       label: "Insurance",
    //       icon: insurance_1,
    //       type: "C11",
    //     },
    //     {
    //       key: "landline",
    //       label: "Landline Bill",
    //       icon: landline_1,
    //       type: "C02",
    //     },
    //   ],
    // },
    user?.bbps !== 1 && {
      key: "bbps",
      label: "BBPS ",
      icon: BBPS,
      subMenu: [
        {
          key: "bbps",
          label: "BBPS",
          icon: BBPS,
          type: "C04",
        },
      ],
    },

    user?.recharge !== 1 && {
      key: "recharge",
      label: "Recharge",
      icon: recharge,
      subMenu: [
        {
          key: "prepaid",
          label: "Prepaid",
          icon: recharge,
          component: Recharge,
          type: "mobile",
          title: "Prepaid",
        },
        {
          key: "postpaid",
          label: "Postpaid",
          icon: postpaid_1,
          component: Recharge,
          type: "mobile",
          title: "Postpaid",
        },
        {
          key: "dth",
          label: "DTH",
          icon: dth_1,
          component: Recharge,
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

  const handleMenuClick = (key) => {
    setActiveMenu(key === activeMenu ? null : key);
    setActiveSubMenu(null);
    setCurrentView(null);
  };

  const handleSubMenuClick = (subMenu) => {
    setActiveSubMenu(subMenu.key);
    if (subMenu.component) {
      setCurrentView({
        component: subMenu.component,
        type: subMenu.type || subMenu.key,
        title: subMenu.title || subMenu.key,
        menuLabel: menuData.find((m) =>
          m.subMenu.some((sm) => sm.key === subMenu.key)
        )?.label,
        subMenuLabel: subMenu.label,
      });
    }
  };

  const resetView = () => {
    setCurrentView(null);
    setActiveSubMenu(null);
  };

  const activeMenuData = menuData.find((m) => m.key === activeMenu);

  return (
    <Box
      sx={{
        p: { xs: 1, md: 2 },
        backgroundColor: "#F5F4FA",
        minHeight: "100vh",
      }}
    >
      {/* Show only when no component is selected */}
      {!currentView && (
        <>
          {/* Main Menu */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
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
                }}
              >
                <MenuCard
                  icon={menu.icon}
                  user={user}
                  label={menu.label}
                  onClick={() => handleMenuClick(menu.key)}
                  isActive={activeMenu === menu.key}
                />
              </Grid>
            ))}
          </Grid>

          {activeMenuData && (
            <Box
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 3,
                backgroundColor: "#FFF",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "1px solid #E9E8F5",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
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
                {activeMenuData.label}
              </Typography>
              <Grid container spacing={2}>
                {activeMenuData.subMenu.map((sub) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2.4}
                    key={sub.key}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <SubMenuCard
                      icon={sub.icon}
                      user={user}
                      label={sub.label}
                      onClick={() => handleSubMenuClick(sub)}
                      isActive={activeSubMenu === sub.key}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}

      {currentView && (
        <Box
          sx={{
            mt: 2,
            backgroundColor: "#FFF",
            borderRadius: 3,
            p: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "1px solid #E9E8F5",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
                backgroundColor: "#FFF",
              // mb: 3,
              borderBottom: "1px solid #F5F4FA",
              pb: 1,
            }}
          >
            <IconButton
              onClick={resetView}
              sx={{
                mr: 1,
                color: "#5210c1",
                backgroundColor: "#F5F4FA",
                "&:hover": {
                  backgroundColor: "#E9E8F5",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#2B1A4C" }}>
              {currentView.menuLabel} / {currentView.subMenuLabel}
            </Typography>
          </Box>
          <currentView.component
            type={currentView.type}
            title={currentView.title}
            resetView={resetView}
          />
        </Box>
      )}

      {!currentView && (
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            mb: 3,
            backgroundColor: "#FFF",
            border: "1px solid #E9E8F5",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                p: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  mr: { md: 2 },
                  mb: { xs: 2, md: 0 },
                }}
              >
                <img
                  src={""}
                  alt="Banner"
                  style={{
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
