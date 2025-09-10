import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Container,
} from "@mui/material";
import Footer from "./Footer";
import NavBar from "./Navbar";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const LandingContactUs = () => {
  const contacts = [
    { id: 1, label: "Admin", name: "John Smith", phone: "+1 (555) 123-4567", email: "john.smith@example.com" },
    { id: 2, label: "ZSM", name: "Sarah Johnson", phone: "+1 (555) 234-5678", email: "sarah.johnson@example.com" },
    { id: 3, label: "ASM", name: "Michael Brown", phone: "+1 (555) 345-6789", email: "michael.brown@example.com" },
    { id: 4, label: "MD", name: "Emily Davis", phone: "+1 (555) 456-7890", email: "emily.davis@example.com" },
    { id: 5, label: "AD", name: "Robert Wilson", phone: "+1 (555) 567-8901", email: "robert.wilson@example.com" },
    { id: 6, label: "DD", name: "Jennifer Lee", phone: "+1 (555) 678-9012", email: "jennifer.lee@example.com" },
    { id: 7, label: "RET", name: "David Miller", phone: "+1 (555) 789-0123", email: "david.miller@example.com" },
  ];

  return (
    <>
      <NavBar />

      <Box sx={{ width: 1650, py: 10, bgcolor: "#f1f5f9" }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: "linear-gradient(90deg, #7f00ff, #e100ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            mb={6}
          >
            Have questions? Send us a message and reach out directly.
          </Typography>

          {/* Contact Form */}
          <Card sx={{ p: 5, borderRadius: 4, boxShadow: "0 20px 50px rgba(0,0,0,0.08)", mb: 10 }}>
            <Typography
              variant="h4"
              mb={4}
              fontWeight="bold"
              sx={{
                background: "linear-gradient(90deg, #7f00ff, #e100ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Send a Message
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Your Name" variant="outlined" size="medium" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Your Email" type="email" variant="outlined" size="medium" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Phone Number" variant="outlined" size="medium" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Subject"
                  variant="outlined"
                  size="medium"
                  defaultValue=""
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                >
                  <MenuItem value="">Select a subject</MenuItem>
                  {contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.label}>
                      {contact.label} - {contact.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Message" multiline rows={6} variant="outlined" size="medium" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
              </Grid>

              <Grid item xs={12} textAlign="center">
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 8,
                    py: 1.8,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderRadius: 3,
                    background: "linear-gradient(120deg, #7f00ff, #e100ff)",
                    "&:hover": { background: "linear-gradient(120deg, #e100ff, #7f00ff)" },
                  }}
                >
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* Contact Cards - Single Row */}
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 3,
              pb: 2,
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#7f00ff", borderRadius: 4 },
              "&::-webkit-scrollbar-track": { bgcolor: "#f1f5f9" },
            }}
          >
            {contacts.map((contact, index) => (
              <Card
                key={contact.id}
                sx={{
                  minWidth: 250,
                  flex: "0 0 auto",
                  borderRadius: 4,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  transition: "all 0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },
                }}
              >
                <Box sx={{
                  background: index % 2 === 0 ? "#7f00ff" : "#e100ff",
                  p: 2,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  color: "white",
                  fontWeight: "bold",
                }}>
                  {contact.label}
                </Box>
                <CardContent sx={{ bgcolor: "#fff", borderRadius: "0 0 16px 16px" }}>
                  <Typography variant="h6" fontWeight="600" mb={1}>
                    {contact.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <PhoneIcon sx={{ mr: 1, color: "#7f00ff" }} /> <Typography variant="body2">{contact.phone}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmailIcon sx={{ mr: 1, color: "#e100ff" }} /> <Typography variant="body2">{contact.email}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default LandingContactUs;
