import React, { useContext, useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Grid,
  Button,
  Fade,
  Card,
  CardContent,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Security,
  LockReset,
  PhoneIphone,
  Person,
  Email,
  CheckCircle,
} from "@mui/icons-material";
import AuthContext from "../../contexts/AuthContext";
import ResetMpin from "../common/ResetMpin";
import ChangePassword from "../common/ChangePassword";
import ChangeMpin from "../common/ChangeMpin";
import NumberVerificationComponent from "../common/NumberVerificationComponent";
import ChangeLayoutModal from "../Layout/ChangeLayoutModal";

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const username = `GURU1${user?.id}`;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [resetMpinModalOpen, setResetMpinModalOpen] = useState(false);
  const [chagnePasswordModal, setChagnePasswordModal] = useState(false);
  const [changeMpinModal, setChangeMpinModal] = useState(false);
  const [newNumberModal, setNewNumberModal] = useState(false);
  const [changeLayout, setChangeLayout] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetMpin = () => {
    setResetMpinModalOpen(true);
  };

  const handelChangePassowrd = () => {
    setChagnePasswordModal(true);
  };

  const handleChangeMpin = () => setChangeMpinModal(true);

  const handleNewNumber = () => {
    setNewNumberModal(true);
  };

  const handleChangeLayout = () => {
    setChangeLayout((prev) => !prev);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 1, px: isSmallMobile ? 1 : 2 }}>
      <Slide in={true} direction="up" timeout={500}>
        <Paper
          elevation={isMobile ? 0 : 10}
          sx={{
            borderRadius: { xs: 2, sm: 4 },
            overflow: "hidden",
            background: "linear-gradient(145deg, #f9fafc, #eef1f7)",
            p: { xs: 1.5, sm: 3, md: 4 },
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          }}
        >
          {/* Profile Header */}
          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              mb: { xs: 2, sm: 3, md: 4 },
              // mb: 4,
             
              background: "#1E3A8A",
              color: "white",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Grid
              container
              spacing={3}
              alignItems="center"
              justifyContent={isMobile ? "center" : "flex-start"}
            >
              <Grid item xs={12} sm="auto">
                <Avatar
                  sx={{
                    width: { xs: 100, sm: 120, md: 130 },
                    height: { xs: 100, sm: 120, md: 130 },
                    border: "5px solid rgba(235, 232, 9, 0.4)",
                    bgcolor: "rgba(255,255,255,0.2)",
                    mx: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Person sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />
                </Avatar>
              </Grid>
              <Grid item xs={12} sm={8} md={9}>
                <Typography
                  variant={isSmallMobile ? "h4" : isMobile ? "h3" : "h3"}
                  fontWeight="bold"
                  sx={{
                    letterSpacing: "0.5px",
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    mt: 1,
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  {user?.email}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.8, textAlign: { xs: "center", sm: "left" } }}
                >
                  📱 {user?.mobile}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    opacity: 0.7,
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  Username: <strong>{username}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Success Message */}
          {successMessage && (
            <Fade in={true}>
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  background:
                    "linear-gradient(90deg, #4caf50, #81c784, #66bb6a)",
                  color: "white",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 4px 12px rgba(76, 175, 80, 0.4)",
                  textAlign: "center",
                }}
              >
                <CheckCircle sx={{ mr: 1 }} />
                <Typography fontWeight="500">{successMessage}</Typography>
              </Box>
            </Fade>
          )}

          {/* Actions Section */}
          <Grid container spacing={2} justifyContent="center">
            {/* Reset MPIN */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  borderRadius: 3,
                  transition: "0.3s",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant={isSmallMobile ? "h6" : "h5"}
                    gutterBottom
                    color="primary"
                    fontWeight="600"
                  >
                    Reset MPIN
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    Reset your MPIN quickly with OTP verification.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleResetMpin}
                    sx={{
                      py: 1.2,
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                      background: "linear-gradient(135deg, #43cea2, #185a9d)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
                      },
                    }}
                    fullWidth
                  >
                    Reset MPIN
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Change Password */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  borderRadius: 3,
                  transition: "0.3s",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant={isSmallMobile ? "h6" : "h5"}
                    gutterBottom
                    color="secondary"
                    fontWeight="600"
                  >
                    Change Password
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    Update your account password for better security.
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handelChangePassowrd}
                    sx={{
                      py: 1.2,
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                      "&:hover": { bgcolor: "secondary.dark" },
                    }}
                    fullWidth
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* New Number */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  borderRadius: 3,
                  transition: "0.3s",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant={isSmallMobile ? "h6" : "h5"}
                    gutterBottom
                    color="info.main"
                    fontWeight="600"
                  >
                    New Number
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    Add and verify a new mobile number.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleNewNumber}
                    sx={{
                      py: 1.2,
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                      background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #43e97b, #38f9d7)",
                      },
                    }}
                    fullWidth
                  >
                    New Number
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Change MPIN */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  borderRadius: 3,
                  transition: "0.3s",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant={isSmallMobile ? "h6" : "h5"}
                    gutterBottom
                    color="warning.main"
                    fontWeight="600"
                  >
                    Change MPIN
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    Change your existing MPIN securely.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleChangeMpin}
                    sx={{
                      py: 1.2,
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                      background: "linear-gradient(135deg, #ff9a9e, #f6416c)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
                      },
                    }}
                    fullWidth
                  >
                    Change MPIN
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Change Layout */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  borderRadius: 3,
                  transition: "0.3s",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant={isSmallMobile ? "h6" : "h5"}
                    gutterBottom
                    color="warning.main"
                    fontWeight="600"
                  >
                    Change Layout
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    Change your existing layout securely.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleChangeLayout}
                    sx={{
                      py: 1.2,
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                      background: "linear-gradient(135deg, #ff9a9e, #f6416c)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
                      },
                    }}
                    fullWidth
                  >
                    Change Layout
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Slide>

      {/* Modals */}
      {resetMpinModalOpen && (
        <ResetMpin
          open={resetMpinModalOpen}
          onClose={() => setResetMpinModalOpen(false)}
          username={username}
        />
      )}
      {chagnePasswordModal && (
        <ChangePassword
          open={chagnePasswordModal}
          onClose={() => setChagnePasswordModal(false)}
          username={username}
        />
      )}
      {changeMpinModal && (
        <ChangeMpin
          open={changeMpinModal}
          onClose={() => setChangeMpinModal(false)}
        />
      )}

      {/* New Number Modal */}
      <NumberVerificationComponent
        open={newNumberModal}
        onClose={() => setNewNumberModal(false)}
        onSuccess={(message) => {
          setSuccessMessage(message);
          setNewNumberModal(false);
        }}
        username={user?.username}
      />

      <ChangeLayoutModal
        open={changeLayout}
        onClose={() => setChangeLayout(false)}
        onSuccess={(message) => {
          setSuccessMessage(message);
          setChangeLayout(false);
        }}
        username={user?.username}
      />
    </Container>
  );
};
export default ProfilePage;
