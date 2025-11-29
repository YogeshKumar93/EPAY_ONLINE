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
  alpha,
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

  const StatusIndicator = ({ status }) => (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: status ? "success.main" : "error.main",
          animation: status ? "pulse 2s infinite" : "none",
          "@keyframes pulse": {
            "0%": { opacity: 1 },
            "50%": { opacity: 0.5 },
            "100%": { opacity: 1 },
          },
        }}
      />
      <Typography
        variant="body2"
        fontWeight="medium"
        color={status ? "success.main" : "error.main"}
      >
        {status ? "Active" : "Inactive"}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundColor:"#492077",
          color: "white",
          py: 3,
          px: 4,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
          },
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.25)",
                width: 60,
                height: 60,
                border: "3px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Person sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                User Profile
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 300 }}>
                Detailed account information and status
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={onClose}
            sx={{
              color: "white",
              minWidth: "auto",
              p: 1.5,
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: "scale(1.05)",
                transition: "all 0.2s ease",
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
            background: "linear-gradient(90deg, #f8fafc 0%, #ffffff 100%)",
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={2}>
              <StatusIndicator status={user.status} />
              <Chip
                icon={user.role === "admin" ? <CheckCircle /> : <Business />}
                label={user.role?.toUpperCase()}
                color={getRoleColor(user.role)}
                variant="filled"
                size="medium"
                sx={{
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              />
            </Box>
            <Box
              sx={{
                ml: "auto",
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: alpha("#667eea", 0.1),
                px: 2,
                py: 1,
                borderRadius: "8px",
              }}
            >
              <Typography variant="body2" fontWeight="bold" color="primary.main">
                USER ID:
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                #{user.id || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content: Side-by-side cards */}
        <Box sx={{ p: 4 }}>
          <Grid
            container
            spacing={3}
            sx={{
              flexWrap: "nowrap", // ✅ force single row
              overflowX: "auto", // scroll horizontally if needed
            }}
          >
            {/* Personal Information Card */}
            <Grid item xs={12} md={6} sx={{ minWidth: "50%" }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  background: "linear-gradient(145deg, #ffffff 0%, #fafbfe 100%)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Person sx={{ color: "white", fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="text.primary">
                        Personal Information
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Basic account details
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ space: 0.5 }}>
                    <InfoRow icon={<Person sx={{ fontSize: 20 }} />} label="Full Name" value={user.name} />
                    <InfoRow icon={<Phone sx={{ fontSize: 20 }} />} label="Mobile Number" value={user.mobile} />
                    <InfoRow icon={<Email sx={{ fontSize: 20 }} />} label="Email Address" value={user.email} />
                    <InfoRow icon={<Business sx={{ fontSize: 20 }} />} label="User Role" value={user.role} highlight />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Account Timeline Card */}
            <Grid item xs={12} md={6} sx={{ minWidth: "50%" }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  background: "linear-gradient(145deg, #ffffff 0%, #fafbfe 100%)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CalendarToday sx={{ color: "white", fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="text.primary">
                        Account Timeline
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Important dates and status
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ space: 0.5 }}>
                    <InfoRow
                      icon={<CalendarToday sx={{ fontSize: 20, color: "success.main" }} />}
                      label="Start Date"
                      value={user.start_date}
                      highlight
                    />
                    <InfoRow
                      icon={<CalendarToday sx={{ fontSize: 20, color: "warning.main" }} />}
                      label="End Date"
                      value={user.end_date}
                      highlight
                    />

                    {/* Account Status */}
                    <Box
                      sx={{
                        mt: 3,
                        p: 2.5,
                        background: user.status
                          ? "linear-gradient(135deg, #d4edda 0%, #c8e6c9 100%)"
                          : "linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)",
                        borderRadius: 2,
                        border: `1px solid ${user.status ? "success.light" : "error.light"}`,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        {user.status ? (
                          <CheckCircle sx={{ color: "success.main", fontSize: 28 }} />
                        ) : (
                          <Cancel sx={{ color: "error.main", fontSize: 28 }} />
                        )}
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Account Status
                          </Typography>
                          <Typography
                            variant="body2"
                            color={user.status ? "success.dark" : "error.dark"}
                            fontWeight="medium"
                          >
                            {user.status
                              ? "This account is currently active and in good standing."
                              : "This account is currently inactive or suspended."}
                          </Typography>
                        </Box>
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
          p: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(90deg, #f8fafc 0%, #ffffff 100%)",
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            //  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%) ",
            backgroundColor:"#492077",
            borderRadius: "10px",
            px: 4,
            py: 1,
            textTransform: "none",
            color:"#fff",
            fontWeight: "bold",
            fontSize: "0.95rem",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Close Details
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
      justifyContent: "space-between",
      py: 2,
      px: 1,
      borderRadius: "8px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: alpha("#667eea", 0.03),
        transform: "translateX(4px)",
      },
      "&:not(:last-child)": {
        borderBottom: "1px solid",
        borderColor: "grey.100",
      },
    }}
  >
    <Box display="flex" alignItems="center" gap={2.5}>
      <Box
        sx={{
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "8px",
          backgroundColor: alpha("#667eea", 0.1),
        }}
      >
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary" fontWeight="medium" sx={{ minWidth: 120 }}>
        {label}
      </Typography>
    </Box>
    <Typography
      variant="body2"
      fontWeight={highlight ? "bold" : "medium"}
      color={highlight ? "primary.main" : "text.primary"}
      sx={{
        backgroundColor: highlight ? alpha("#667eea", 0.1) : "transparent",
        px: highlight ? 2 : 0,
        py: highlight ? 0.75 : 0,
        borderRadius: highlight ? "6px" : 0,
        textAlign: "right",
        flex: 1,
        maxWidth: "200px",
      }}
    >
      {value || "Not provided"}
    </Typography>
  </Box>
);

export default ViewDocuments;
