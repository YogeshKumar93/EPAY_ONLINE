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
import {
  Admin_nav,
  api_nav,
  asm_nav,
  customer_nav,
  di_nav,
  md_nav,
   
  nav,
  service_nav,
  zsm_nav,
} from "./navConfig";
import AuthContext from "../../contexts/AuthContext";
import { Switch } from "@mui/material";


{
  /* App Bar with reduced height */
}
import RefreshIcon from "@mui/icons-material/Refresh";
import Notification from "../Notification/Notification";
import NotificationModal from "../Notification/NotificationModal";
import { setTitleFunc } from "../../utils/HeaderTitleUtil";
 import TimelineIcon from "@mui/icons-material/Timeline";
import defaultMaleAvatar from "../../assets/Images/male_avtar.jpg";
import defaultMaleAvatar2 from "../../assets/Images/male_avtar2.jpg";
import logo from "../../assets/Images/logo(1).png"; // adjust path
import DarkModeIcon from "@mui/icons-material/DarkMode";
 
import EmailIcon from "@mui/icons-material/Email";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
 

// ✅ Default male avatar image (replace with your own asset if available)

// Navigation configuration

const roleNavigation = {
  user: nav,
  adm: Admin_nav,
  sadm: Admin_nav,
  ret: customer_nav,
  dd: customer_nav,
  service_nav: service_nav,
  di: di_nav,
  asm: asm_nav,
  zsm: zsm_nav,
  api: api_nav,
  md: md_nav,
};

