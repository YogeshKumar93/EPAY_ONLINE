import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Grid,
  Avatar,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Person,
  Phone,
  Verified,
  AccountBalance,
} from "@mui/icons-material";

const RemitterDetails = ({ sender }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#0078B6",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
          px: 2,
          cursor: isMobile ? "pointer" : "default",
        }}
        onClick={isMobile ? handleToggle : undefined}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Sender Details
        </Typography>
        {isMobile && (
          <IconButton size="small" sx={{ color: "white" }}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      {/* Content with collapse on mobile */}
      <Collapse in={open || !isMobile} timeout="auto" unmountOnExit>
        {sender ? (
          <Box sx={{ p: 2 }}>
            <Grid container>
              {/* Top Row */}
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#e6f3fb",
                    color: "#0078B6",
                    width: 32,
                    height: 32,
                  }}
                >
                  <Person fontSize="small" />
                </Avatar>
                <Box ml={1.5}>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography>
                    {sender.firstName || sender?.fname}{" "}
                    {sender.lastName || sender?.lname}
                  </Typography>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#e6f3fb",
                    color: "#0078B6",
                    width: 32,
                    height: 32,
                  }}
                >
                  <Phone fontSize="small" />
                </Avatar>
                <Box ml={1.5} textAlign="left">
                  <Typography variant="body2" color="text.secondary">
                    Number
                  </Typography>
                  <Typography>
                    {sender.mobileNumber || sender.mobile}
                  </Typography>
                </Box>
              </Grid>

              {/* Bottom Row */}
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", alignItems: "center", mt: 2 }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#e6f3fb",
                    color: "#0078B6",
                    width: 32,
                    height: 32,
                  }}
                >
                  <Verified fontSize="small" />
                </Avatar>
                <Box ml={1.5}>
                  <Typography variant="body2" color="text.secondary">
                    Limit per txn
                  </Typography>
                  <Typography>{sender.limitPerTransaction || 25000}</Typography>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#e6f3fb",
                    color: "#0078B6",
                    width: 32,
                    height: 32,
                  }}
                >
                  <AccountBalance fontSize="small" />
                </Avatar>
                <Box ml={1.5} textAlign="left">
                  <Typography variant="body2" color="text.secondary">
                    Limit Available
                  </Typography>
                  <Typography fontWeight="bold" color="#0078B6">
                    ₹{sender.limitAvailable || sender.limit}
                  </Typography>
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
              Enter Mobile Number to view remitter details
            </Typography>
          </Box>
        )}
      </Collapse>
    </Card>
  );
};

export default RemitterDetails;
