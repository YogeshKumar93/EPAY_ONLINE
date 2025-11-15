import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Collapse,
  useTheme,
  useMediaQuery,
  Grid,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Person,
  Phone,
  Verified,
  AccountBalance,
} from "@mui/icons-material";

const LevinDmtSenderDetails = ({ sender }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);

  const handleToggle = () => setOpen((prev) => !prev);
  console.log("sender", sender);

  const iconStyle = {
    bgcolor: "#e6f3fb",
    color: "#5c3ac8",
    width: 36,
    height: 36,
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        width: "100%",
        bgcolor: "#fff",
      }}
    >
      {/* Mobile Header Toggle */}
      {isMobile && (
        <Box
          sx={{
            bgcolor: "#9d72ff",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1,
            px: 2,
            cursor: "pointer",
          }}
          onClick={handleToggle}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Sender Details
          </Typography>
          <IconButton size="small" sx={{ color: "white" }}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      )}

      {/* Details Section */}
      <Collapse in={open || !isMobile} timeout="auto" unmountOnExit>
        {sender ? (
          <Box sx={{ p: { xs: 2, sm: 3 }, width: "100%" }}>
            <Grid
              container
              spacing={3}
              justifyContent="space-between"
              alignItems="center"
            >
              {/* Name */}
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" width="100%">
                  <Avatar sx={iconStyle}>
                    <Person fontSize="small" />
                  </Avatar>
                  <Box ml={1.5} flexGrow={1}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Name
                    </Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                      {sender?.sender_name}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Number */}
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" width="100%">
                  <Avatar sx={iconStyle}>
                    <Phone fontSize="small" />
                  </Avatar>
                  <Box ml={1.5} flexGrow={1}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Number
                    </Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                      {sender.mobile_number}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Limit per txn */}
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" width="100%">
                  <Avatar sx={iconStyle}>
                    <Verified fontSize="small" />
                  </Avatar>
                  <Box ml={1.5} flexGrow={1}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Limit Per Txn
                    </Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                      ₹{sender.limitPerTransaction}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Limit Available */}
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" width="100%">
                  <Avatar sx={iconStyle}>
                    <AccountBalance fontSize="small" />
                  </Avatar>
                  <Box ml={1.5} flexGrow={1}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Limit Available
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      color="#5c3ac8"
                      sx={{ fontSize: "13px" }}
                    >
                      ₹{sender.rem_limit}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight={120}
          >
            <Typography variant="body2" color="text.secondary">
              Enter Mobile Number or Account Number To View Remitter Details
            </Typography>
          </Box>
        )}
      </Collapse>
    </Card>
  );
};

export default LevinDmtSenderDetails;
