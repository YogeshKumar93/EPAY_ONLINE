import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Slide,
  Grid,
  Typography,
  Avatar,
  Button,
  Fade,
  useMediaQuery,
  useTheme,
  IconButton,
  Chip,
  Divider,
  Card,
  CardContent,
  alpha,
} from "@mui/material";
import {
  Person,
  CheckCircle,
  Security,
  Phone,
  LockReset,
  Palette,
  Edit,
  Refresh,
  VerifiedUser,
  Email,
  Smartphone,
  AccountCircle,
  VpnKey,
  Settings,
  Dashboard,
} from "@mui/icons-material";
import AuthContext from "../../contexts/AuthContext";
import ResetMpin from "../common/ResetMpin";
import ChangePassword from "../common/ChangePassword";
import ChangeMpin from "../common/ChangeMpin";
import NumberVerificationComponent from "../common/NumberVerificationComponent";
import ChangeLayoutModal from "../Layout/ChangeLayoutModal";
import { BusinessInformation } from "./BusinessInformation";

const ProfilePage = () => {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const username = `GURU1${user?.id}`;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [resetMpinModalOpen, setResetMpinModalOpen] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [changeMpinModal, setChangeMpinModal] = useState(false);
  const [newNumberModal, setNewNumberModal] = useState(false);
  const [changeLayout, setChangeLayout] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
const[businessModal,setBusinessModal]=useState(false)

  // Sync editedUser with user context when user changes
  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);
  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleResetMpin = () => {
    setResetMpinModalOpen(true);
  };

  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };

  const handleChangeMpin = () => setChangeMpinModal(true);

  const handleNewNumber = () => {
    setNewNumberModal(true);
  };

  const handleChangeLayout = () => {
    setChangeLayout(true);
  };

  const handleBusinessInfo = () => {
    setBusinessModal(true);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes logic would go here
      setSuccessMessage("Profile updated successfully!");
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  // Action buttons data for cleaner rendering
  const actionButtons = [
    {
      id: 1,
      label: "Reset MPIN",
      icon: <LockReset sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      onClick: handleResetMpin,
      gradient: "linear-gradient(135deg, #43cea2, #185a9d)",
      hoverGradient: "linear-gradient(135deg, #36d1dc, #5b86e5)",
    },
    {
      id: 2,
      label: "Change Password",
      icon: <VpnKey sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      onClick: handleChangePassword,
      gradient: "linear-gradient(135deg, #ff6b6b, #c0392b)",
      hoverGradient: "linear-gradient(135deg, #ff8e8e, #d35400)",
    },
    {
      id: 3,
      label: "New Number",
      icon: <Phone sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      onClick: handleNewNumber,
      gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
      hoverGradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
    },
    {
      id: 4,
      label: "Change MPIN",
      icon: <VerifiedUser sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      onClick: handleChangeMpin,
      gradient: "linear-gradient(135deg, #ff9a9e, #f6416c)",
      hoverGradient: "linear-gradient(135deg, #ff758c, #ff7eb3)",
    },
    {
      id: 5,
      label: "Change Layout",
      icon: <Dashboard sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      onClick: handleChangeLayout,
      gradient: "linear-gradient(135deg, #a8ff78, #78ffd6)",
      hoverGradient: "linear-gradient(135deg, #c9ffbf, #7bed9f)",
    },
    {
      id: 6,
      label: "Business Information",
      icon: <Dashboard sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      onClick: handleBusinessInfo,
      gradient: "linear-gradient(135deg, #a8ff78, #78ffd6)",
      hoverGradient: "linear-gradient(135deg, #c9ffbf, #7bed9f)",
    },
  ];

  return (
    <Box
      sx={{
        py: 1,
        px: isSmallMobile ? 1 : 2,
      }}
    >
      <Slide in={true} direction="up" timeout={500}>
        <Paper
          elevation={isMobile ? 1 : 4}
          sx={{
            borderRadius: { xs: 2, sm: 4 },
            overflow: "hidden",
              background: "linear-gradient(90deg, #FFD700, #FFA500, #FFD700)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
            },
          }}
        >
          {/* Profile Header */}
          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: "12px 12px 0 0",
              mb: { xs: 2, sm: 3, md: 4 },
              background: "#9D72F0",
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #FFD700, #FFA500, #FFD700)",
                zIndex: 1,
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.03)",
              }}
            />

            {/* Profile Info */}
            <Grid
              container
              spacing={3}
              alignItems="center"
              justifyContent={isMobile ? "center" : "flex-start"}
            >
              {/* Avatar */}
              <Grid item xs={12} sm="auto" sx={{ position: "relative" }}>
                <Avatar
                  sx={{
                    width: { xs: 100, sm: 120, md: 140 },
                    height: { xs: 100, sm: 120, md: 140 },
                    border: "4px solid rgba(255, 215, 0, 0.6)",
                    bgcolor: "rgba(255,255,255,0.15)",
                    mx: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      border: "4px solid rgba(255, 215, 0, 0.8)",
                      boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
                    },
                  }}
                >
                  <Person
                    sx={{
                      fontSize: { xs: 40, sm: 50, md: 60 },
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  />
                </Avatar>
                
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    backgroundColor: "rgba(255, 215, 0, 0.9)",
                    "&:hover": {
                      backgroundColor: "#FFD700",
                    },
                  }}
                  onClick={handleEditToggle}
                >
                  <Edit sx={{ fontSize: 16, color: "#1E3A8A" }} />
                </IconButton>
              </Grid>

              {/* User Info */}
              <Grid item xs={12} sm={8} md={9}>
                {/* Name + Status */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", sm: "flex-start" },
                    gap: 1,
                    mb: 1,
                  }}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        color: "white",
                        fontSize: isMobile ? "1.5rem" : "1.75rem",
                        fontWeight: "bold",
                        width: "100%",
                        maxWidth: "300px",
                      }}
                    />
                  ) : (
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
                  )}
                  <Chip
                    icon={<AccountCircle />}
                    label="Active User"
                    size="small"
                    sx={{
                      background: "rgba(255, 215, 0, 0.9)",
                      color: "#1E3A8A",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                {/* Email */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Email sx={{ fontSize: 20, mr: 1, opacity: 0.9 }} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "4px",
                        padding: "6px 10px",
                        color: "white",
                        width: "100%",
                        maxWidth: "250px",
                      }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      {user?.email}
                    </Typography>
                  )}
                </Box>

                {/* Mobile */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1,
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Smartphone sx={{ fontSize: 20, mr: 1, opacity: 0.8 }} />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.mobile || ""}
                      onChange={(e) =>
                        handleInputChange("mobile", e.target.value)
                      }
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "4px",
                        padding: "6px 10px",
                        color: "white",
                        width: "100%",
                        maxWidth: "200px",
                      }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      {user?.mobile}
                    </Typography>
                  )}
                </Box>

                {/* Username */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1,
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.7, mr: 1 }}>
                    Username:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {username}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

         
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                mt: 3,

                borderRadius: 2,
              }}
            >
              <Grid container spacing={2}>
                {actionButtons.map((button) => (
                  <Grid item xs={12} sm={6} md={4} key={button.id}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={button.onClick}
                      startIcon={button.icon}
                      sx={{
                        height: 50,
                        minWidth: "100%",
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        justifyContent: "flex-start",
                        pl: 2,
                        background: button.gradient,
                        boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                        "&:hover": {
                          background: button.hoverGradient,
                          transform: "translateY(-3px)",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
                        },
                        transition: "all 0.25s ease",
                      }}
                    >
                      {button.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Success Message */}
          {successMessage && (
            <Fade in={true}>
              <Box
                sx={{
                  p: 2,
                  m: 2,
                  background:
                    "linear-gradient(90deg, #4caf50, #81c784, #66bb6a)",
                  color: "white",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 4px 12px rgba(76, 175, 80, 0.4)",
                  textAlign: "center",
                  animation: "pulse 2s infinite",
                }}
              >
                <CheckCircle sx={{ mr: 1 }} />
                <Typography fontWeight="500">{successMessage}</Typography>
              </Box>
            </Fade>
          )}

          {/* Actions Section */}
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
      {changePasswordModal && (
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

      {newNumberModal && (
        <NumberVerificationComponent
          open={newNumberModal}
          onClose={() => setNewNumberModal(false)}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setNewNumberModal(false);
          }}
          username={user?.username}
        />
      )}

      {changeLayout && (
        <ChangeLayoutModal
          open={changeLayout}
          onClose={() => setChangeLayout(false)}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setChangeLayout(false);
          }}
          username={user?.username}
        />
      )}
      {businessModal && (
        <BusinessInformation
          open={businessModal}
          onClose={() => setBusinessModal(false)}
        />
      )}
    </Box>
  );
};
export default ProfilePage;
