import React from "react";
import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0F2027",
        color: "#fff",
        mt: 0.2,
        pt: 3,
        pb: 0.2,
        px: { xs: 2, sm: 4, md: 10 },
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        {/* Left - Logo & Address */}
        <Grid item xs={12} md={3}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            YourLogo
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.8, color: "#ccc" }}>
            123 Business Street, <br />
            City, State - 123456 <br />
            Phone: +91 98765 43210 <br />
            Email: info@yourcompany.com
          </Typography>
        </Grid>

        {/* Center - Quick Links */}
        <Grid
          item
          xs={12}
          md={4}
           
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 5 }}>
            Quick Links
          </Typography>

          <Box
  sx={{
    display: "flex",
    gap: 3,
    justifyContent: { xs: "center", md: "flex-start" },
    mt: { xs: 2, md: 0 },
  }}
>
  <Link
    href="/"
    underline="none"
    color="inherit"
    sx={{ "&:hover": { color: "#1CA895" } }}
  >
    Home
  </Link>
  <Link
    href="/contact"
    underline="none"
    color="inherit"
    sx={{ "&:hover": { color: "#1CA895" } }}
  >
    Contact
  </Link>
  <Link
    href="/about"
    underline="none"
    color="inherit"
    sx={{ "&:hover": { color: "#1CA895" } }}
  >
    About Us
  </Link>
</Box>

        </Grid>

        {/* Right - Social Media */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Follow Us
          </Typography>
          <Box>
            <IconButton
              href="https://facebook.com"
              target="_blank"
              sx={{
                color: "#fff",
                "&:hover": { color: "#1CA895" },
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://twitter.com"
              target="_blank"
              sx={{
                color: "#fff",
                "&:hover": { color: "#1CA895" },
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              href="https://linkedin.com"
              target="_blank"
              sx={{
                color: "#fff",
                "&:hover": { color: "#1CA895" },
              }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              sx={{
                color: "#fff",
                "&:hover": { color: "#1CA895" },
              }}
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box
        sx={{
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          mt: 5,
          pt: 3,
        }}
      >
        <Typography variant="body2" sx={{ color: "#aaa" }}>
          © {new Date().getFullYear()} Your Company. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
