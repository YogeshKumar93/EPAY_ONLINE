import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import {
  Person,
  Phone,
  Email,
  Business,
  CalendarToday,
  LocationOn,
  Badge,
  Close,
} from "@mui/icons-material";

const ViewDocuments = ({ open, onClose, user }) => {
  if (!user) return null;

  const getStatusColor = (status) => {
    return status ? "success" : "error";
  };

  const getRoleColor = (role) => {
    const roleColors = {
      admin: "error",
      user: "primary",
      manager: "warning",
      editor: "info",
    };
    return roleColors[role?.toLowerCase()] || "default";
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }
      }}
    >
      {/* Header with Gradient Background */}
      <DialogTitle 
        sx={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 2,
          position: "relative",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: 50,
                height: 50,
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <Person sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                User Details
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Complete profile information
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={onClose}
            sx={{
              color: "white",
              minWidth: "auto",
              p: 1,
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {/* Status Bar */}
        <Box
          sx={{
            backgroundColor: "grey.50",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Chip
              label={user.status ? "Active" : "Inactive"}
              color={getStatusColor(user.status)}
              variant="filled"
              size="small"
            />
            <Chip
              label={user.role}
              color={getRoleColor(user.role)}
              variant="outlined"
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
              User ID: #{user.id || "N/A"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Personal Information Card */}
            <Grid item xs={12} md={6}>
              <Card 
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: "grey.200",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Badge color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Personal Information
                    </Typography>
                  </Box>
                  
                  <Box sx={{ space: 2 }}>
                    <InfoRow icon={<Person />} label="Full Name" value={user.name} />
                    <InfoRow icon={<Phone />} label="Mobile" value={user.mobile} />
                    <InfoRow icon={<Email />} label="Email" value={user.email} />
                    <InfoRow icon={<Business />} label="Role" value={user.role} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Dates & Timeline Card */}
            <Grid item xs={12} md={6}>
              <Card 
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: "grey.200",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <CalendarToday color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Timeline
                    </Typography>
                  </Box>
                  
                  <Box sx={{ space: 2 }}>
                    <InfoRow 
                      icon={<CalendarToday />} 
                      label="Start Date" 
                      value={user.start_date} 
                      highlight
                    />
                    <InfoRow 
                      icon={<CalendarToday />} 
                      label="End Date" 
                      value={user.end_date} 
                      highlight
                    />
                    
                    {/* Status Timeline */}
                    <Box sx={{ mt: 3, p: 2, backgroundColor: "grey.50", borderRadius: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Current Status
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: user.status ? "success.main" : "error.main",
                          }}
                        />
                        <Typography variant="body2">
                          {user.status ? "Active User" : "Inactive User"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Additional Information Cards can be added here */}
            {/* Uncomment and style these sections as needed */}

            {/* 
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'grey.200' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LocationOn color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Business Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <InfoRow label="Business Name" value={user.business_name} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoRow label="GST Number" value={user.gst || "N/A"} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoRow label="PAN Number" value={user.pan || "N/A"} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            */}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
       
      </DialogActions>
    </Dialog>
  );
};

// Reusable component for information rows
const InfoRow = ({ icon, label, value, highlight = false }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      py: 1.5,
      borderBottom: "1px solid",
      borderColor: "grey.100",
      "&:last-child": {
        borderBottom: "none",
      },
    }}
  >
    <Box display="flex" alignItems="center" gap={1.5}>
      <Box sx={{ color: "primary.main", display: "flex" }}>
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
    <Typography
      variant="body2"
      fontWeight={highlight ? "bold" : "normal"}
      color={highlight ? "primary.main" : "text.primary"}
      sx={{
        backgroundColor: highlight ? "primary.50" : "transparent",
        px: highlight ? 1.5 : 0,
        py: highlight ? 0.5 : 0,
        borderRadius: highlight ? 1 : 0,
      }}
    >
      {value || "N/A"}
    </Typography>
  </Box>
);

export default ViewDocuments;