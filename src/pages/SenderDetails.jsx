import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Box,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
  Stack,
  Grid,
} from "@mui/material";
import { ExpandMore, ExpandLess, Person, Phone, AccountBalance } from "@mui/icons-material";

const SenderDetails = ({ sender }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);

  const getKycColor = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Card 
      sx={{ 
        borderRadius: 2, 
        width: "100%",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: "1px solid #e0e4ec",
        overflow: "hidden"
      }}
    >
      {/* Header with toggle button */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ 
          p: 1.5, 
          cursor: isMobile ? "pointer" : "default",
          background: "#0078B6 ",
          color: "#ffff"
        }}
        onClick={isMobile ? handleToggle : undefined}
      >
        <Box display="flex" alignItems="center">
          <Person sx={{ mr: 1, fontSize: 18 }} />
          <Typography variant="subtitle1" fontWeight="medium">
            Sender Details
          </Typography>
        </Box>
        {isMobile && (
          <IconButton size="small" sx={{ color: "white" }}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      {/* Collapsible content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {sender ? (

        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2 } }}>
          <Grid container spacing={2}>
            {/* Sender Information */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.5}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 40,
                      height: 40,
                      fontSize: 16,
                      fontWeight: "medium",
                      mr: 1.5
                    }}
                  >
                    {sender?.sender_name?.charAt(0) || "S"}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {sender?.sender_name || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      mr: 1.5,
                      color: "primary.main"
                    }}
                  >
                    <Phone sx={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      Number
                    </Typography>
                    <Typography variant="body1">
                      {sender?.mobile_number || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Status and Limit */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.5}>
                <Box display="flex" alignItems="center">
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      mr: 1.5
                    }}
                  >
                  
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      KYC Status
                    </Typography>
                    <Typography variant="body1" textTransform="capitalize">
                      {sender?.kyc_status || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      mr: 1.5,
                      color: "primary.main"
                    }}
                  >
                    <AccountBalance sx={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      Remaining Limit
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" color="primary.main">
                      ₹{sender?.rem_limit?.toLocaleString() || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        ) : (
    // Show clean placeholder if no sender
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight={120}
    >
      <Typography variant="body2" color="text.secondary">
        Enter Mobile Number to view sender details
      </Typography>
    </Box>
        )}
      </Collapse>
    </Card>
  );
};

export default SenderDetails;