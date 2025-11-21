import React, { useState, useEffect, useContext } from "react";
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Collapse,
  Card,
  CardContent,
  Grid,
  styled,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Download as DownloadIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {newLogout} from "../../iconsImports";
import AuthContext from "../../contexts/AuthContext";
import { Switch } from "@mui/material";

{
  /* App Bar with reduced height */
}
import RefreshIcon from "@mui/icons-material/Refresh";
// import Notification from "../Notification/Notification";
// import NotificationModal from "../Notification/NotificationModal";
import { setTitleFunc } from "../../utils/HeaderTitleUtil";
import TimelineIcon from "@mui/icons-material/Timeline";
// import defaultMaleAvatar from "../../assets/Images/male_avtar.jpg";
// import defaultMaleAvatar2 from "../../assets/Images/male_avtar2.jpg";
import logo from "../../assets/Images/PPALogo.svg"; 
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DarkModeIcon from "@mui/icons-material/DarkMode";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import EmailIcon from "@mui/icons-material/Email";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import WalletCard from "../WalletCard";
import { buildNavForRole } from "./navConfig";
import AdminLayoutWrapper from "../../pages/AdminLayoutWrapper";

// ✅ Default male avatar image (replace with your own asset if available)

// Navigation configuration

const roleRoutes = {
  adm: "/admin/profile",
  sadm: "/admin/profile",
  asm: "/asm/profile",
  di: "/di/profile",
  dd: "/customer/profile",
  ret: "/customer/profile",
  zsm: "/zsm/profile",
  md: "/md/profile",
  api: "/api/profile",
};

const themeSettings = {
  drawerWidth: 240,
  palette: {
    primary: {
      main: "#0037D7",
 
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
};

const SideNavAndHeader = ({ userRole, userName = "User Name", userAvatar }) => {
  const { colours } = useContext(AuthContext);

  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const userLayout = user?.is_layout;
  const permissions = user?.permissions || {};
  const role = user?.role;

  const refreshUser = authCtx.loadUserProfile;
  const colour = authCtx.loadColours;
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [preview, setPreview] = useState(user?.profile_image || "");
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const title = setTitleFunc(location.pathname, location.state);
  const MainContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    marginLeft: 0,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }));

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    // optional: save to localStorage
    localStorage.setItem("darkMode", !darkMode);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      // 🔄 upload logic API call can be added here
      console.log("Selected file:", file);
    }
  };
  const navigationItems = buildNavForRole(
    user?.role,
    user?.permissions || {},
    userLayout || 0
  );

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleLogoClick = () => {
    if (user?.role === "ret" || user?.role === "dd") {
      navigate("/customer/allServices");
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  const handleNavigation = (item, hasSubmenus) => {
    if (hasSubmenus) {
      setExpandedItems((prev) => ({
        ...prev,
        [item.title]: !prev[item.title],
      }));
    } else {
      const path = getResolvedPath(item); // ✅ path for navigation
      navigate(path);
      if (isMobile) setMobileOpen(false);
    }
  };
  const isActive = (path, submenus) => {
    if (submenus) {
      return submenus.some(
        (submenu) => getResolvedPath(submenu) === location.pathname
      );
    }
    return path === location.pathname;
  };

  const handleLogout = () => {
    handleUserMenuClose();
    authCtx.logout();
  };
  const getResolvedPath = (item) =>
    item.to?.[user?.role] || item.to?.default || "/";

  const renderNavItems = (items, level = 0) => {
    return items.map((item, index) => {
      const hasSubmenus = item.submenus && item.submenus.length > 0;
      const resolvedPath = getResolvedPath(item); // for navigation & active
      const isItemActive = isActive(resolvedPath, item.submenus);
      const isExpanded = expandedItems[item.title] || false; // use title as key

      return (
        <Box key={index} sx={{ padding: "4px 12px" }}>
          <ListItem
            button
            onClick={() => handleNavigation(item, hasSubmenus)}
            sx={{
             
              position: "relative",
              backgroundColor: isItemActive ? "#e6f0fb" : "transparent",
              "&::before": isItemActive
                ? {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: "4px",
                    backgroundColor: "#6C4BC7",
                    borderRadius: "2px",
                  }
                : {},
            }}
          >
            <ListItemIcon>
              <img
                src={item.icon}
                alt={item.title}
                style={{ width: 26, height: 26 }}
              />
            </ListItemIcon>

            {/* Always render title */}
            <ListItemText
              primary={item.title} // ✅ Make sure title is not replaced
              sx={{
                "& .MuiTypography-root": {
                  color: isItemActive ? "#492077" : "#7a89a4ff",
                  fontWeight: 550,
                  fontSize: "17px",
                },
              }}
            />

            {hasSubmenus &&
              (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
          </ListItem>

          {hasSubmenus && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderNavItems(item.submenus, level + 1)}
              </List>
            </Collapse>
          )}
        </Box>
      );
    });
  };

  // Drawer content
  const drawerContent = (
    <Box
      className="side-nav"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colours?.sidenav,
      }}
    >
      {/* Logo area with white background */}
      <Box
        className="nav-header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: desktopOpen ? "center" : "center",
          p: 1.5, // Reduced padding to decrease height
          backgroundColor: "#fff",
          height: "64px",
          borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
          minHeight: "64px", // Matching the header height
        }}
      >
        {desktopOpen && (
          <Box
            component="img"
            src={logo}
            alt="App Logo"
            onClick={handleLogoClick}
            sx={{
              height: 35,
              width: 130, //
              cursor: "pointer",
              display: "block",
               
            }}
          />
        )}

        {!isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            className="text-primary"
            size="small"
          >
            {/* <ChevronLeftIcon /> */}
          </IconButton>
        )}
      </Box>
      <List
        className="nav-list"
        sx={{
           
          overflowY: "auto",
          flexGrow: 1,
          "&::-webkit-scrollbar": {
            width: 0,
            background: "transparent",
          },
          "-ms-overflow-style": "none", // IE/Edge
          "scrollbar-width": "none", // Firefox
        }}
      >
        {renderNavItems(navigationItems)}

