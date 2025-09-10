import React from "react";
import {
  Box,
  Container,
  Grid,
  Button,
  Typography,
  Fade,
  Zoom,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import TrainIcon from "@mui/icons-material/Train";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import SecurityIcon from "@mui/icons-material/Security";
import image from "../../assets/Images/BackgroundLogin2.jpg"; // replace with your PNG

const LandingPageIntro1 = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Mobile Recharge",
      desc: "Recharge your prepaid mobile instantly with secure transactions.",
      icon: <SmartphoneIcon sx={{ fontSize: 40, color: "#1CA895" }} />,
    },
    {
      title: "IRCTC Bookings",
      desc: "Book train tickets quickly and easily with IRCTC integration.",
      icon: <TrainIcon sx={{ fontSize: 40, color: "#1CA895" }} />,
    },
    {
      title: "Money Transfer",
      desc: "Send money instantly to any bank with reliable security.",
      icon: <CurrencyRupeeIcon sx={{ fontSize: 40, color: "#1CA895" }} />,
    },
    {
      title: "Secure Payments",
      desc: "Your transactions are encrypted and 100% safe with us.",
      icon: <SecurityIcon sx={{ fontSize: 40, color: "#1CA895" }} />,
    },
  ];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#fdfbfb" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* LEFT SIDE - IMAGE */}
          <Grid
            item
            md={6}
            sm={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Fade in timeout={1200}>
              <Box
                component="img"
                src={image}
                alt="Payment App"
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  borderRadius: 4,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                }}
              />
            </Fade>
          </Grid>

          {/* RIGHT SIDE - TEXT CONTENT */}
          <Grid item md={6} sm={12}>
            <Fade in timeout={1000}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3.2rem" },
                  lineHeight: 1.2,
                  mb: 3,
                  color: "#2d3436",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Fast, Secure & Easy{" "}
                <Box component="span" sx={{ color: "#1CA895" }}>
                  Payments
                </Box>{" "}
                Anytime.
              </Typography>
            </Fade>

            <Fade in timeout={1400}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  lineHeight: 1.8,
                  color: "rgba(0,0,0,0.7)",
                  mb: 4,
                  maxWidth: "95%",
                }}
              >
                Experience the next-generation money transfer solution. Send
                money instantly, track transactions, and enjoy reliable
                security—all in one simple app.
              </Typography>
            </Fade>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Zoom in timeout={1000}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#1CA895",
                    color: "#fff",
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    "&:hover": {
                      bgcolor: "#189e88",
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </Button>
              </Zoom>

              <Zoom in timeout={1200}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#1CA895",
                    color: "#1CA895",
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    "&:hover": {
                      bgcolor: "rgba(28,168,149,0.08)",
                      borderColor: "#1CA895",
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Learn More
                </Button>
              </Zoom>
            </Box>
          </Grid>
        </Grid>

        {/* SERVICES SECTION */}
        <Box sx={{ mt: 10 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 6,
              color: "#2d3436",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Services We Provide
          </Typography>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1000 + index * 300}>
                  <Card
                    sx={{
                      textAlign: "center",
                      p: 3,
                      borderRadius: 4,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent>
                      {service.icon}
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mt: 2, mb: 1 }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(0,0,0,0.6)" }}
                      >
                        {service.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPageIntro1;
