import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  Fade,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Security,
  LockReset,
  PhoneIphone,
  Person,
  Email,
  CheckCircle
} from '@mui/icons-material';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showMpin, setShowMpin] = useState(false);
  const [showNewMpin, setShowNewMpin] = useState(false);
  const [showConfirmMpin, setShowConfirmMpin] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states
  const [resetMpinData, setResetMpinData] = useState({ mobile: '', otp: '' });
  const [changePasswordData, setChangePasswordData] = useState({ 
    currentPassword: '', newPassword: '', confirmPassword: '' 
  });
  const [changeMpinData, setChangeMpinData] = useState({ 
    currentMpin: '', newMpin: '', confirmMpin: '' 
  });
  const [changeNumberData, setChangeNumberData] = useState({ 
    currentNumber: '', newNumber: '', otp: '' 
  });
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSuccessMessage('');
  };

  const handleResetMpin = () => {
    console.log("Reset MPIN with:", resetMpinData);
    // API call to reset MPIN would go here
    setSuccessMessage('MPIN reset successfully!');
  };

  const handleChangePassword = () => {
    console.log("Change password with:", changePasswordData);
    // API call to change password would go here
    setSuccessMessage('Password changed successfully!');
  };

  const handleChangeMpin = () => {
    console.log("Change MPIN with:", changeMpinData);
    // API call to change MPIN would go here
    setSuccessMessage('MPIN changed successfully!');
  };

  const handleInitiateNumberChange = () => {
    console.log("Initiate number change with:", changeNumberData);
    // API call to initiate number change would go here
    setSuccessMessage('OTP sent to your new number!');
  };

  const handleVerifyNumberChange = () => {
    console.log("Verify number change with:", changeNumberData);
    // API call to verify number change would go here
    setSuccessMessage('Mobile number updated successfully!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Slide in={true} direction="up" timeout={500}>
        <Paper 
          elevation={isMobile ? 0 : 8} 
          sx={{ 
            borderRadius: 2, 
            overflow: 'hidden',
            background: 'linear-gradient(to bottom, #f5f7fa, #e4e8f0)'
          }}
        >
          {/* Header Section */}
          <Box sx={{ 
            p: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white' 
          }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    border: '4px solid rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }}
                >
                  <Person sx={{ fontSize: 50 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" fontWeight="600">
                  John Doe
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                  john.doe@example.com
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                  +1 (555) 123-4567
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Tabs Section */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
            >
              <Tab icon={<LockReset />} label="Reset MPIN" />
              <Tab icon={<Security />} label="Change Password" />
              <Tab icon={<Security />} label="Change MPIN" />
              <Tab icon={<PhoneIphone />} label="Change Number" />
            </Tabs>
          </Box>

          {/* Success Message */}
          {successMessage && (
            <Fade in={true}>
              <Box sx={{ 
                p: 2, 
                m: 2, 
                backgroundColor: 'success.light', 
                color: 'white', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <CheckCircle sx={{ mr: 1 }} />
                <Typography>{successMessage}</Typography>
              </Box>
            </Fade>
          )}

          {/* Reset MPIN Tab */}
          <TabPanel value={tabValue} index={0}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Reset MPIN
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Enter your registered mobile number to receive OTP for resetting your MPIN
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      value={resetMpinData.mobile}
                      onChange={(e) => setResetMpinData({ ...resetMpinData, mobile: e.target.value })}
                      placeholder="Enter your mobile number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="OTP"
                      value={resetMpinData.otp}
                      onChange={(e) => setResetMpinData({ ...resetMpinData, otp: e.target.value })}
                      placeholder="Enter OTP received on your mobile"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={handleResetMpin}
                      sx={{ py: 1.5 }}
                    >
                      Reset MPIN
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Change Password Tab */}
          <TabPanel value={tabValue} index={1}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Change Password
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Update your password to keep your account secure
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={changePasswordData.currentPassword}
                      onChange={(e) => setChangePasswordData({ 
                        ...changePasswordData, 
                        currentPassword: e.target.value 
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              edge="end"
                            >
                              {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={changePasswordData.newPassword}
                      onChange={(e) => setChangePasswordData({ 
                        ...changePasswordData, 
                        newPassword: e.target.value 
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              edge="end"
                            >
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={changePasswordData.confirmPassword}
                      onChange={(e) => setChangePasswordData({ 
                        ...changePasswordData, 
                        confirmPassword: e.target.value 
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={handleChangePassword}
                      sx={{ py: 1.5 }}
                    >
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Change MPIN Tab */}
          <TabPanel value={tabValue} index={2}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Change MPIN
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Update your MPIN for secure transactions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current MPIN"
                      type={showMpin ? 'text' : 'password'}
                      value={changeMpinData.currentMpin}
                      onChange={(e) => setChangeMpinData({ 
                        ...changeMpinData, 
                        currentMpin: e.target.value 
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowMpin(!showMpin)}
                              edge="end"
                            >
                              {showMpin ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New MPIN"
                      type={showNewMpin ? 'text' : 'password'}
                      value={changeMpinData.newMpin}
                      onChange={(e) => setChangeMpinData({ 
                        ...changeMpinData, 
                        newMpin: e.target.value 
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowNewMpin(!showNewMpin)}
                              edge="end"
                            >
                              {showNewMpin ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New MPIN"
                      type={showConfirmMpin ? 'text' : 'password'}
                      value={changeMpinData.confirmMpin}
                      onChange={(e) => setChangeMpinData({ 
                        ...changeMpinData, 
                        confirmMpin: e.target.value 
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmMpin(!showConfirmMpin)}
                              edge="end"
                            >
                              {showConfirmMpin ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={handleChangeMpin}
                      sx={{ py: 1.5 }}
                    >
                      Change MPIN
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Change Number Tab */}
          <TabPanel value={tabValue} index={3}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Change Mobile Number
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Update your mobile number for account verification
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Mobile Number"
                      value={changeNumberData.currentNumber}
                      onChange={(e) => setChangeNumberData({ 
                        ...changeNumberData, 
                        currentNumber: e.target.value 
                      })}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Mobile Number"
                      value={changeNumberData.newNumber}
                      onChange={(e) => setChangeNumberData({ 
                        ...changeNumberData, 
                        newNumber: e.target.value 
                      })}
                      placeholder="Enter your new mobile number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      onClick={handleInitiateNumberChange}
                      sx={{ py: 1.5 }}
                    >
                      Send OTP to New Number
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="OTP"
                      value={changeNumberData.otp}
                      onChange={(e) => setChangeNumberData({ 
                        ...changeNumberData, 
                        otp: e.target.value 
                      })}
                      placeholder="Enter OTP received on your new number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={handleVerifyNumberChange}
                      sx={{ py: 1.5 }}
                    >
                      Verify and Update Number
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>
        </Paper>
      </Slide>
    </Container>
  );
};

export default ProfilePage;