const roleRoutes = {
  adm: "/admin/profile",
  sadm: "/admin/profile",
  Asm: "/asm/profile",
  dd: "/customer/profile",
  ret: "/customer/profile",
  Ret: "/customer/profile",
  Dd: "/customer/profile",
  Zsm: "/zsm/profile",
  Ad: "/ad/profile",
  Md: "/md/profile",
  Api: "/api-user/profile",
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
  // console.log("inroute",userRole);
  const { colours } = useContext(AuthContext);

  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const userLayout = user?.is_layout;
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

  const getNavigationItems = () => {
    if ((userRole === "ret" || userRole === "dd") && userLayout === 2) {
      return service_nav; // Show service nav for layout 2
    }

    // Default navigation based on role
    return roleNavigation[userRole] || nav;
  };

  const navigationItems = getNavigationItems();

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNavigation = (path, hasSubmenus) => {
    if (hasSubmenus) {
      setExpandedItems((prev) => ({ ...prev, [path]: !prev[path] }));
    } else {
      navigate(path);
      if (isMobile) {
        setMobileOpen(false);
      }
    }
  };

  const handleLogout = () => {
    handleUserMenuClose();
    authCtx.logout();
  };

  const isActive = (path, submenus) => {
    if (submenus) {
      return submenus.some((submenu) => submenu.to === location.pathname);
    }
    return path === location.pathname;
  };

  // Render navigation items recursively
  const renderNavItems = (items, level = 0) => {
    return items.map((item, index) => {
      const hasSubmenus = item.submenus && item.submenus.length > 0;
      const isItemActive = isActive(item.to, item.submenus);
      const isExpanded = expandedItems[item.to] || false;

      return (
        <Box key={index} className="nav-item">
          <ListItem
            button
            onClick={() => handleNavigation(item.to, hasSubmenus)}
            sx={{
              backgroundColor: isItemActive
                ? themeSettings.palette.primary.main
                : "transparent",
              color: isItemActive ? "#fff" : "text.primary",
              "&:hover": {
                backgroundColor: isItemActive
                  ? themeSettings.palette.primary.main
                  : "action.hover",
              },
              mb: 0,
            }}
            className={isItemActive ? "nav-link active" : "nav-link"}
          >
            <ListItemIcon
              sx={{
                "& img": {
                  width: 26,
                  height: 26,
                  filter: isItemActive ? "brightness(0) invert(1)" : "none",
                  transition: "filter 0.2s ease-in-out",
                },
                "&:hover img": {
                  filter: "brightness(0) invert(1)", // makes icon white
                },
              }}
            >
              <img src={item.icon} alt={item.title} />
            </ListItemIcon>

            {(desktopOpen || isMobile) && (
              <>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "18px", // increase font size
                    fontWeight: 500, // semi-bold
                    color: isItemActive ? "#fff" : "black", // white if active, black otherwise
                  }}
                />
                {hasSubmenus &&
                  (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
              </>
            )}
          </ListItem>

          {hasSubmenus && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className="sub-nav">
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
            sx={{
              height: 40, // adjust as needed
              width: "auto",
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

      <List className="nav-list" sx={{ overflowY: "auto" }}>
        {renderNavItems(navigationItems)}
        <MenuItem
                  disableRipple
                  onClick={() => {
                    handleLogout();
                    navigate("/login");
                  }}
                  sx={{
                    width: "100%",
                    marginBottom: "-8px",
                    textAlign: "center",
                    py: 2,
                    display: "flex",
                    justifyContent: "center",
                    // "&:hover": {
                    //   backgroundColor: getHoverInActive(),
                    //   color: "#fff",
                    // },
                  }}
                >
                <LogoutIcon className="ms-2" fontSize="small" />  Logout 
                </MenuItem>
      </List>

         <MenuItem
  onClick={handleLogout}
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent:"center",
    mt:2,
    mb:1.5,
    gap: 2,
    px: 4,
    py: 1.5,
    width:200,
    borderRadius: "12px",
    fontWeight: 500,
    color: "#dc2626", // red-600
    background: "#1405",
    boxShadow: "0 2px 6px rgba(220, 38, 38, 0.15)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "#4450A1",
      color: "#fff",
      transform: "scale(1.02)",
      boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
    },
    mx:"auto",
  }}
>
  <ListItemIcon sx={{ color: "inherit" }}>
    <LogoutIcon fontSize="small" />
  </ListItemIcon>
  <span className="text-base">Logout</span>
</MenuItem>
    </Box>
  );

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#f5f5f5" }}
      className="container"
    >
      <AppBar
        position="fixed"
        sx={{
          // backgroundColor:"#0037D7",
          backgroundColor: colours?.header,
          width: {
            md: desktopOpen
              ? `calc(100% - ${themeSettings.drawerWidth}px)`
              : "100%",
          },
          ml: { md: desktopOpen ? `${themeSettings.drawerWidth}px` : 0 },
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}

          <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5, // Adjust the gap value as needed
            }}
          >
            {/* ✅ Refresh icon buttons */}
            <IconButton onClick={refreshUser}>
              <RefreshIcon sx={{ color: "yellow" }} />
            </IconButton>

            <IconButton onClick={colour}>
              <RefreshIcon sx={{ color: "#fff" }} />
            </IconButton>

            {/* Notification Modal */}
            <NotificationModal />

            {/* 👤 User Avatar */}
            <IconButton color="inherit" onClick={handleUserMenuOpen}>
              <Avatar src={defaultMaleAvatar2} sx={{ width: 40, height: 40 }} />
            </IconButton>

            {/* 👤 User Name */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#FFE7C7",
                fontSize: "20px",
              }}
            >
              {user?.name || userName}!
            </Typography>
          </Box>

   <Menu
      anchorEl={userMenuAnchor}
      open={Boolean(userMenuAnchor)}
      onClose={handleUserMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      PaperProps={{
        elevation: 4,
        sx: {
          mt: 1,
          borderRadius: "16px",
          overflow: "visible",
          minWidth: 260,
        },
      }}
    >
      {/* Profile Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          alt={user?.name || "User Avatar"}
          src={user?.avatar || ""}
          sx={{ width: 48, height: 48, bgcolor: "primary.main" }}
        >
          {user?.name?.[0]}
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
            {user?.name || "Guest User"}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
            {user?.email || "guest@example.com"}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Menu Items */}
      <MenuItem onClick={() => navigate("/profile")}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        View Profile
      </MenuItem>

      <MenuItem onClick={() => navigate("/settings")}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>

      <MenuItem onClick={() => navigate("/activity")}>
        <ListItemIcon>
          <TimelineIcon fontSize="small" />
        </ListItemIcon>
        Logs Activity
      </MenuItem>

      <MenuItem>
        <ListItemIcon>
          <DarkModeIcon fontSize="small" />
        </ListItemIcon>
        Dark Mode
        <Switch
          edge="end"
          checked={darkMode}
          onChange={toggleDarkMode}
          sx={{ ml: "auto" }}
        />
      </MenuItem>

      <Divider />

      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Sign Out
      </MenuItem>
    </Menu>






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

      {/* Main Content */}
      <MainContent
        sx={{
          width: {
            xs: "100%",
            md: desktopOpen
              ? `calc(100% - ${themeSettings.drawerWidth}px)`
              : "100%",
          },
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          overflowY: "auto",
        }}
        className="content"
      >
        <Toolbar sx={{ minHeight: "64px !important" }} />
        <Outlet />
      </MainContent>
    </Box>
  );
};

export default SideNavAndHeader;
