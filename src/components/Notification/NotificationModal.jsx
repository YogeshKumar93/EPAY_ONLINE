import React, { useState, useEffect, useContext } from "react";
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AuthContext from "../../contexts/AuthContext";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";
import { capitalize1 } from "../../utils/TextUtil";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";

const NotificationModal = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // open / close handlers
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    handleMarkAsRead();
    fetchData();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  // ✅ separate function to mark as read
  const handleMarkAsRead = async (id) => {
    try {
      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.MARK_READ_NOTI,
        { is_read: 1 }
      );

      if (response) {
     
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
        );
      } else {
        console.log("Mark as read error:", error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };
  const fetchData = async () => {
    try {
      const { error, response } = await apiCall(
        "GET",
        ApiEndpoints.GET_NOTIFICATION
      );

      if (response) {
        setNotifications(response?.data?.data || []);
      } else {
        console.log("API Response:", error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };
  // fetch all notifications once
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {/* Notification Icon */}
      <IconButton color="inherit" onClick={handleClick}>
        <Badge
          badgeContent={notifications?.filter((n) => n.is_read === 0).length}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: { width: 350, maxHeight: 400, overflow: "auto", p: 1 },
        }}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1 }}>
          Notifications
        </Typography>
        <Divider />

        {notifications?.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No notifications available
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications?.map((row) => (
              <React.Fragment key={row.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: row.is_read ? "background.paper" : "#f0f8ff",
                    borderRadius: 1,
                    mb: 0.5,
                    cursor: "pointer",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        component="span"
                        fontWeight={row.is_read ? "normal" : "bold"}
                      >
                        {row.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          component="span"
                          color="text.primary"
                        >
                          {row.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          component="span"
                          color="text.secondary"
                          display="block"
                        >
                          {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
};

export default NotificationModal;
