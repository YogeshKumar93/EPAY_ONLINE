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
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const SenderDetails = ({ sender }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // small screens
  const [open, setOpen] = useState(true); // collapsed state

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

  // toggle function
  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Card sx={{ borderRadius: 1, width: "100%" }}>
      {/* Header with toggle button on mobile */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 1, cursor: isMobile ? "pointer" : "default" }}
        onClick={isMobile ? handleToggle : undefined}
      >
        <Typography variant="subtitle1" fontWeight="medium">
          Sender Details
        </Typography>
        {isMobile && (
          <IconButton size="small">
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      {/* Collapsible content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            mb={1}
            gap={isMobile ? 1.5 : 2}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 32,
                height: 32,
                fontSize: 16,
              }}
            >
              {sender.sender_name?.charAt(0) || "S"}
            </Avatar>

            <Box flexGrow={1} minWidth={0}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                noWrap={!isMobile}
              >
                {sender.sender_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {sender.mobile_number}
              </Typography>
            </Box>

            <Box
              textAlign={isMobile ? "left" : "right"}
              mt={isMobile ? 1 : 0}
            >
              <Chip
                label={sender.kyc_status}
                size="small"
                color={getKycColor(sender.kyc_status)}
                sx={{ height: 20, fontSize: "0.7rem", mb: 0.5 }}
              />
              <Typography variant="caption" display="block" fontWeight="medium">
                ₹{sender.rem_limit?.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default SenderDetails;
