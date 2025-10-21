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
  Card,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Group,
  SupervisorAccount,
  CorporateFare,
  Engineering,
  Devices,
  AdminPanelSettings,
  AccountCircle,
  Refresh,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";

const RoleWiseUserSummary = () => {
  const theme = useTheme();
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);

  const fetchDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_DASHBOARD1
      );

      if (response) {
        setDashboardData(response);
        console.log("Dashboard data:", response);
      } else {
        console.error("Dashboard API error:", error);
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Role icons configuration
  const roleIcons = {
    ret: <Group sx={{ color: "#4f46e5", fontSize: 20 }} />,
    asm: <SupervisorAccount sx={{ color: "#16a34a", fontSize: 20 }} />,
    md: <CorporateFare sx={{ color: "#f97316", fontSize: 20 }} />,
    ad: <Engineering sx={{ color: "#dc2626", fontSize: 20 }} />,
    dd: <SupervisorAccount sx={{ color: "#0891b2", fontSize: 20 }} />,
    api: <Devices sx={{ color: "#9333ea", fontSize: 20 }} />,
    admin: <AdminPanelSettings sx={{ color: "#eab308", fontSize: 20 }} />,
    zsm: <AccountCircle sx={{ color: "#2563eb", fontSize: 20 }} />,
    di: <AccountCircle sx={{ color: "#1d4ed8", fontSize: 20 }} />,
    adm: <AdminPanelSettings sx={{ color: "#dc2626", fontSize: 20 }} />,
  };

  // Role names mapping
  const getRoleName = (role) => {
    const roleMap = {
      adm: "Admin",
      zsm: "Zonal Sales Manager",
      asm: "Area Sales Manager",
      md: "Master Distributor",
      di: "Distributor",
      ret: "Retailers",
      dd: "Direct Dealer",
      // ad: "Area Distributor",
      api: "API",
    };
    return roleMap[role] || role.toUpperCase();
  };

  const processUserData = () => {
    if (!dashboardData?.data) return [];

    return dashboardData.data.map((roleItem) => {
      const role = roleItem?.role?.toLowerCase();
      const totalUsers = parseInt(roleItem.total_users) || 0;
      const w1 = parseInt(roleItem.total_w1) || 0;
      const w2 = parseInt(roleItem.total_w2) || 0;
      const w3 = parseInt(roleItem.total_w3) || 0;
      const rowTotal = w1 + w2 + w3;

      // Calculate percentages safely
      const w1Percentage = totalUsers > 0 ? (w1 / totalUsers) * 100 : 0;
      const w2Percentage = totalUsers > 0 ? (w2 / totalUsers) * 100 : 0;
      const w3Percentage = totalUsers > 0 ? (w3 / totalUsers) * 100 : 0;

      return {
        role,
        name: getRoleName(role),
        totalUsers,
        w1,
        w2,
        w3,
        rowTotal,
        w1Percentage: Math.round(w1Percentage),
        w2Percentage: Math.round(w2Percentage),
        w3Percentage: Math.round(w3Percentage),
        icon: roleIcons[role] || <AccountCircle sx={{ fontSize: 20 }} />,
      };
    });
  };

  const userStats = processUserData();

  // Calculate totals - FIXED CALCULATIONS
  const totalW1 = userStats.reduce((acc, stat) => acc + stat.w1, 0);
  const totalW2 = userStats.reduce((acc, stat) => acc + stat.w2, 0);
  const totalW3 = userStats.reduce((acc, stat) => acc + stat.w3, 0);
  const totalUsers = userStats.reduce((acc, stat) => acc + stat.totalUsers, 0);
  const totalRowTotals = userStats.reduce(
    (acc, stat) => acc + stat.rowTotal,
    0
  );

  const overallW1Percentage =
    totalUsers > 0 ? Math.round((totalW1 / totalUsers) * 100) : 0;
  const overallW2Percentage =
    totalUsers > 0 ? Math.round((totalW2 / totalUsers) * 100) : 0;
  const overallW3Percentage =
    totalUsers > 0 ? Math.round((totalW3 / totalUsers) * 100) : 0;

  useEffect(() => {
    setGrandTotal(totalW1 + totalW2 + totalW3);
  }, [totalW1, totalW2, totalW3]);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-IN");
  };

  // Get trend indicator for percentages

  if (loadingDashboard) {
    return (
      <Card
        sx={{
          p: 4,
          textAlign: "center",
          boxShadow: 2,
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <CircularProgress size={40} sx={{ color: "#2563eb" }} />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Loading user statistics...
          </Typography>
        </Box>
      </Card>
    );
  }

  if (!dashboardData?.data || userStats.length === 0) {
    return (
      <Card
        sx={{
          p: 4,
          textAlign: "center",
          boxShadow: 2,
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No user data available
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            There are no user statistics to display.
          </Typography>
          <IconButton
            onClick={fetchDashboard}
            sx={{
              bgcolor: "#2563eb",
              color: "white",
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            <Refresh />
          </IconButton>
        </Box>
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
          background: "#6C4BC7",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Group sx={{ fontSize: 24 }} />
          <Box>
            <Typography variant="h6" fontWeight="600">
              Role-wise User Summary
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh data">
          <IconButton
            size="small"
            onClick={fetchDashboard}
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
      <TableContainer sx={{ maxHeight: 440 }}>
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
                  width: "25%",
                }}
              >
                USER ROLE
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                  width: "15%",
                }}
              >
                TOTAL USERS
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                  width: "15%",
                }}
              >
                W1
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                  width: "15%",
                }}
              >
                W2
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                  width: "15%",
                }}
              >
                W3
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#f8fafc",
                  fontSize: "0.75rem",
                  // py: 1.5,
                  borderBottom: "2px solid #e2e8f0",
                  width: "25%",
                }}
              >
                TOTAL AMOUNT
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {userStats.map((item, index) => (
              <TableRow
                key={item.role}
                hover
                sx={{
                  "&:hover": { bgcolor: "#f8fbff" },
                  bgcolor: index % 2 === 0 ? "#ffffff" : "#fafcff",
                  transition: "background-color 0.2s",
                }}
              >
                {/* Role Name */}
                <TableCell
                  sx={{
                    py: 1.5,
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {item.icon}
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ fontSize: "0.8rem" }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Total Users */}
                <TableCell
                  align="center"
                  sx={{ py: 1.5, borderBottom: "1px solid #f1f5f9" }}
                >
                  <Chip
                    label={formatNumber(item.totalUsers)}
                    size="small"
                    sx={{
                      bgcolor: "#2563eb",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                </TableCell>

                {/* W1 */}
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
                      {formatNumber(item.w1)}
                    </Typography>
                  </Box>
                </TableCell>

                {/* W2 */}
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
                      {formatNumber(item.w2)}
                    </Typography>
                  </Box>
                </TableCell>

                {/* W3 */}
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
                      {formatNumber(item.w3)}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Total Amount (W1 + W2 + W3) */}
                <TableCell
                  align="center"
                  sx={{ py: 1.5, borderBottom: "1px solid #f1f5f9" }}
                >
                  <Chip
                    label={formatNumber(item.rowTotal)}
                    size="small"
                    sx={{
                      bgcolor: "#059669",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Footer */}
      <Box
        sx={{
          p: 1.5,
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: "#10b981",
                borderRadius: "50%",
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontSize: "0.7rem" }}
            >
              W1: {formatNumber(totalW1)} ({overallW1Percentage}%)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: "#f59e0b",
                borderRadius: "50%",
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontSize: "0.7rem" }}
            >
              W2: {formatNumber(totalW2)} ({overallW2Percentage}%)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: "#ef4444",
                borderRadius: "50%",
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontSize: "0.7rem" }}
            >
              W3: {formatNumber(totalW3)} ({overallW3Percentage}%)
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontWeight: 600 }}
        >
          Grand Total: {formatNumber(grandTotal)}
        </Typography>
      </Box>
    </Box>
  );
};

export default RoleWiseUserSummary;
