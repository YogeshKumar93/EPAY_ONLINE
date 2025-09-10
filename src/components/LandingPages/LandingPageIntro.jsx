import React, { useState, useEffect } from "react";
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
  alpha,
  Fade,
  Slide,
  Zoom
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AndroidIcon from "@mui/icons-material/Android";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PaymentsIcon from "@mui/icons-material/Payments";
import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import { keyframes } from "@mui/system";

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LandingPageIntro = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentFeature, setCurrentFeature] = useState(0);

  // Features data for dynamic display
  const features = [
    {
      title: "Instant IMPS Transfers",
      description: "Send money instantly 24/7 with IMPS technology",
      icon: <SpeedIcon sx={{ fontSize: 40, color: "#4ecdc4" }} />,
      color: "#4ecdc4"
    },
    {
      title: "Bank-Level Security",
      description: "Advanced encryption and fraud protection",
      icon: <SecurityIcon sx={{ fontSize: 40, color: "#FCDB62" }} />,
      color: "#FCDB62"
    },
    {
      title: "Track Transactions",
      description: "Real-time monitoring of all your payments",
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#ff6b6b" }} />,
      color: "#ff6b6b"
    }
  ];

  // Rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

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
          background: "radial-gradient(circle at 20% 80%, " + 
            alpha(theme.palette.primary.light, 0.2) + 
            " 0%, transparent 50%), radial-gradient(circle at 80% 20%, " + 
            alpha(theme.palette.secondary.main, 0.2) + 
            " 0%, transparent 50%)",
          zIndex: 0,
        }
      }}
    >
      {/* Background floating elements */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, " + 
            alpha(theme.palette.primary.main, 0.4) + " 0%, transparent 70%)",
          filter: "blur(20px)",
          zIndex: 0,
          animation: `${float} 8s ease-in-out infinite`,
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
          background: "radial-gradient(circle, " + 
            alpha(theme.palette.secondary.main, 0.3) + " 0%, transparent 70%)",
          filter: "blur(15px)",
          zIndex: 0,
          animation: `${float} 10s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "5%",
          width: 100,
          height: 100,
          border: `2px dashed ${alpha("#fff", 0.2)}`,
          borderRadius: "50%",
          animation: `${rotate} 30s linear infinite`,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Grid 
          container 
          spacing={6} 
          sx={{ 
            flexDirection: isMobile ? "column" : "row"
          }}
        >
          {/* LEFT SIDE - Illustration */}
          <Grid 
            item 
            md={6} 
            sm={12} 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              position: "relative",
               
            }}
          >
            <Box 
              sx={{ 
                width: "900px", 
                padding:5,
                maxWidth: 600,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
              
                  
                  width: "100%",
                  height: "100%",
                  background: "radial-gradient(circle, rgba(78, 205, 196, 0.2) 0%, transparent 70%)",
                  zIndex: 0,
                
                  borderRadius: "50%",
                  animation: `${pulse} 8s ease-in-out infinite`,
                }
              }}
            >
              {/* Main illustration */}
              <Box
                sx={{
                  width: "100%",
                  height: 600,
                  background: "linear-gradient(45deg, rgba(78, 205, 196, 0.1), rgba(252, 219, 98, 0.1))",
                  borderRadius: 5,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(5px)",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
                }}
              >
                {/* Animated phone */}
                <Box
                  sx={{
                    width: 200,
                    height: 380,
                    backgroundColor: "#2a3c47",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.1)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(to bottom, #203A43, #2C5364)",
                      p: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <PaymentsIcon sx={{ fontSize: 50, color: "#4ecdc4", mb: 2 }} />
                    <Typography variant="h6" sx={{ color: "#fff", textAlign: "center", mb: 1 }}>
                      IMPS Transfer
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
                      Send money instantly
                    </Typography>
                    <Box sx={{ width: "80%", height: 4, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 2, mt: 3, overflow: "hidden" }}>
                      <Box 
                        sx={{ 
                          height: "100%", 
                          width: "30%", 
                          bgcolor: "#4ecdc4",
                          animation: `${pulse} 2s ease-in-out infinite`,
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Floating icons */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 50,
                    right: 50,
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "rgba(252, 219, 98, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: `${float} 5s ease-in-out infinite`,
                  }}
                >
                  <SecurityIcon sx={{ color: "#FCDB62" }} />
                </Box>
                
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 70,
                    left: 40,
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 107, 107, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: `${float} 7s ease-in-out infinite 1s`,
                  }}
                >
                  <SpeedIcon sx={{ color: "#ff6b6b" }} />
                </Box>
                
                <Box
                  sx={{
                    position: "absolute",
                    top: 100,
                    left: 60,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "rgba(78, 205, 196, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: `${float} 6s ease-in-out infinite 0.5s`,
                  }}
                >
                  <AccountBalanceIcon sx={{ color: "#4ecdc4", fontSize: 20 }} />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT SIDE - Text Content */}
           
            <Box sx={{ mt: { xs: 4, md: 0 }, width:"50%" }}>
              <Slide direction="right" in={true} timeout={1000}>
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
                  Instant Money Transfers <Box component="span" sx={{ color: "#4ecdc4" }}>Made Simple</Box> with{" "}
                  <Box 
                    component="span" 
                    sx={{ 
                      color: "#FCDB62", 
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    IMPS GURU
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
              </Slide>
              
              <Fade in={true} timeout={1500}>
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
                  India's leading IMPS payment solution offering instant, secure, and reliable 
                  money transfers 24/7. Experience banking reimagined with cutting-edge technology 
                  and unparalleled convenience.
                </Typography>
              </Fade>

              <Box 
                sx={{ 
                  display: "flex", 
                  gap: 3, 
                  flexWrap: "wrap",
                  mb: 6,
                  justifyContent: isMobile ? "center" : "flex-start"
                }}
              >
                <Zoom in={true} timeout={1000}>
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
                    Get Started
                  </Button>
                </Zoom>

                <Zoom in={true} timeout={1200}>
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
                    startIcon={<MobileScreenShareIcon />}
                  >
                    Download App
                  </Button>
                </Zoom>
              </Box>

              {/* Dynamic feature display */}
              <Box sx={{ height: 200, mb: 4, position: "relative" }}>
                {features.map((feature, index) => (
                  <Fade 
                    key={index} 
                    in={index === currentFeature} 
                    timeout={800}
                    unmountOnExit
                  >
                    <Card sx={{ 
                      bgcolor: "rgba(255, 255, 255, 0.05)", 
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${alpha(feature.color, 0.3)}`,
                      borderRadius: 3,
                      p: 3,
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      animation: `${pulse} 4s ease-in-out infinite`,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}>
                      <CardContent>
                        {feature.icon}
                        <Typography variant="h6" sx={{ color: "#fff", mb: 1, mt: 2 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                ))}
              </Box>

              {/* Stats section */}
              <Slide direction="up" in={true} timeout={2000}>
                <Grid container spacing={2} sx={{ textAlign: "center" }}>
                  <Grid item xs={4}>
                    <Typography variant="h4" sx={{ color: "#4ecdc4", fontWeight: "bold" }}>
                      10M+
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Transactions
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" sx={{ color: "#FCDB62", fontWeight: "bold" }}>
                      500K+
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Happy Users
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" sx={{ color: "#ff6b6b", fontWeight: "bold" }}>
                      24/7
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Support
                    </Typography>
                  </Grid>
                </Grid>
              </Slide>
            </Box>
          </Grid>
        
      </Container>
    </Box>
  );
};

export default LandingPageIntro;
