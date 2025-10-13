import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const MobileNumberList = ({ open, onClose, numbers = [], onSelect }) => {
  // Dynamically set max height depending on count
  const maxHeight = numbers.length > 5 ? 300 : numbers.length * 55 + 80;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 6,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          bgcolor: "primary.main",
          color: "white",
          py: 1.5,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Select Mobile Number
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          maxHeight: maxHeight,
          overflowY: numbers.length > 5 ? "auto" : "visible",
        }}
      >
        {numbers.length > 0 ? (
          <List disablePadding>
            {numbers.map((num, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  onClick={() => {
                    onSelect(num);
                    onClose();
                  }}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      bgcolor: "primary.light",
                      color: "white",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <ListItemText
                    primary={num}
                    primaryTypographyProps={{
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
                {index < numbers.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box textAlign="center" py={3}>
            <Typography color="text.secondary">
              No mobile numbers found.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileNumberList;
