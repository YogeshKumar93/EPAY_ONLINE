import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  Avatar,
} from "@mui/material";

// Icons
import SecurityIcon from "@mui/icons-material/Security";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import ShutterSpeedIcon from "@mui/icons-material/ShutterSpeed";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ApartmentIcon from "@mui/icons-material/Apartment";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import FlagIcon from "@mui/icons-material/Flag";

// Import your images
import aboutUsImg from "../../assets/Images/abouUs2.png";  
import NavBar from "./Navbar";
import Footer from "./Footer";
 

// Sample why choose us data
const mWhyChooseUs = [
  { icon: <SecurityIcon />, title: "Secure Payments", body: "Your safety is our top priority." },
  { icon: <HandshakeOutlinedIcon />, title: "Reliable Support", body: "We’re here to help 24/7." },
  { icon: <EmojiObjectsIcon />, title: "Smart Innovation", body: "Technology built for growth." },
  { icon: <IntegrationInstructionsIcon />, title: "Easy Integration", body: "Seamlessly connects everywhere." },
];

const values = [
  {
    icon: <SecurityIcon />,
    title: "Security",
    desc: "Secure transactions, trusted payments",
  },
  {
    icon: <HandshakeOutlinedIcon />,
    title: "Customer Support",
    desc: "Here to help, every step of the way",
  },
  {
    icon: <EmojiObjectsIcon />,
    title: "Innovation",
    desc: "Innovation that inspires progress",
  },
  {
    icon: <ShutterSpeedIcon />,
    title: "Transparency",
    desc: "Honesty shines through transparency",
  },
];

const stats = [
    { 
      icon: <StorefrontIcon />, 
      number: "5000+", 
      label: "Merchants onboarded", 
      bg: "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)" 
    },
    { 
      icon: <GroupAddIcon />, 
      number: "11 Lakh+", 
      label: "Happy customers", 
      bg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" 
    },
    { 
      icon: <ApartmentIcon />, 
      number: "5000+", 
      label: "Cities covered", 
      bg: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)" 
    },
    { 
      icon: <TrendingUpOutlinedIcon />, 
      number: "5,00,000+", 
      label: "Monthly transactions", 
      bg: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" 
    },
  ];

