import React, { useContext } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import SideNavAndHeader from "../components/Layout/SideNavAndHeader";

const AdminLayoutWrapper = ({ children }) => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRole = user?.role;
  if (!user) return null;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        // backgroundColor: "red"
      }}
    >
      {/* Sidebar */}
      <SideNavAndHeader userRole={userRole} />

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          //   flexDirection: "column",
          minHeight: "100vh",
          pt: isMobile ? 0 : "52px",
        }}
      >
        {/* Page Content & Footer Wrapper */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0, // Important: Allows content to scroll
          }}
        >
          {/* Page Content - This is the scrollable area */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto", // Allows scrolling
              py: 0.5,
              minHeight: 0, // Important for flex scrolling
            }}
          >
            {children}
          </Box>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              textAlign: "center",
              py: { xs: 2, sm: 1 },
              px: { xs: 1, sm: 2 },
              backgroundColor: "#66bb6a",
              color: "#fff",
              width: "100%",
              borderRadius: "8px 8px 0 0",
              boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
              flexShrink: 0, // Prevents footer from shrinking
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "13px", sm: "15px", md: "17px" },
                fontWeight: "bold",
                letterSpacing: 0.5,
                fontFamily: "'Segoe UI', Roboto, sans-serif",
                lineHeight: 1,
              }}
            >
              © 2025{" "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                Biggbrains Solutions Pvt. Ltd.
              </Box>{" "}
              All Rights Reserved.
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "11.5px", sm: "13px", md: "14.5px" },
                mt: 1,
                color: "rgba(255, 255, 255, 0.9)",
                fontStyle: "italic",
                fontFamily: "'Segoe UI', Roboto, sans-serif",
                lineHeight: 1.4,
              }}
            >
              Disclainbnbnnbmer: Disputes shall be subject to the jurisdiction
              of the courts of Delhi.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayoutWrapper;
