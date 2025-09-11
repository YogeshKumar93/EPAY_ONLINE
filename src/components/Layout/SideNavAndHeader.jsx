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
import { Admin_nav, customer_nav, nav, service_nav } from "./navConfig";
import AuthContext from "../../contexts/AuthContext";

{
  /* App Bar with reduced height */
}
import RefreshIcon from "@mui/icons-material/Refresh";
import Notification from "../Notification/Notification";
import NotificationModal from "../Notification/NotificationModal";
import { setTitleFunc } from "../../utils/HeaderTitleUtil";

// Navigation configuration

const roleNavigation = {
  user: nav,
  adm: Admin_nav,
  sadm: Admin_nav,
  ret: customer_nav,
  dd: customer_nav,
  service_nav: service_nav,
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
              sx={{ color: isItemActive ? "#fff" : "text.primary" }}
              className="nav-icon"
            >
              {isItemActive ? item.icon2 : item.icon}
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
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="nav-title"
            sx={{ fontWeight: "bold" }}
          >
            App Name
          </Typography>
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
      </List>
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
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
            className="text-xl font-semibold"
          >
            {title}
          </Typography>
          {/* ✅ Refresh icon button with black color */}
          <IconButton onClick={refreshUser}>
            <RefreshIcon sx={{ color: "black" }} />
          </IconButton>
          <IconButton onClick={colour}>
            <RefreshIcon sx={{ color: "#fff" }} />
          </IconButton>
          <IconButton color="inherit" onClick={handleUserMenuOpen}>
            <Avatar src={userAvatar} sx={{ width: 32, height: 32 }}>
              {!userAvatar && <PersonIcon />}
            </Avatar>
          </IconButton>
          <NotificationModal />

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem disabled>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <span className="text-base font-medium">{userName}</span>
            </MenuItem>

            <Divider />

            <MenuItem
              disableRipple
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                marginTop: "-8px",
                "&:hover": { cursor: "default", background: "#fff" },
              }}
            >
              {user && user.profile_image !== "0" ? (
                <Avatar
                  id="user_img"
                  alt="Remy Sharp"
                  src={""}
                  sx={{ width: 80, height: 80 }}
                />
              ) : (
                <AccountCircle sx={{ fontSize: "80px" }} />
              )}

              <span
                style={{
                  fontWeight: "550",
                  fontSize: "0.9rem",
                  marginTop: "0.3rem",
                }}
              >
                {user && user.name}
              </span>

              <span
                onClick={() => {
                  if (user && user.role === "adm") {
                    navigate("/admin/profile");
                  } else if (user && user.role === "sadm") {
                    navigate("/admin/profile");
                  } else if (user && user.role === "Asm") {
                    navigate("/asm/profile");
                  } else if (user && user.role === "dd") {
                    navigate("/customer/profile");
                  } else if (user && user.role === "ret") {
                    navigate("/customer/profile");
                  } else if (user && user.role === "Zsm") {
                    navigate("/zsm/profile");
                  } else if (user && user.role === "Ad") {
                    navigate("/ad/profile");
                  } else if (user && user.role === "Md") {
                    navigate("/md/profile");
                  } else if (
                    user &&
                    (user.role === "Ret" || user.role === "Dd")
                  ) {
                    navigate("/customer/profile");
                  } else if (user && user.role === "Api") {
                    navigate("/api-user/profile");
                  } else {
                    navigate("/other/profile");
                  }
                }}
                style={{
                  border: "1px solid #3f3f3f",
                  borderRadius: "16px",
                  padding: "0.2rem 1rem",
                  fontSize: "0.9rem",
                  margin: "1rem 0",
                }}
                className="simple-hover"
              >
                Manage your Profile
              </span>
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <span className="text-base">Logout</span>
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