const LandingAboutUs = () => {
  return (
    <>
      <NavBar />

      <div id="about-us" className="aboutUs" style={{ backgroundColor: "#f8fafc" }}>
        {/* Hero Section */}
         <Grid item xs={12} md={6}>
              <img
                src={aboutUsImg}
                alt="About us"
                style={{
                  width: 1700,
                  height:400,
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Grid>
      <Box
  sx={{
    background: "linear-gradient(135deg, #FF6B6B 0%, #FFD93D 50%, #6BCB77 100%)",
    color: "white",
    py: { xs: 6, md: 10 },
    textAlign: "center",
    borderRadius: "0 0 40px 40px",
    mb: 4,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* Optional floating circles for decoration */}
  <Box
    sx={{
      position: "absolute",
      width: 200,
      height: 200,
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      top: -50,
      left: -50,
    }}
  />
  <Box
    sx={{
      position: "absolute",
      width: 300,
      height: 300,
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.08)",
      bottom: -100,
      right: -100,
    }}
  />

  <Container maxWidth="lg">
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        mb: 2,
        fontSize: { xs: "1.25rem", md: "2rem" },
        textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
      }}
    >
      Unlocking the Potential of Fintech Across India
    </Typography>

    <Typography
      variant="h6"
      sx={{
        maxWidth: "900px",
        mx: "auto",
        fontSize: { xs: "1rem", md: "1.25rem" },
        opacity: 0.95,
        lineHeight: 1.6,
      }}
    >
      Established by professionals with decades of BFSI experience, we focus on unlocking the deep market potential of financial transactions and fintech across India.
    </Typography>
  </Container>
</Box>


        {/* Values Section */}
    <Box
  sx={{
    width: "100%",
    py: { xs: 8, md: 12 },
    background: "linear-gradient(to right, #6262C6, #13C3C1)",
  }}
>
  <Container maxWidth="xl">
    {/* Title */}
    <Typography
      variant="h3"
      align="center"
      sx={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "bold",
        mb: { xs: 4, md: 8 },
        color: "white",
        textShadow: "2px 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      Our Values
    </Typography>

    {/* Cards Grid */}
    <Grid container spacing={4} justifyContent="center">
      {values.map((item, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Card
            sx={{
              textAlign: "center",
              borderRadius: 4,
              p: 3,
              height: "100%",
              background: `linear-gradient(135deg, ${
                idx % 2 === 0 ? "#FF6B6B" : "#FFD93D"
              }, ${idx % 2 === 0 ? "#6BCB77" : "#4D96FF"})`,
              color: "white",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px) scale(1.05)",
                boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
              },
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                fontSize: 40,
              }}
            >
              {React.cloneElement(item.icon, { sx: { fontSize: 40, color: "white" } })}
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: "white",
              }}
            >
              {item.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.6,
              }}
            >
              {item.desc}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>


        {/* Stats Section */}
        <Container maxWidth="xl" sx={{ mb: 8 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4, color: "#1e293b" }}
          >
            Our Impact in Numbers
          </Typography>

          <Grid container spacing={3}>
            {stats.map((stat, idx) => (
              <Grid item xs={6} key={idx}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    borderRadius: 4,
                    background: stat.bg,
                    color: "#1e293b",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {React.cloneElement(stat.icon, {
                    sx: {
                      fontSize: 48,
                      color: "#1e293b",
                      mb: 1,
                    },
                  })}
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#1e293b" }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "#334155" }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>

        {/* Features Section */}
       <Box sx={{ backgroundColor: "#fef6f0", py: 10 }}>
  <Container maxWidth="xl">
    {/* Section Heading */}
    <Typography
      variant="h3"
      sx={{
        textAlign: "center",
        fontWeight: "bold",
        mb: 2,
        background: "linear-gradient(90deg, #FF6B6B, #FFD93D)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Why Partner with Us?
    </Typography>
    <Typography
      variant="h6"
      sx={{
        textAlign: "center",
        mb: 8,
        maxWidth: 600,
        mx: "auto",
        color: "#7e7e7e",
      }}
    >
      Thousands trust us to manage their finances efficiently and securely. Here’s why.
    </Typography>

    <Grid container spacing={6}>
      {mWhyChooseUs.map((item, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card
            sx={{
              p: 4,
              height: "100%",
              borderRadius: 4,
              background: "linear-gradient(135deg, #f5f7fa, #e4f0ff)",
              boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
              transition: "all 0.4s ease",
              "&:hover": {
                transform: "translateY(-10px) scale(1.03)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Avatar
                sx={{
                  background: "linear-gradient(135deg, #FF6B6B, #FFD93D)",
                  color: "white",
                  mr: 3,
                  width: 60,
                  height: 60,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                  fontSize: "1.5rem",
                }}
              >
                {item.icon}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    color: "#333",
                    fontSize: "1.2rem",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.6 }}>
                  {item.body}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>


        {/* Mission & Vision */}
      <Container maxWidth="xl" sx={{ py: 12 }}>
      <Grid container spacing={8}>
        {/* Vision Card */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "#F0F9FF",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "flex-start",
              transition: "transform 0.3s",
              "&:hover": { transform: "translateY(-5px)" },
            }}
          >
            <Box
              sx={{
                backgroundColor: "#3B82F6",
                color: "white",
                width: 60,
                height: 60,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                fontWeight: "bold",
                mr: 3,
              }}
            >
              <LightbulbIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1E3A8A", mb: 1 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8 }}>
                To become India's most trusted digital financial solutions provider for the unorganized sector.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Mission Card */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "#FEF3C7",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "flex-start",
              transition: "transform 0.3s",
              "&:hover": { transform: "translateY(-5px)" },
            }}
          >
            <Box
              sx={{
                backgroundColor: "#F59E0B",
                color: "white",
                width: 60,
                height: 60,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                fontWeight: "bold",
                mr: 3,
              }}
            >
              <FlagIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#B45309", mb: 1 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8 }}>
                To serve as a one-stop digital payment and banking hub for the unorganized retail sector.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
      </div>

      <Footer  />
    </>
  );
};

export default LandingAboutUs;


 