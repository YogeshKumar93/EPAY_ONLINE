import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  alpha,
  Card,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Remove,
  Refresh,
  Info,
  InfoOutlined,
} from "@mui/icons-material";

import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
const ServiceWiseSummary = () => {
  const theme = useTheme();
  const [loadingDashboard2, setLoadingDashboard2] = useState(true);
  const [dashboardData2, setDashboardData2] = useState(null);

  const fetchDashboard2 = async () => {
    setLoadingDashboard2(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_DASHBOARD2
      );

      if (response) {
        setDashboardData2(response);
      } else {
        console.error("Dashboard2 API error:", error);
      }
    } catch (err) {
      console.error("Dashboard2 fetch failed:", err);
    } finally {
      setLoadingDashboard2(false);
    }
  };

  useEffect(() => {
    fetchDashboard2();
  }, []);

  // Fixed currency formatting
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === 0) return "₹0";
    const num = parseFloat(amount);
    if (isNaN(num)) return "₹0";

    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  // Fixed count formatting
  const formatCount = (count) => {
    if (count === null || count === undefined) return "0";
    const num = parseInt(count);
    if (isNaN(num)) return "0";

    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString("en-IN");
  };

  // Service configuration with better colors
  const serviceConfig = {
    dmt: {
      name: "DMT",
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb, #3b82f6)",
    },
    recharge: {
      name: "Recharge",
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669, #10b981)",
    },
    payout: {
      name: "Payout",
      color: "#ea580c",
      gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    },
    aeps: {
      name: "AEPS",
      color: "#7c3aed",
      gradient: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    },
    bbps: {
      name: "BBPS",
      color: "#0891b2",
      gradient: "linear-gradient(135deg, #0891b2, #06b6d4)",
    },
    matm: {
      name: "MATM",
      color: "#dc2626",
      gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
    },
    "Credit Card": {
      name: "Credit Card",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    },
  };

  // Process data with proper calculations
  const processServiceData = () => {
    if (!dashboardData2?.data) return [];

    return Object.entries(dashboardData2.data).map(([service, stats]) => {
      const config = serviceConfig[service] || {
        name: service,
        color: "#6b7280",
      };

      // Parse values safely
      const mtdAmount = parseFloat(stats.mtd_amount) || 0;
      const lmtdAmount = parseFloat(stats.lmtd_amount) || 0;
      const tdAmount = parseFloat(stats.td_amount) || 0;

      const mtdCount = parseInt(stats.mtd_count) || 0;
      const lmtdCount = parseInt(stats.lmtd_count) || 0;
      const tdCount = parseInt(stats.td_count) || 0;
      const totalTxns = parseInt(stats.total_txns) || 0;

      // Calculate percentage change - FIXED LOGIC
      let percentChange = 0;
      if (lmtdAmount > 0) {
        percentChange = ((mtdAmount - lmtdAmount) / lmtdAmount) * 100;
      } else if (mtdAmount > 0 && lmtdAmount === 0) {
        percentChange = 100; // Growth from zero
      } else if (mtdAmount === 0 && lmtdAmount > 0) {
        percentChange = -100; // Drop to zero
      }

      return {
        service,
        config,
        totalTxns,
        tdAmount,
        tdCount,
        mtdAmount,
        mtdCount,
        lmtdAmount,
        lmtdCount,
        percentChange: Math.round(percentChange * 100) / 100, // Round to 2 decimal places
      };
    });
  };

  const serviceData = processServiceData();

  if (loadingDashboard2) {
    return (
      <Card sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
        <CircularProgress size={32} sx={{ color: "#2563eb" }} />
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Loading service summary...
        </Typography>
      </Card>
    );
  }

  if (!dashboardData2?.data || serviceData.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: "center", boxShadow: 2 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No transaction data available
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          There are no transactions to display at the moment.
        </Typography>
        <IconButton
          onClick={fetchDashboard2}
          sx={{
            bgcolor: "#2563eb",
            color: "white",
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          <Refresh />
        </IconButton>
      </Card>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        flex: 1,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: "#1B6AAB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <TrendingUp sx={{ fontSize: 24 }} />
          <Box>
            <Typography variant="h6" fontWeight="600">
              Service Performance
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh data">
          <IconButton
            size="small"
            onClick={fetchDashboard2}
            sx={{
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Table */}
      <TableContainer sx={{ width: "100%" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                SERVICE
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                TODAY
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                MTD
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                LMTD
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                TOTAL TXNS
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                GROWTH
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {serviceData.map((item, index) => (
              <TableRow
                key={item.service}
                hover
                sx={{
                  "&:hover": { bgcolor: "#f8fbff" },
                  bgcolor: index % 2 === 0 ? "#ffffff" : "#fafcff",
                  transition: "background-color 0.2s",
                }}
              >
                {/* Service Name */}
                <TableCell
                  sx={{
                    py: 1.5,
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: item.config.gradient || item.config.color,
                        boxShadow: `0 2px 4px ${item.config.color}40`,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ fontSize: "0.8rem" }}
                      >
                        {item.config.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                      >
                        {formatCount(item.totalTxns)} total
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Today */}
                <TableCell
                  align="center"
                  sx={{ py: 1.5, borderBottom: "1px solid #f1f5f9" }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      {formatCurrency(item.tdAmount)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                    >
                      {formatCount(item.tdCount)} txns
                    </Typography>
                  </Box>
                </TableCell>

                {/* MTD */}
                <TableCell
                  align="center"
                  sx={{ py: 1.5, borderBottom: "1px solid #f1f5f9" }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      {formatCurrency(item.mtdAmount)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                    >
                      {formatCount(item.mtdCount)} txns
                    </Typography>
                  </Box>
                </TableCell>

                {/* LMTD */}
                <TableCell
                  align="center"
                  sx={{ py: 1.5, borderBottom: "1px solid #f1f5f9" }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      {formatCurrency(item.lmtdAmount)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                    >
                      {formatCount(item.lmtdCount)} txns
                    </Typography>
                  </Box>
                </TableCell>

                {/* Total Transactions */}
                <TableCell
                  align="center"
                  sx={{ py: 1.5, borderBottom: "1px solid #f1f5f9" }}
                >
                  <Box
                    sx={{
                      bgcolor: "#f1f5f9",
                      borderRadius: "12px",
                      px: 1,
                      py: 0.5,
                      display: "inline-block",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="700"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      {formatCount(item.totalTxns)}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Growth Percentage */}
                <TableCell
                  align="center"
                  sx={{ py: 1.5, borderBottom: "1px solid #f1f5f9" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    {item.percentChange !== 0 &&
                      (item.percentChange > 0 ? (
                        <TrendingUp sx={{ fontSize: 16, color: "#10b981" }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 16, color: "#ef4444" }} />
                      ))}
                    <Typography
                      variant="body2"
                      fontWeight="700"
                      sx={{
                        fontSize: "0.8rem",
                        color:
                          item.percentChange > 0
                            ? "#10b981"
                            : item.percentChange < 0
                            ? "#ef4444"
                            : "#6b7280",
                      }}
                    >
                      {item.percentChange > 0 ? "+" : ""}
                      {item.percentChange}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ServiceWiseSummary;
