// Beneficiaries.js
import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  Stack,
  Button,
  IconButton,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Beneficiaries = ({ beneficiaries, onSelect, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!beneficiaries || beneficiaries.length === 0)
    return <Typography>No beneficiaries found</Typography>;

  // Placeholder for bank logos if available
  const bankImageMapping = {}; // Add mappings if needed

  return (
    <Card sx={{ borderRadius: 2, mt: 2, overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#0078B6",
          color: "#fff",
          py: 1.5,
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Beneficiary List ({beneficiaries.length})
        </Typography>
         <Typography variant="subtitle2" fontWeight="500">
  </Typography>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <List dense sx={{ py: 0 }}>
          {beneficiaries.map((b) => (
            <ListItem
              key={b.id}
              sx={{
                py: 1.5,
                px: 1.5,
                mb: 1,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              }}
              secondaryAction={
                <Stack direction="row" spacing={1} alignItems="center">
           {b.verificationDt ? (
      <Box display="flex" alignItems="center" gap={0.3}>
        <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
        <Typography
          variant="caption"
          color="success.main"
          fontWeight="500"
          sx={{ fontSize: "0.75rem" }}
        >
          Verified
        </Typography>
      </Box>
    ) : (
      <Button
        size="small"
        variant="outlined"
        color="warning"
        onClick={() => onVerify?.(b)}
        sx={{
          borderRadius: 1,
          textTransform: "none",
          fontSize: "0.75rem",
          px: 1,
          py: 0.2,
        }}
      >
        Verify
      </Button>
    )}



                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => onSelect?.(b)}
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      fontSize: "0.75rem",
                      px: 1,
                      py: 0.2,
                    }}
                  >
                    Pay
                  </Button>

                  <IconButton
                    edge="end"
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(b.id);
                    }}
                    sx={{
                      backgroundColor: "error.light",
                      "&:hover": { backgroundColor: "error.main" },
                      color: "white",
                    }}
                  >
                    <Tooltip title="Delete Beneficiary">
                      <DeleteIcon fontSize="small" />
                    </Tooltip>
                  </IconButton>
                </Stack>
              }
            >
              <Box display="flex" alignItems="center" gap={1.5} width="100%">
                {/* Bank logo */}
                {bankImageMapping[b.bank_name] ? (
                  <Box
                    component="img"
                    src={bankImageMapping[b.bank_name]}
                    alt={b.bank_name}
                    sx={{
                      width: 36,
                      height: 36,
                      objectFit: "contain",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      p: 0.5,
                      backgroundColor: "white",
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "primary.light",
                      fontSize: 16,
                    }}
                  >
                    <AccountBalanceIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                )}

                {/* Details */}
                <Box flexGrow={1} minWidth={0}>
                  <Typography
                    variant="body1"
                    fontWeight="500"
                    noWrap
                    sx={{
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    {b.beneficiary_name}
                  </Typography>

                  <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={isMobile ? 0.5 : 2}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      <Box component="span" fontWeight="500" mr={0.5}>
                        NAME:
                      </Box>
                      {b.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      <Box component="span" fontWeight="500" mr={0.5}>
                        IFSC:
                      </Box>
                      {b.ifsc}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      <Box component="span" fontWeight="500" mr={0.5}>
                        A/C:
                      </Box>
                      {b.account}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Beneficiaries;