<Divider   />
        <MenuItem
          disableRipple
          onClick={() => {
            handleLogout();
          }}
          sx={{
            width: "100%",
            px: 3,
            fontWeight:600,
            display: "flex",
            alignItems: "center",
            color: "#492077",
            borderRadius: "4px",
            mb: 0,
            mt:5,
            "&:hover": {
              backgroundColor: "#ebeef2",
              color: "#6C4BC7",
            },
            gap: 4,
          }}
        >
          
           <img
    src={newLogout}
    alt="logout"
    style={{ width: 28, height: 28 }}
  /> Logout
        </MenuItem>

        {/* App Version text */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            mt: 1.5,
            mb: 1,
            fontSize: "15px",
            color: "#68a708ff",
          }}
        >
          App Version 1.0.0
        </Typography>
      </List>
    </Box>
  );
  const walletConfig = [
    { match: ["di", "md"], wallets: ["w1", "w3"] },
    { match: ["ret", "dd"], wallets: ["w1", "w2"] },
    { match: ["api"], wallets: ["w1"] },
    { match: ["lein"], wallets: ["lien"] },
  ];

  const getWallets = (role) => {
    const found = walletConfig.find((cfg) =>
      cfg.match.some((m) => role?.includes(m))
    );
    return found?.wallets || [];
  };
  const walletLabelMap = {
    w1: "Main Balance",
    w2: "AEPS Balance",
    w3: "Comm Balance",
    lien: "Lien",
  };

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#f5f5f5" }}
      className="container"
    >
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#fff",
          boxShadow: " rgba(0,0,0,0.08)",
          // boxShadow: "none",
          width: {
            md: desktopOpen
              ? `calc(100% - ${themeSettings.drawerWidth}px)`
              : "100%",
          },
          ml: { md: desktopOpen ? `${themeSettings.drawerWidth}px` : 0 },
          zIndex: 1,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          height: "64px", // Reduced header height

          justifyContent: "center",
        }}
        className="header"
      >
        <Toolbar sx={{ minHeight: "64px !important" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { xs: "flex", sm: "flex", md: "none" }, // only show on xs/sm
              color: "#492077",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "#492077", fontWeight: 700 }}
          >
            {title}
          </Typography>
          {/* <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
            {getWallets(user?.role).map((wallet) => (
              <WalletCard
                key={wallet}
                label={walletLabelMap[wallet] || wallet.toUpperCase()}
                amount={`₹${((user?.[wallet] || 0) / 100).toFixed(2)}`}
              />
            ))}

            {user?.lien > 0 &&
              ["md", "di", "ret", "dd"].includes(user?.role) && (
                <WalletCard
                  key="lien"
                  label="Lien"
                  amount={`₹${user.lien.toFixed(2)}`}
                />
              )}
          </Box> */}
          <IconButton onClick={refreshUser}>
            <RefreshIcon sx={{ color: "#492077" }} />
          </IconButton>

          {/* <IconButton onClick={colour}>
            <RefreshIcon sx={{ color: "#ec9e9eff" }} />
          </IconButton> */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            {/* <NotificationModal /> */}
            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{ p: 0, mr: 0.5 }} // padding remove
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "#492077",
                }}
              >
                <PersonOutlineIcon sx={{ color: "#FFF", fontSize: 20 }} />
              </Avatar>
            </IconButton>

            {/* Role + Name as separate text (not clickable) */}
            {/* Role + Name as separate text (not clickable) */}
            <Box
              onClick={handleUserMenuOpen}
              sx={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: "#492077",
                  fontSize: "11px",
                  lineHeight: 1,
                }}
              >
                {user?.role === "adm"
                  ? "Admin"
                  : user?.role === "dd"
                  ? "Direct Dealer"
                  : user?.role === "di"
                  ? "Distributor"
                  : user?.role === "sadm"
                  ? "Super Admin"
                  : user?.role === "ret"
                  ? "Retailer"
                  : user?.role === "zsm"
                  ? "Zonal Sales Manager"
                  : user?.role === "asm"
                  ? "Area Sales Manager"
                  : user?.role === "md"
                  ? "Master Distributor"
                  : "User"}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#492077",
                    fontSize: "12px",
                    lineHeight: "16px",
                  }}
                >
                  {user?.establishment || "N/A"}
                </Typography>

                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{ p: 0, ml: 1, width: 20, height: 20 }}
                >
                  <ExpandMoreIcon sx={{ fontSize: 20, color: "#492077" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>



{/* ******************************************************************** */}


<Menu
  anchorEl={userMenuAnchor}
  open={Boolean(userMenuAnchor)}
  onClose={handleUserMenuClose}
  transformOrigin={{ horizontal: "right", vertical: "top" }}
  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
  PaperProps={{
    sx: {
      mt: 2,
      borderRadius: "24px",
      overflow: "hidden",
      minWidth: 400,
      boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
      border: "2px solid #F1F5F9",
      background: "#FFFFFF"
    },
  }}
>
  {/* Extra Large Profile Section */}
  <Box
    sx={{
      px: 5,
      py: 4,
      display: "flex",
      alignItems: "center",
      gap: 4,
      background: "linear-gradient(135deg, #492077 0%, #685d7aff 100%)",
      color: "white",
      position: "relative",
      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)",
      }
    }}
  >
    <Avatar
      alt={user?.name || "User Avatar"}
      src={user?.avatar || ""}
      sx={{ 
        width: 80, 
        height: 80, 
        bgcolor: "rgba(255,255,255,0.9)",
        color: "#1E40AF",
        border: "4px solid rgba(255,255,255,0.3)",
        fontWeight: 800,
        fontSize: "2rem",
        zIndex: 1
      }}
    >
      {user?.name?.[0]?.toUpperCase()}
    </Avatar>
    <Box sx={{ zIndex: 1 }}>
      <Typography sx={{ 
        fontWeight: 800, 
        fontSize: "1.5rem",
        lineHeight: 1.2,
        mb: 1
      }}>
        {user?.name || "Guest User"}
      </Typography>
      <Typography
        sx={{ 
          fontSize: "1.1rem", 
          opacity: 0.9,
          fontWeight: 400
        }}
      >
        {user?.email || "guest@example.com"}
      </Typography>
    </Box>
  </Box>

  {/* Extra Large Menu Items */}
  <Box sx={{ p: 4 }}>
    <MenuItem 
      onClick={() => navigate(roleRoutes[user?.role])}
      sx={{
        borderRadius: "16px",
        py: 2.5,
        px: 4,
        mb: 3,
        display: "flex",
        alignItems: "center",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: "70px",
        "&:hover": {
          background: "linear-gradient(135deg, #cfceddff 0%, #7C3AED 100%)",
          transform: "scale(1.02) translateX(10px)",
          boxShadow: "0 10px 30px rgba(79, 70, 229, 0.3)",
          "& .MuiTypography-root": {
            color: "white",
            fontWeight: 700
          },
          "& .MuiListItemIcon-root": {
            color: "white"
          }
        }
      }}
    >
      <ListItemIcon sx={{ minWidth: 60 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#20207cff",
            fontSize: "1.5rem"
          }}
        >
          <PersonIcon fontSize="large" />
        </Box>
      </ListItemIcon>
      <Typography sx={{ 
        fontWeight: 600, 
        fontSize: "1.2rem",
        color: "#1F2937",
        ml: 2
      }}>
        Manage Profile
      </Typography>
    </MenuItem>

    <Divider sx={{ 
      my: 4, 
      borderColor: "#E5E7EB",
      borderWidth: "2px"
    }} />

    {/* Extra Large Sign Out */}
    <MenuItem 
      onClick={handleLogout}
      sx={{
        borderRadius: "16px",
        py: 2.5,
        px: 4,
        display: "flex",
        alignItems: "center",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: "70px",
        background: "linear-gradient(135deg, #beb5b5ff 0%, #FEE2E2 100%)",
        border: "3px solid #FECACA",
        "&:hover": {
          background: "linear-gradient(135deg, #da8080ff 0%, #B91C1C 100%)",
          transform: "scale(1.02) translateX(10px)",
          boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)",
          border: "3px solid #DC2626",
          "& .MuiTypography-root": {
            color: "white",
            fontWeight: 800
          }
        }
      }}
    >
      <ListItemIcon sx={{ minWidth: 60 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            src={newLogout}
            alt="logout"
            style={{ 
              width: 26, 
              height: 26
            }}
          />
        </Box>
      </ListItemIcon>
      <Typography sx={{ 
        fontWeight: 700, 
        fontSize: "1.2rem",
        color: "#DC2626",
        ml: 2
      }}>
        Sign Out
      </Typography>
    </MenuItem>
  </Box>
</Menu>




          {/* *************************************************** */}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: desktopOpen ? themeSettings.drawerWidth : 0 },
          flexShrink: { md: 0 },
        }}
        className="main-layout"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: themeSettings.drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: themeSettings.drawerWidth,

              transition: (theme) =>
                theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              overflow: "auto",
              scrollbarWidth: "none",
              ...(!desktopOpen && {
                overflowX: "hidden",

                transition: (theme) =>
                  theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                width: (theme) => theme.spacing(),
              }),
            },
          }}
          open={desktopOpen}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <AdminLayoutWrapper desktopOpen={true}>
        <Outlet />
      </AdminLayoutWrapper>
      {/* Main Content */}
      {/* <MainContent
        sx={{
          width: {
            xs: "100%",
            md: desktopOpen
              ? `calc(100% - ${themeSettings.drawerWidth}px)`
              : "100%",
          },
          position: "fixed",
          top: 0,
          pb: 0.3,
          right: 0,
          height: "100vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // ensures footer stays at bottom
        }}
        className="content"
      >
        <Box>
          <Toolbar sx={{ minHeight: "60px !important" }} />
          <Outlet />
        </Box>

        <Box
          sx={{
            textAlign: "center",
            py: { xs: 2, sm: 1.5 },
            px: { xs: 1, sm: 2 },
            backgroundColor: "#6C4BC7",
            color: "#d4e8e8",
            borderRadius: "10px",
            mt: 4,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "13px", sm: "15px", md: "17px" },
              fontWeight: "bold",
            }}
          >
            © 2025{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              PSPKA Services Pvt. Ltd.
            </Box>{" "}
            All Rights Reserved.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "11.5px", sm: "13px", md: "14.5px" },
              mt: 1,
              color: "#d4e8e8",
            }}
          >
            <a
              href="https://biggbrains.com" // Replace with your desired URL
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#d4e8e8", textDecoration: "underline" }} // Styling for link
            >
              Developed and Maintained by Biggbrains Solution Pvt. Ltd.
            </a>
          </Typography>
        </Box>
      </MainContent> */}
    </Box>
  );
};

export default SideNavAndHeader;
