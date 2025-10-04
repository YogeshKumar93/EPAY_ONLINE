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
import ProfileTabs from "./ProfileTabs";
// import ProfileTabs from "./ProfileTabs";

const ProfilePage = () => {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const username = `P2PAE${user?.id}`;
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
  const [businessModal, setBusinessModal] = useState(false);
  const [viewInfoModalOpen, setViewInfoModalOpen] = useState(false);

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
  const allowedRolesForLayout = ["dd", "ret"];
  const userRole = authCtx.user.role; // assuming you have access to user role

  const actionButtons = [
    {
      id: 1,
      label: "Reset MPIN",
      icon: <LockReset sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      onClick: handleResetMpin,
      gradient: "#fff",
      hoverGradient: "linear-gradient(135deg, #36d1dc, #5b86e5)",
    },
    {
      id: 2,
      label: "Change Password",
      icon: <VpnKey sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      onClick: handleChangePassword,
      gradient: "#fff",
      hoverGradient: "linear-gradient(135deg, #ff8e8e, #d35400)",
    },
    {
      id: 3,
      label: "Change MPIN",
      icon: <VerifiedUser sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      onClick: handleChangeMpin,
      gradient: "#fff",
      hoverGradient: "linear-gradient(135deg, #ff758c, #ff7eb3)",
    },
    // {
    //   id: 4,
    //   label: "Change Layout",
    //   icon: <Dashboard sx={{ fontSize: { xs: 18, sm: 20 } }} />,
    //   onClick: handleChangeLayout,
    //   gradient: "#fff",
    //   hoverGradient: "linear-gradient(135deg, #c9ffbf, #7bed9f)",
    // },
    {
      id: 5,
      label: "View Information",
      icon: <Dashboard sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      onClick: () => setViewInfoModalOpen(true),
      gradient: "#fff",
      hoverGradient: "linear-gradient(135deg, #c9ffbf, #7bed9f)",
    },
  ].filter(
    (btn) =>
      btn.label !== "Change Layout" || allowedRolesForLayout.includes(userRole)
  );

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
            background: "linear-gradient(135deg, #f9f5ff 0%, #f0e8ff 100%)",
            boxShadow: "0 10px 30px rgba(157, 114, 240, 0.15)",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 15px 40px rgba(157, 114, 240, 0.25)",
            },
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: "12px 12px 0 0",
              mb: { xs: 2, sm: 3, md: 4 },
              background: "linear-gradient(135deg, #9D72F0 0%, #7B4DE0 100%)",
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
                background: "#9D72F0",
                zIndex: 1,
              },
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
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
                background: "rgba(255,255,255,0.05)",
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
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    sx={{
                      width: { xs: 100, sm: 120, md: 140 },
                      height: { xs: 100, sm: 120, md: 140 },
                      border: "4px solid rgba(255, 255, 255, 0.3)",
                      bgcolor: "rgba(255,255,255,0.15)",
                      mx: "auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        border: "4px solid rgba(255, 215, 0, 0.8)",
                        boxShadow: "0 0 25px rgba(255, 215, 0, 0.5)",
                      },
                    }}
                  >
                    <Person
                      sx={{
                        fontSize: { xs: 40, sm: 50, md: 60 },
                        color: "white",
                      }}
                    />
                  </Avatar>

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 5,
                      right: 5,
                      backgroundColor: "rgba(255, 215, 0, 0.95)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      "&:hover": {
                        backgroundColor: "#FFD700",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    // onClick={handleEditToggle}
                  >
                    <Edit sx={{ fontSize: 16, color: "#1E3A8A" }} />
                  </IconButton>
                </Box>
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
                        background: "rgba(255,255,255,0.25)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        color: "white",
                        fontSize: isMobile ? "1.5rem" : "1.75rem",
                        fontWeight: "bold",
                        width: "100%",
                        maxWidth: "300px",
                        fontFamily: '"DM Sans", sans-serif',
                        outline: "none",
                      }}
                      placeholder="Full Name"
                    />
                  ) : (
                    <Typography
                      variant={isSmallMobile ? "h4" : isMobile ? "h3" : "h3"}
                      fontWeight="bold"
                      sx={{
                        color: "#000",
                        letterSpacing: "0.5px",

                        textAlign: { xs: "center", sm: "left" },
                        fontFamily: '"DM Sans", sans-serif',
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {user?.name}
                    </Typography>
                  )}
                  <Chip
                    icon={<AccountCircle sx={{ color: "#2275b7" }} />}
                    label="Active User"
                    size="small"
                    sx={{
                      background: "rgba(255, 255, 255, 0.9)",
                      color: "#2275b7",
                      fontWeight: "bold",
                      fontFamily: '"DM Sans", sans-serif',
                      ml: 1,
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
                  <Email sx={{ fontSize: 20, mr: 1.5, opacity: 0.9 }} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      style={{
                        background: "rgba(255,255,255,0.25)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        color: "white",
                        width: "100%",
                        maxWidth: "250px",
                        fontFamily: '"DM Sans", sans-serif',
                        outline: "none",
                      }}
                      placeholder="Email Address"
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        opacity: 0.9,
                        color: "white",
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {user?.email}
                    </Typography>
                  )}
                </Box>

                {/* Mobile */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1.5,
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Smartphone sx={{ fontSize: 20, mr: 1.5, opacity: 0.9 }} />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.mobile || ""}
                      onChange={(e) =>
                        handleInputChange("mobile", e.target.value)
                      }
                      style={{
                        background: "rgba(255,255,255,0.25)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        color: "white",
                        width: "100%",
                        maxWidth: "200px",
                        fontFamily: '"DM Sans", sans-serif',
                        outline: "none",
                      }}
                      placeholder="Mobile Number"
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        opacity: 0.9,
                        color: "white",
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {user?.mobile}
                    </Typography>
                  )}
                </Box>

                {/* Username */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1.5,
                    justifyContent: { xs: "center", sm: "flex-start" },
                    background: "rgba(255,255,255,0.15)",
                    p: 1,
                    borderRadius: 1,
                    maxWidth: "fit-content",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      mr: 1,
                      color: "white",
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    Username:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{
                      color: "white",
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    {username}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Action Buttons Section */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              mt: 1,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                color: "#000",
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Account Actions
            </Typography>

            <Grid container spacing={2} justifyContent={"center"}>
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
                      color: "#000",
                      background: button.gradient,

                      "&:hover": {
                        // background: button.hoverGradient,
                        transform: "translateY(-3px)",
                      },
                      transition: "all 0.25s ease",
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    {button.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
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
                  fontFamily: '"DM Sans", sans-serif',
                }}
              >
                <CheckCircle sx={{ mr: 1 }} />
                <Typography fontWeight="500" fontFamily='"DM Sans", sans-serif'>
                  {successMessage}
                </Typography>
              </Box>
            </Fade>
          )}
          {user?.status === 1 && <ProfileTabs />}
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
          open={changePasswordModal}
          onClose={() => setChangePasswordModal(false)}
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

      {/* {changeLayout && (
        <ChangeLayoutModal
          open={changeLayout}
          onClose={() => setChangeLayout(false)}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setChangeLayout(false);
          }}
          username={user?.username}
        />
      )} */}
      {businessModal && (
        <BusinessInformation
          open={businessModal}
          onClose={() => setBusinessModal(false)}
        />
      )}
      {viewInfoModalOpen && (
        <ProfileTabs
          open={viewInfoModalOpen}
          onClose={() => setViewInfoModalOpen(false)}
        />
      )}
    </Box>
  );
};
export default ProfilePage;
