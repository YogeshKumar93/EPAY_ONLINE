import React, { useContext } from "react";
import {
  Box,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import { Outlet } from "react-router-dom";

// Constants moved outside component
const THEME_SETTINGS = {
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

const FOOTER_STYLES = {
  textAlign: "center",
  py: { xs: 1, sm: 1 }, // reduced vertical padding
  px: { xs: 1, sm: 1.5 }, // reduced horizontal padding
  backgroundColor: "#7a4dff",
  color: "#d4e8e8",
  borderRadius: "8px", // slightly smaller radius
  mt: 2, // reduced margin top
  flexShrink: 0,
};
const LINK_STYLES = {
  color: "#d4e8e8",
  textDecoration: "underline",
};

const AdminLayoutWrapper = ({ desktopOpen }) => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Early return for unauthorized users
  if (!user) return null;

  const mainContentStyles = {
    flexGrow: 1,
    padding: 3, // Using MUI spacing system (3 = 24px)
    minHeight: "100vh",
    marginLeft: 0,
    width: {
      xs: "100%",
      md: desktopOpen ? `calc(100% - ${THEME_SETTINGS.drawerWidth}px)` : "100%",
    },
    position: "fixed",
    top: 0,
    pb: 0.3,
    right: 0,
    height: "100vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  return (
    <Box sx={mainContentStyles} className="content">
      {/* Main Content Area */}
      <Box component="main">
        <Toolbar sx={{ minHeight: "60px !important" }} />
        <Outlet />
      </Box>

      {/* Footer */}
      <Box component="footer" sx={FOOTER_STYLES}>
        <Typography
          sx={{
            fontSize: { xs: "13px", sm: "15px", md: "17px" },
            fontWeight: "bold",
          }}
        >
          © 2025{" "}
          <Box component="span" sx={{ fontWeight: 700 }}>
            PSPKA SERVICES PRIVATE LIMITED{" "}
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
            href="https://biggbrains.com"
            target="_blank"
            rel="noopener noreferrer"
            style={LINK_STYLES}
          >
            Developed and Maintained by Biggbrains Solution Pvt. Ltd.
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminLayoutWrapper;
