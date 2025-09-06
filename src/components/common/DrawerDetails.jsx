// components/common/DrawerDetails.js
import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DrawerDetails = ({
  open,
  onClose,
  title = "Other Details", // ✅ Common default title
  rowData,
  fields = [],
}) => {
  if (!rowData) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400, md: 500 },
          pt: "64px", // ✅ below AppBar
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0, // ✅ stays below AppBar
          backgroundColor: "background.paper",
          zIndex: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold" noWrap>
          {title} {/* ✅ Common title */}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Fields */}
      <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid item xs={12} key={index}>
              <Typography variant="subtitle2" color="text.secondary">
                {field.label}
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                {typeof field.render === "function"
                  ? field.render(rowData[field.key], rowData)
                  : rowData[field.key] || "-"}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Drawer>
  );
};

export default DrawerDetails;
