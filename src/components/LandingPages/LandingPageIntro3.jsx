import React from "react";
import {
  Box,
  Container,
  Grid,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  alpha
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AndroidIcon from "@mui/icons-material/Android";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
// import lp_illustration from "../../assets/Images/MobileBankingIllustration.jpg"; // adjust path

const LandingPageIntro3 = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #0F2027 0%, #203A43 50%, #2C5364 100%)",
        width: "100%",
        minHeight: "100vh",
        height: "auto",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        px: { xs: 2, sm: 4, md: 10 },
        py: { xs: 4, md: 8 },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 80%, " + alpha(theme.palette.primary.light, 0.2) + " 0%, transparent 50%), radial-gradient(circle at 80% 20%, " + alpha(theme.palette.secondary.main, 0.2) + " 0%, transparent 50%)",
          zIndex: 0,
        }
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, " + alpha(theme.palette.primary.main, 0.4) + " 0%, transparent 70%)",
          filter: "blur(20px)",
          zIndex: 0,
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, " + alpha(theme.palette.secondary.main, 0.3) + " 0%, transparent 70%)",
          filter: "blur(15px)",
          zIndex: 0,
          animation: "float 10s ease-in-out infinite",
        }}
      />
      
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Grid 
          container 
          spacing={6} 
          sx={{ 
            flexDirection: isMobile ? "column-reverse" : "row"
          }}
        >
          {/* Left Side - Content */}
          <Grid 
            item 
            md={6} 
            sm={12} 
            sx={{ 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center",
              textAlign: isMobile ? "center" : "left"
            }}
          >
            <Box sx={{ mt: { xs: 4, md: 0 } }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.8rem" },
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.1,
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                }}
              >
                Your Money. <Box component="span" sx={{ color: "#4ecdc4" }}>Your Rules.</Box> Powered by{" "}
                <Box 
                  component="span" 
                  sx={{ 
                    color: "#FCDB62", 
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  P2PAE
                  <Box 
                    sx={{
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      width: "100%",
                      height: "8px",
                      background: "linear-gradient(90deg, #FCDB62, #4ecdc4)",
                      borderRadius: 4,
                      opacity: 0.8
                    }}
                  />
                </Box>
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  mb: 4,
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 1.6,
                  fontFamily: "'Inter', sans-serif",
                  maxWidth: "90%",
                  mx: isMobile ? "auto" : 0
                }}
              >
                Empowering your financial journey with payment solutions that are smooth, reliable, and built on trust. Take control of your finances like never before.
              </Typography>

              <Box 
                sx={{ 
                  display: "flex", 
                  gap: 3, 
                  flexWrap: "wrap",
                  mb: 6,
                  justifyContent: isMobile ? "center" : "flex-start"
                }}
              >
                <Button
                  variant="contained"
                  sx={{ 
                    bgcolor: "#4ecdc4", 
                    color: "#000", 
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(78, 205, 196, 0.4)",
                    "&:hover": {
                      bgcolor: "#3bbbb3",
                      boxShadow: "0 6px 25px rgba(78, 205, 196, 0.6)",
                      transform: "translateY(-3px)"
                    },
                    transition: "all 0.3s ease"
                  }}
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/login")}
                >
                  Explore Now
                </Button>

                <Button
                  variant="outlined"
                  sx={{ 
                    borderColor: "#FCDB62", 
                    color: "#FCDB62", 
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "rgba(252, 219, 98, 0.1)",
                      borderColor: "#FCDB62",
                      transform: "translateY(-3px)"
                    },
                    transition: "all 0.3s ease"
                  }}
                  startIcon={<AndroidIcon />}
                >
                  Download App
                </Button>
              </Box>
              
              {/* Features section */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ 
                    bgcolor: "rgba(255, 255, 255, 0.05)", 
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 3,
                    py: 2,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                    }
                  }}>
                    <CardContent>
                      <AccountBalanceIcon sx={{ fontSize: 40, color: "#4ecdc4", mb: 1 }} />
                      <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
                        Secure Banking
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Bank-level security for all your transactions
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ 
                    bgcolor: "rgba(255, 255, 255, 0.05)", 
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 3,
                    py: 2,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                    }
                  }}>
                    <CardContent>
                      <SpeedIcon sx={{ fontSize: 40, color: "#FCDB62", mb: 1 }} />
                      <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
                        Instant Transfers
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Send and receive money in seconds
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ 
                    bgcolor: "rgba(255, 255, 255, 0.05)", 
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 3,
                    py: 2,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                    }
                  }}>
                    <CardContent>
                      <SecurityIcon sx={{ fontSize: 40, color: "#ff6b6b", mb: 1 }} />
                      <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
                        24/7 Protection
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Your money is protected round the clock
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Side - Image */}
          <Grid 
            item 
            md={6} 
            sm={12} 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              position: "relative"
            }}
          >
            <Box 
              sx={{ 
                width: "100%", 
                maxWidth: 600,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-15%",
                  right: "-10%",
                  width: "120%",
                  height: "120%",
                  background: "radial-gradient(circle, rgba(78, 205, 196, 0.2) 0%, transparent 70%)",
                  zIndex: 0,
                  borderRadius: "50%"
                }
              }}
            >
              {/* <img
                src={lp_illustration}
                alt="Mobile banking illustration"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.3))",
                  position: "relative",
                  zIndex: 2
                }}
              /> */}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Add keyframes for animation */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </Box>
  );
};

export default LandingPageIntro3;