import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Person,
  Phone,
  AccountBalance,
  VerifiedUser,
} from "@mui/icons-material";

const SenderDetails = ({ sender }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);

  const handleToggle = () => setOpen((prev) => !prev);

  const iconWrapperStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    bgcolor: "#eaf4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 1.5,
    flexShrink: 0,
  };

  const iconStyle = { fontSize: 20, color: "#5c3ac8" };

  return (
    <Card
      sx={{
        borderRadius: 2,
        width: "100%",
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e0e4ec",
        overflow: "hidden",
      }}
    >
      {/* Collapsible Header for Mobile */}
      {isMobile && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 1,
            background: "#9d72ff",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={handleToggle}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Sender Details
          </Typography>
          <IconButton size="small" sx={{ color: "white" }}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      )}

      {/* Collapsible Content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {sender ? (
          <CardContent
            sx={{
              p: { xs: 2, sm: 3 },
              "&:last-child": { pb: { xs: 2, sm: 3 } },
              width: "100%",
            }}
          >
            <Grid
              container
              spacing={3}
              justifyContent="space-between"
              sx={{ width: "100%", m: 0 }}
            >
              {/* Name */}
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box sx={iconWrapperStyle}>
                    <Person sx={iconStyle} />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Name
                    </Typography>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {sender?.sender_name || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Number */}
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box sx={iconWrapperStyle}>
                    <Phone sx={iconStyle} />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Number
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {sender?.mobile_number || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* KYC Status */}
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box sx={iconWrapperStyle}>
                    <VerifiedUser sx={iconStyle} />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      KYC Status
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      textTransform="capitalize"
                    >
                      {sender?.kyc_status || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Remaining Limit */}
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box sx={iconWrapperStyle}>
                    <AccountBalance sx={iconStyle} />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Remaining Limit
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="#7a4dff"
                    >
                      ₹{sender?.rem_limit?.toLocaleString() || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight={120}
            p={2}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Enter Mobile Number or Account Number to View Sender Details
            </Typography>
          </Box>
        )}
      </Collapse>
    </Card>
  );
};

export default SenderDetails;
