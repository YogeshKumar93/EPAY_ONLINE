import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Modal,
  Paper,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CodeIcon from "@mui/icons-material/Code"; // icon for API response
import VisibilityIcon from '@mui/icons-material/Visibility';
const DrawerDetails = ({ open, onClose, title = "Other Details", rowData, fields = [] }) => {
  const [apiModalOpen, setApiModalOpen] = useState(false);

  if (!rowData) return null;

  return (
    <>
      {/* Drawer */}
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, p: 2 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{title}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 1 }} />

          {/* Details Grid */}
          <Grid container spacing={2}>
            {fields.map((field, idx) => (
              <Grid item xs={12} key={idx}>
                <Typography variant="subtitle2" color="text.secondary">
                  {field.label}
                </Typography>

                {/* Special handling for api_response */}
                {field.key === "api_response" ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title="Api Response">
                    <IconButton color="primary" onClick={() => setApiModalOpen(true)}>
                      <VisibilityIcon />
                    </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  <Typography variant="body2">{rowData[field.key] ?? "N/A"}</Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Drawer>

      {/* Modal for API Response */}
      <Modal open={apiModalOpen} onClose={() => setApiModalOpen(false)}>
        <Box
          component={Paper}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxHeight: "80%",
            p: 3,
            overflow: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            API Response
          </Typography>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {JSON.stringify(rowData?.api_response, null, 2)}
          </pre>
        </Box>
      </Modal>
    </>
  );
};

export default DrawerDetails;
