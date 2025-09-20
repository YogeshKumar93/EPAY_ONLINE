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

const LandingPageIntro2 = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentFeature, setCurrentFeature] = useState(0);

  // Features data for dynamic display
  const features = [
    {
      title: "Real-time Transfers",
      description: "Send money instantly with our advanced technology",
      icon: <SpeedIcon sx={{ fontSize: 40, color: "#FF6B8B" }} />,
      color: "#FF6B8B"
    },
    {
      title: "Military-grade Security",
      description: "Bank-level encryption and fraud protection",
      icon: <SecurityIcon sx={{ fontSize: 40, color: "#6A67CE" }} />,
      color: "#6A67CE"
    },
    {
      title: "Smart Analytics",
      description: "Track and analyze all your financial activities",
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#20BF55" }} />,
      color: "#20BF55"
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
        background: "linear-gradient(to right, #1A1A2E 0%, #16213E 50%, #0F3460 100%)",
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
          background: "radial-gradient(circle at 20% 50%, " + 
            alpha("#E94584", 0.15) + 
            " 0%, transparent 50%), radial-gradient(circle at 80% 80%, " + 
            alpha("#533483", 0.15) + 
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
          left: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, " + 
            alpha("#E94584", 0.2) + " 0%, transparent 70%)",
          filter: "blur(20px)",
          zIndex: 0,
          animation: `${float} 8s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, " + 
            alpha("#533483", 0.2) + " 0%, transparent 70%)",
          filter: "blur(15px)",
          zIndex: 0,
          animation: `${float} 10s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          right: "15%",
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
            flexDirection: isMobile ? "column-reverse" : "row"
          }}
        >
          {/* LEFT SIDE - Text Content */}
          <Grid item md={6} sm={12}>
            <Box sx={{ mt: { xs: 4, md: 0 } }}>
              <Slide direction="left" in={true} timeout={1000}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                    fontWeight: 800,
                    mb: 2,
                    lineHeight: 1.1,
                    color: "#fff",
                    fontFamily: "'Poppins', sans-serif",
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                  }}
                >
                  The Future of <Box component="span" sx={{ color: "#FF6B8B" }}>Digital</Box> Payments is Here
                </Typography>
              </Slide>
              
              <Fade in={true} timeout={1500}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                    mb: 4,
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: 1.6,
                    fontFamily: "'Poppins', sans-serif",
                    maxWidth: "90%"
                  }}
                >
                  Experience seamless money transfers with our next-generation platform. 
                  Send and receive funds instantly with cutting-edge security and 
                  intuitive design that makes finance feel effortless.
                </Typography>
              </Fade>

              <Box 
                sx={{ 
                  display: "flex", 
                  gap: 3, 
                  flexWrap: "wrap",
                  mb: 6
                }}
              >
                <Zoom in={true} timeout={1000}>
                  <Button
                    variant="contained"
                    sx={{ 
                      bgcolor: "#FF6B8B", 
                      color: "#fff", 
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: "0 4px 20px rgba(255, 107, 139, 0.4)",
                      "&:hover": {
                        bgcolor: "#e55a7d",
                        boxShadow: "0 6px 25px rgba(255, 107, 139, 0.6)",
                        transform: "translateY(-3px)"
                      },
                      transition: "all 0.3s ease"
                    }}
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/qrLogin")}
                  >
                    Get Started
                  </Button>
                </Zoom>

                <Zoom in={true} timeout={1200}>
                  <Button
                    variant="outlined"
                    sx={{ 
                      borderColor: "#6A67CE", 
                      color: "#6A67CE", 
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "rgba(106, 103, 206, 0.1)",
                        borderColor: "#6A67CE",
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
                      textAlign: "left",
                      transition: "all 0.3s ease",
                      animation: `${pulse} 4s ease-in-out infinite`,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}>
                      <CardContent sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ mr: 3 }}>
                          {feature.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                ))}
              </Box>

              {/* Stats section */}
              <Slide direction="up" in={true} timeout={2000}>
                <Grid container spacing={2} sx={{ textAlign: "center" }}>
                  <Grid item xs={4}>
                    <Typography variant="h4" sx={{ color: "#FF6B8B", fontWeight: "bold" }}>
                      15M+
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Transactions
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" sx={{ color: "#6A67CE", fontWeight: "bold" }}>
                      99.9%
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Uptime
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" sx={{ color: "#20BF55", fontWeight: "bold" }}>
                      128-bit
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Encryption
                    </Typography>
                  </Grid>
                </Grid>
              </Slide>
            </Box>
          </Grid>

          {/* RIGHT SIDE - Illustration */}
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
                width: "100%", 
                maxWidth: 600,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: "radial-gradient(circle, rgba(255, 107, 139, 0.2) 0%, transparent 70%)",
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
                  height: 500,
                  background: "linear-gradient(45deg, rgba(255, 107, 139, 0.1), rgba(106, 103, 206, 0.1))",
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
                {/* Animated dashboard illustration */}
                <Box
                  sx={{
                    width: "80%",
                    height: 350,
                    backgroundColor: "#1E2A3B",
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
                      background: "linear-gradient(to bottom, #1A1A2E, #16213E)",
                      p: 3,
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    {/* Dashboard header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Typography variant="h6" sx={{ color: "#FF6B8B", fontWeight: "bold" }}>
                        Payment Dashboard
                      </Typography>
                      <Box sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: "#6A67CE" }}></Box>
                    </Box>
                    
                    {/* Dashboard content */}
                    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                            Total Balance
                          </Typography>
                          <Typography variant="h5" sx={{ color: "#fff" }}>
                            $12,458.00
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                            This Month
                          </Typography>
                          <Typography variant="h6" sx={{ color: "#20BF55" }}>
                            +$2,548.00
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Box sx={{ width: "45%", height: 8, bgcolor: "#FF6B8B", borderRadius: 4 }}></Box>
                          <Box sx={{ width: "45%", height: 8, bgcolor: "#6A67CE", borderRadius: 4 }}></Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            Income
                          </Typography>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            Expenses
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#FF6B8B",
                            color: "#fff",
                            borderRadius: 3,
                            px: 3,
                            py: 1,
                            fontSize: "0.9rem"
                          }}
                          startIcon={<PaymentsIcon />}
                        >
                          New Transfer
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Floating icons */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 30,
                    left: 30,
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "rgba(106, 103, 206, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: `${float} 5s ease-in-out infinite`,
                  }}
                >
                  <SecurityIcon sx={{ color: "#6A67CE" }} />
                </Box>
                
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 40,
                    right: 40,
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 107, 139, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: `${float} 7s ease-in-out infinite 1s`,
                  }}
                >
                  <SpeedIcon sx={{ color: "#FF6B8B" }} />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPageIntro2;