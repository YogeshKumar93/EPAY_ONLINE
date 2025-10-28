import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Autocomplete,
  TextField,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Divider,
  Chip,
  Alert,
  Fade,
} from "@mui/material";
import {
  Person,
  SupervisorAccount,
  SwapHoriz,
  CheckCircle,
} from "@mui/icons-material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";

const ChangeParentModal = ({ open, onClose, user, onSuccess }) => {
  const [parentOptions, setParentOptions] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [currentParentName, setCurrentParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const roleMapping = {
    ret: "di",
    di: "md",
    asm: "zsm",
    md: "asm",
    dd: "asm",
  };

  const targetRole = roleMapping[user?.role] || null;

  // Role color mapping for consistent styling
  const roleColors = {
    ret: "#4caf50",
    di: "#2196f3",
    md: "#ff9800",
    asm: "#9c27b0",
    zsm: "#f44336",
    dd: "#607d8b",
  };

  const getRoleColor = (role) => roleColors[role] || "#757575";

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setSelectedParent(null);
      setError("");
      return;
    }

    const fetchParentUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const payload = {};

        if (targetRole) payload.role = targetRole;

        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_USERS,
          payload
        );

        if (error) {
          setError("Failed to load parent users. Please try again.");
          return;
        }

        if (response?.data?.data) {
          const usersList = response.data.data.map((u) => ({
            id: u.id,
            label: u.name,
            role: u.role,
            email: u.email,
            fullLabel: `${u.name} `,
          }));

          setParentOptions(usersList);

          // Set current parent info
          if (user?.parent) {
            const foundParent = usersList.find((u) => u.id === user.parent);
            if (foundParent) {
              setCurrentParentName(foundParent.label);
              setSelectedParent(foundParent);
            } else {
              setCurrentParentName("Not found in current list");
            }
          } else {
            setCurrentParentName("No parent assigned");
          }
        }
      } catch (err) {
        console.error("Error fetching parent users:", err);
        setError("An unexpected error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchParentUsers();
  }, [user?.role, user?.parent, open, targetRole]);

  const handleSubmit = async () => {
    if (!selectedParent) {
      setError("Please select a parent user");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { error: apiError } = await apiCall(
        "post",
        ApiEndpoints.CHANGE_PARENT,
        {
          user_id: user.id,
          parent_id: selectedParent.id,
        }
      );

      if (apiError) {
        setError("Failed to update parent. Please try again.");
        return;
      }

      // Success case
      onSuccess?.();
      onClose();

      // Optional: Show success message or trigger refresh
    } catch (err) {
      console.error("Update error:", err);
      setError("An unexpected error occurred during update.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          overflow: "hidden",
        },
      }}
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 2,
          px: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <SwapHoriz sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Change Parent
            </Typography>
            {/* <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Update reporting hierarchy for {user?.name}
            </Typography> */}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3, px: 3 }}>
        <Stack spacing={3}>
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* User Information Card */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              borderLeft: `4px solid ${getRoleColor(user?.role)}`,
              backgroundColor: "#fafbff",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: `${getRoleColor(user?.role)}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Person sx={{ color: getRoleColor(user?.role) }} />
              </Box>
              <Box flex={1}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  USER
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {user?.name}
                </Typography>
                <Chip
                  label={user?.role?.toUpperCase?.() || "N/A"}
                  size="small"
                  sx={{
                    backgroundColor: `${getRoleColor(user?.role)}20`,
                    color: getRoleColor(user?.role),
                    fontWeight: 600,
                    border: `1px solid ${getRoleColor(user?.role)}30`,
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Current Parent Card */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              backgroundColor: "#f8f9ff",
              border: "1px dashed #e0e0e0",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "#e8f5e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SupervisorAccount sx={{ color: "#4caf50" }} />
              </Box>
              <Box flex={1}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  CURRENT PARENT
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {currentParentName}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Divider sx={{ my: 1 }} />

          {/* New Parent Selection */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              Select New Parent
            </Typography>
            <Autocomplete
              loading={loading}
              options={parentOptions}
              getOptionLabel={(opt) => opt.fullLabel}
              value={selectedParent}
              onChange={(e, val) => {
                setSelectedParent(val);
                setError("");
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {option.label}
                    </Typography>
                    <Box display="flex" gap={1} alignItems="center" mt={0.5}>
                      {/* <Chip
                        label={option.role?.toUpperCase?.()}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "0.7rem",
                          height: 20,
                          backgroundColor: `${getRoleColor(option.role)}15`,
                          color: getRoleColor(option.role),
                          borderColor: getRoleColor(option.role),
                        }}
                      /> */}
                      {/* {option.email && (
                        <Typography variant="caption" color="text.secondary">
                          {option.email}
                        </Typography>
                      )} */}
                    </Box>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search parent user"
                  size="medium"
                  placeholder="Type to search..."
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <SupervisorAccount
                        sx={{ color: "text.secondary", mr: 1, ml: 0.5 }}
                      />
                    ),
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "white",
                    },
                  }}
                />
              )}
              sx={{
                "& .MuiAutocomplete-popupIndicator": {
                  transform: "none",
                },
              }}
            />
          </Box>

          {/* Selection Preview */}
          {selectedParent && (
            <Fade in={true}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f0f7ff",
                  border: "1px solid #2196f3",
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <CheckCircle sx={{ color: "#2196f3", fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      New parent selected:
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      color="primary"
                    >
                      {selectedParent.label} (
                      {selectedParent.role?.toUpperCase()})
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Fade>
          )}
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          disabled={submitting}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={submitting || !selectedParent}
          startIcon={
            submitting ? <CircularProgress size={16} /> : <CheckCircle />
          }
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
            },
            "&:disabled": {
              background: "#e0e0e0",
            },
          }}
        >
          {submitting ? "Updating..." : "Update Parent"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeParentModal;
