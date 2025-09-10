import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import first from '../../assets/Images/Moneytransfer.jpg'
import NavBar from "./Navbar";
import Footer from "./Footer";

// Services data
const services = [
  {
    title: "Mobile Recharge",
    description: "Quick and secure mobile recharge for all operators.Book train tickets instantly at best prices.Book train tickets instantly at best prices.Book train tickets instantly at best prices.Book train tickets instantly at best prices.Book train tickets instantly at best prices.",
    image: first,

    bgColor: "#e3f2fd",
  },
  {
    title: "Train Booking",
    description: "Book train tickets instantly at best prices.Book train tickets instantly at best prices. Book train tickets instantly at best prices. Book train tickets instantly at best prices.",
    image: "https://img.icons8.com/color/256/train.png",
    bgColor: "#f1f8e9",
  },
  {
    title: "Airway Booking",
    description: "Easy flight bookings with multiple options.",
    image: "https://img.icons8.com/color/256/airplane-take-off.png",
    bgColor: "#fff3e0",
  },
  {
    title: "Money Transfer",
    description: "Fast and secure domestic money transfers.",
    image: "https://img.icons8.com/color/256/money-transfer.png",
    bgColor: "#fce4ec",
  },
];

const LandingServices = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
     <NavBar />
<Box sx={{ bgcolor: "#fafafa", width: 1780, mx: "auto" }}>
  {services.map((service, index) => (
    <Box
      key={index}
      sx={{
        bgcolor: service.bgColor,
        py: 8,
        height: 600,
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4} // same gap between image & text
          direction={
            isMobile ? "column" : index % 2 === 0 ? "row" : "row-reverse"
          }
          alignItems="stretch"
          sx={{ height: "100%" }}
        >
          {/* IMAGE SIDE */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              px: 3, // equal side padding
            }}
          >
            <Box
              component="img"
              src={service.image}
              alt={service.title}
              sx={{
                width: "100%",
                maxWidth: 500,
                height: "auto",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>

          {/* TEXT SIDE */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: 3, // equal side padding
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", color: "#1CA895", mb: 2 }}
            >
              {service.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {service.description}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  ))}
</Box>

<Footer />
</>
  );
};

export default LandingServices;
