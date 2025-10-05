import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  useTheme,
  Card,
} from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { AccountBalanceWallet } from "@mui/icons-material";

const ApiBalance = () => {
  const theme = useTheme();
  const [apiBalance, setApiBalance] = useState({});
  const [totalBalance, setTotalBalance] = useState(0);
  const [loadingApiBalance, setLoadingApiBalance] = useState(false);

  const fetchApiBalance = async () => {
    setLoadingApiBalance(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.API_BALANCE
      );

      if (response?.data) {
        const balances = response.data;

        // Safely calculate total
        const total = Object.values(balances).reduce(
          (acc, val) => acc + parseFloat(val || 0),
          0
        );

        setApiBalance(balances);
        setTotalBalance(total);
      } else {
        console.error("API error:", error);
      }
    } catch (err) {
      console.error("API fetch failed:", err);
    } finally {
      setLoadingApiBalance(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchApiBalance();
  }, []);

  return (
    <Card
      sx={{
        borderRadius: 2,
        // height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header - Updated with same gradient */}
      <Box
        sx={{
          p: 1.5,
          background: "linear-gradient(135deg, #2275B7, #1a67a8)",
          color: "white",
          boxShadow: "0 2px 8px rgba(34, 117, 183, 0.1)",
        }}
      >
        <Typography
          // variant="h6"
          fontWeight={700}
          sx={{
            color: "white",
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AccountBalanceWallet sx={{ fontSize: 20 }} />
          API Balances
        </Typography>
      </Box>

      {/* Table Container - Updated with same height as Profit Summary */}
      {loadingApiBalance ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "white",
            borderRadius: 2,
            border: "1px solid #e1edff",
            boxShadow: "0 2px 8px rgba(34, 117, 183, 0.1)",
            maxHeight: 360, // Match the Profit Summary height
          }}
        >
          <CircularProgress sx={{ color: "#2275B7" }} />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            flex: 1,
            maxHeight: 360, // Changed from 440 to 360 to match Profit Summary
            border: "1px solid #e1edff",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(34, 117, 183, 0.1)",
            bgcolor: "white",
            position: "relative",
            transition: "all 0.3s ease", // Added smooth transition
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    bgcolor: "#f8fafc",
                    py: 1.2,
                    borderRight: "1px solid #e2e8f0",
                    color: "#1e293b",
                  }}
                >
                  API Name
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    bgcolor: "#f8fafc",
                    py: 1.2,
                    color: "#1e293b",
                  }}
                >
                  Balance
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Object.entries(apiBalance).map(([key, value], index) => (
                <TableRow
                  key={key}
                  sx={{
                    "&:hover": {
                      bgcolor: "#f8fbff",
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 4px rgba(34, 117, 183, 0.1)",
                    },
                    bgcolor: index % 2 === 0 ? "#ffffff" : "#fafcff",
                    transition: "all 0.2s ease",
                  }}
                >
                  <TableCell
                    sx={{
                      py: 1.2,
                      fontWeight: 600,
                      color: "#1e293b",
                      fontSize: "0.75rem",
                      borderRight: "1px solid #f1f5f9",
                    }}
                  >
                    {key.toUpperCase()}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      py: 1.2,
                      fontWeight: 600,
                      color: "#059669",
                      fontSize: "0.75rem",
                    }}
                  >
                    ₹{parseFloat(value).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}

              {/* Total Row - Updated with same styling */}
              <TableRow
                sx={{
                  bgcolor: "#e8f2ff",
                  "&:hover": {
                    bgcolor: "#e1edff",
                  },
                  borderTop: "2px solid #e2e8f0",
                }}
              >
                <TableCell
                  sx={{
                    py: 1.2,
                    fontWeight: 800,
                    color: "#1B6AAB",
                    fontSize: "0.8rem",
                    borderRight: "1px solid #e2e8f0",
                  }}
                >
                  TOTAL
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    py: 1.2,
                    fontWeight: 800,
                    color: "#1B6AAB",
                    fontSize: "0.8rem",
                  }}
                >
                  ₹{totalBalance.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );
};

export default ApiBalance;
