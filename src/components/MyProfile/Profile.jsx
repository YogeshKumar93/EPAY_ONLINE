import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Avatar,
  Button,
  Fade,
  useMediaQuery,
  useTheme,
  IconButton,
  Chip,
  Card,
  CardContent,
  alpha,
  Container,
  Tabs,
  Tab,
  Stack,
  Divider,
  Badge,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Fingerprint,
  Badge as BadgeIcon,
  QrCode2,
  Shield,
  Key,
  SmartphoneOutlined,
  PasswordOutlined,
  LockPersonOutlined,
  SecurityOutlined,
  Menu,
  Close,
  CameraAlt,
  Notifications,
  Language,
  DarkMode,
  Help,
  Logout,
  Business,
  ReceiptLong,
  History,
  Payment,
  SecurityUpdateGood,
} from "@mui/icons-material";
import AuthContext from "../../contexts/AuthContext";
import ResetMpin from "../common/ResetMpin";
import ChangePassword from "../common/ChangePassword";
import ChangeMpin from "../common/ChangeMpin";
import NumberVerificationComponent from "../common/NumberVerificationComponent";
import { BusinessInformation } from "./BusinessInformation";
import ProfileTabs from "./ProfileTabs";
import TwoFA from "./TwoFA";
import ProfileImageUploadModal from "./ProfileImageUploadModal";

