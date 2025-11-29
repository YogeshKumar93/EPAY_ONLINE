import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
  Avatar,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Person,
  Phone,
  Email,
  Business,
  CalendarToday,
  Close,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const ViewDocuments = ({ open, onClose, user }) => {
  if (!user) return null;

  const getStatusColor = (status) => (status ? "success" : "error");
  const getRoleColor = (role) => {
    const roleColors = {
      admin: "error",
      user: "primary",
      manager: "warning",
      editor: "info",
      supervisor: "secondary",
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
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: "#492077",
          color: "white",
          py: 3,
          px: 4,
          position: "relative",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <Person sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                User All Information
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Complete account information and details
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
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Status Bar */}
        <Box
          sx={{
            backgroundColor: "#f8f9fa",
            py: 2,
            px: 4,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Chip
              icon={user.status ? <CheckCircle /> : <Cancel />}
              label={user.status ? "ACTIVE" : "INACTIVE"}
              color={getStatusColor(user.status)}
              variant="filled"
              size="small"
            />
            <Chip
              label={user.role?.toUpperCase()}
              color={getRoleColor(user.role)}
              variant="outlined"
              size="small"
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: "auto" }}
            >
              USER ID: <strong>#{user.id || "N/A"}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                  >
                    <Person color="primary" />
                    Personal Information
                  </Typography>

                  <Box sx={{ space: 2 }}>
                    <InfoRow
                      icon={<Phone fontSize="small" />}
                      label="Mobile Number"
                      value={user.mobile}
                    />
                    <Divider />
                    <InfoRow
                      icon={<Email fontSize="small" />}
                      label="Email Address"
                      value={user.email}
                    />
                    <Divider />
                    <InfoRow
                      icon={<Business fontSize="small" />}
                      label="User Role"
                      value={user.role}
                      highlight
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Account Timeline */}
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                  >
                    <CalendarToday color="primary" />
                    Account Timeline
                  </Typography>

                  <Box sx={{ space: 2 }}>
                    <InfoRow
                      icon={<CalendarToday fontSize="small" color="success" />}
                      label="Start Date"
                      value={user.start_date}
                      highlight
                    />
                    <Divider />
                    <InfoRow
                      icon={<CalendarToday fontSize="small" color="warning" />}
                      label="End Date"
                      value={user.end_date}
                      highlight
                    />
                  </Box>

                  {/* Status Overview */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 2.5,
                      backgroundColor: user.status ? "success.50" : "error.50",
                      border: "1px solid",
                      borderColor: user.status ? "success.200" : "error.200",
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      {user.status ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Cancel color="error" />
                      )}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                          Account Status
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.status
                            ? "This account is currently active and in good standing."
                            : "This account is currently inactive or suspended."}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          py: 2,
          px: 4,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
           sx={{
            color:"#fff",
            backgroundColor: "#7e728cff",
            "&:hover": {
              backgroundColor: "#3a1a5f",
            },
          }}
        >
          Cancel
        </Button>
        
      </DialogActions>
    </Dialog>
  );
};

// InfoRow Component
const InfoRow = ({ icon, label, value, highlight = false }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      py: 1,
    }}
  >
    <Box
      sx={{
        color: "text.secondary",
        mr: 2,
        display: "flex",
        alignItems: "center",
        minWidth: 24,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={highlight ? "600" : "500"}
        color={highlight ? "primary.main" : "text.primary"}
        sx={{
          backgroundColor: highlight ? "primary.50" : "transparent",
          px: highlight ? 1 : 0,
          py: highlight ? 0.5 : 0,
          borderRadius: highlight ? 1 : 0,
          display: "inline-block",
        }}
      >
        {value || "Not provided"}
      </Typography>
    </Box>
  </Box>
);

export default ViewDocuments;