const ProfilePage = () => {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const username = `TRANS${user?.id}`;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [resetMpinModalOpen, setResetMpinModalOpen] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [changeMpinModal, setChangeMpinModal] = useState(false);
  const [twoFAModalOpen, setTwoFAModalOpen] = useState(false);
  const [newNumberModal, setNewNumberModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [businessModal, setBusinessModal] = useState(false);
  const [viewInfoModalOpen, setViewInfoModalOpen] = useState(false);
  const [profileImageModalOpen, setProfileImageModalOpen] = useState(false);
  const [activeView, setActiveView] = useState("profile");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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

  const handleResetMpin = () => setResetMpinModalOpen(true);
  const handleChangePassword = () => setChangePasswordModal(true);
  const handleTwoFAModalOpen = () => setTwoFAModalOpen(true);
  const handleChangeMpin = () => setChangeMpinModal(true);
  const handleNewNumber = () => setNewNumberModal(true);
  const handleBusinessInfo = () => setBusinessModal(true);

  const handleEditToggle = () => {
    if (isEditing) {
      setSuccessMessage("Profile updated successfully!");
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const userRole = authCtx.user.role;

  const quickActions = [
    {
      id: 1,
      label: "Reset MPIN",
      icon: <LockReset />,
      onClick: handleResetMpin,
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: 2,
      label: "Change Password",
      icon: <PasswordOutlined />,
      onClick: handleChangePassword,
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: 3,
      label: "Change Number",
      icon: <SmartphoneOutlined />,
      onClick: handleNewNumber,
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      roles: ["adm", "sadm"],
    },
    {
      id: 4,
      label: "2FA Security",
      icon: <SecurityUpdateGood />,
      onClick: handleTwoFAModalOpen,
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ].filter((btn) => !btn.roles || btn.roles.includes(userRole));

  const menuItems = [
    { id: "profile", label: "Profile Overview", icon: <Person /> },
    // { id: "security", label: "Security Center", icon: <Shield /> },
    // { id: "preferences", label: "Preferences", icon: <Settings /> },
    // { id: "business", label: "Business Info", icon: <Business /> },
    { id: "activity", label: "Activity Log", icon: <History /> },
  ];

  const SecurityCard = ({ title, description, status, action, icon, color }) => (
    <Card sx={{ 
      p: 3, 
      borderRadius: 3,
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      border: `1px solid ${color}30`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${color}40`,
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 2, 
          background: color,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Chip 
              label={status} 
              size="small" 
              color={status === 'Active' ? 'success' : 'default'}
              variant="outlined"
            />
            <Button 
              variant="outlined" 
              size="small" 
              onClick={action}
              sx={{ borderRadius: 2 }}
            >
              Manage
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 2
    }}>
      <Container maxWidth="xl">
        {/* Success Message */}
        {successMessage && (
          <Fade in={true}>
            <Box
              sx={{
                p: 2,
                mb: 3,
                background: "linear-gradient(90deg, #4caf50, #66bb6a)",
                color: "white",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 2,
                animation: "pulse 2s infinite",
              }}
            >
              <CheckCircle sx={{ mr: 1 }} />
              <Typography fontWeight="500">
                {successMessage}
              </Typography>
            </Box>
          </Fade>
        )}

        <Grid container spacing={3}>
          {/* Sidebar Navigation */}
          <Grid item xs={12} lg={3}>
            <Card sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative Elements */}
              <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)'
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)'
              }} />

              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                {/* Profile Header */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton
                        sx={{
                          background: 'linear-gradient(135deg, #ff8e53 0%, #fe6b8b 100%)',
                          color: 'white',
                          width: 32,
                          height: 32,
                          '&:hover': { background: '#fe6b8b' }
                        }}
                        onClick={() => setProfileImageModalOpen(true)}
                      >
                        <CameraAlt sx={{ fontSize: 16 }} />
                      </IconButton>
                    }
                  >
                    <Avatar
                      src={user?.profile_image || ""}
                      sx={{
                        width: 100,
                        height: 100,
                        border: '3px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.2)'
                      }}
                    >
                      {!user?.profile_image && <Person sx={{ fontSize: 48 }} />}
                    </Avatar>
                  </Badge>
                  
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, textAlign: 'center' }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, textAlign: 'center' }}>
                    {user?.email}
                  </Typography>
                  <Chip 
                    icon={<AccountCircle />} 
                    label="Verified Account" 
                    size="small" 
                    sx={{ 
                      mt: 1, 
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  />
                </Box>

                {/* Navigation Menu */}
                <List sx={{ mt: 2 }}>
                  {menuItems.map((item) => (
                    <ListItem
                      key={item.id}
                      button
                      selected={activeView === item.id}
                      onClick={() => setActiveView(item.id)}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        background: activeView === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: activeView === item.id ? 600 : 400
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* Quick Stats */}
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: 2 
                }}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    ACCOUNT STATUS
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">Security Level</Typography>
                    <Typography variant="body2" fontWeight="bold">High</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">Member Since</Typography>
                    <Typography variant="body2" fontWeight="bold">2024</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} lg={9}>
            {/* Profile Overview */}
            {activeView === 'profile' && (
              <Box>
                <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        Profile Overview
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEditToggle}
                        sx={{ borderRadius: 2 }}
                      >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                      </Button>
                    </Box>

                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              FULL NAME
                            </Typography>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedUser.name || ""}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "12px 16px",
                                  border: "2px solid #e0e0e0",
                                  borderRadius: "12px",
                                  fontSize: "16px",
                                  outline: "none",
                                  transition: "all 0.3s ease",
                                  background: "#f8f9fa"
                                }}
                              />
                            ) : (
                              <Typography variant="h6" fontWeight="500">
                                {user?.name}
                              </Typography>
                            )}
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              EMAIL ADDRESS
                            </Typography>
                            {isEditing ? (
                              <input
                                type="email"
                                value={editedUser.email || ""}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "12px 16px",
                                  border: "2px solid #e0e0e0",
                                  borderRadius: "12px",
                                  fontSize: "16px",
                                  outline: "none",
                                  background: "#f8f9fa"
                                }}
                              />
                            ) : (
                              <Typography variant="h6" fontWeight="500">
                                {user?.email}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              MOBILE NUMBER
                            </Typography>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={editedUser.mobile || ""}
                                onChange={(e) => handleInputChange("mobile", e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "12px 16px",
                                  border: "2px solid #e0e0e0",
                                  borderRadius: "12px",
                                  fontSize: "16px",
                                  outline: "none",
                                  background: "#f8f9fa"
                                }}
                              />
                            ) : (
                              <Typography variant="h6" fontWeight="500">
                                {user?.mobile}
                              </Typography>
                            )}
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              USERNAME
                            </Typography>
                            <Typography variant="h6" fontWeight="500" sx={{ 
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              color: 'transparent',
                              display: 'inline-block'
                            }}>
                              {username}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: 'text.primary' }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {quickActions.map((action) => (
                    <Grid item xs={12} sm={6} md={3} key={action.id}>
                      <Card 
                        sx={{ 
                          p: 3,
                          textAlign: 'center',
                          borderRadius: 3,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: action.color,
                          color: 'white',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
                          }
                        }}
                        onClick={action.onClick}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          margin: '0 auto 16px'
                        }}>
                          {action.icon}
                        </Box>
                        <Typography variant="body1" fontWeight="600">
                          {action.label}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Security Center */}
            {activeView === 'security' && (
              <Box>
                <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                      Security Center
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      Manage your account security settings and preferences
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <SecurityCard
                          title="Password Protection"
                          description="Last changed 30 days ago"
                          status="Active"
                          action={handleChangePassword}
                          icon={<PasswordOutlined />}
                          color="#667eea"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SecurityCard
                          title="MPIN Security"
                          description="Transaction authentication"
                          status="Active"
                          action={handleChangeMpin}
                          icon={<LockPersonOutlined />}
                          color="#f093fb"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SecurityCard
                          title="Two-Factor Auth"
                          description="Extra layer of security"
                          status="Inactive"
                          action={handleTwoFAModalOpen}
                          icon={<SecurityUpdateGood />}
                          color="#4facfe"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SecurityCard
                          title="Device Management"
                          description="2 devices connected"
                          status="Active"
                          action={() => {}}
                          icon={<SmartphoneOutlined />}
                          color="#43e97b"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Other views would go here */}
            {activeView === 'business' && user?.status === 1 && <ProfileTabs />}
          </Grid>
        </Grid>
      </Container>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
          onClick={() => setDrawerOpen(true)}
        >
          <Menu />
        </Fab>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
          {/* Mobile menu items would go here */}
        </Box>
      </Drawer>

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
      {twoFAModalOpen && (
        <TwoFA open={twoFAModalOpen} onClose={() => setTwoFAModalOpen(false)} />
      )}
      {profileImageModalOpen && (
        <ProfileImageUploadModal
          open={profileImageModalOpen}
          onClose={() => setProfileImageModalOpen(false)}
          onUploadSuccess={(newImageUrl) => {
            authCtx.setUser({ ...user, profile_image: newImageUrl });
            setProfileImageModalOpen(false);
            setSuccessMessage("Profile image updated successfully!");
          }}
        />
      )}
    </Box>
  );
};

export default ProfilePage;