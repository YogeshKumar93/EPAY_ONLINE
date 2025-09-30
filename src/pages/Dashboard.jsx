import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  Grid,
  Card,
  Typography,
  Box,
  Select,
  MenuItem,
  useMediaQuery,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Group,
  SupervisorAccount,
  CorporateFare,
  Engineering,
  AdminPanelSettings,
  AccountCircle,
  Devices,
  TrendingUp,
  PointOfSale,
  CheckCircle,
  Schedule,
  AccountBalanceWallet,
  AccountBalance,
  Api,
  Search,
  Notifications,
  Menu as MenuIcon,
  ArrowDropUp,
  ArrowDropDown,
  Refresh,
} from "@mui/icons-material";
import {
  Payment,
  Receipt,
  CompareArrows,
  AllInbox,
  VerifiedUser,
  PaymentRounded,
  Train,
  LocalAtm,
  TransferWithinAStation,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import { formatInLakh } from "../utils/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [range, setRange] = useState("30");
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardData2, setDashboardData2] = useState(null);
  const [loadingDashboard2, setLoadingDashboard2] = useState(true);
  const [grandTotal, setGrrandTotal] = useState("");
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [bankBalance, setBankBalance] = useState(null);
  const [loadingBank, setLoadingBank] = useState(false);
  const [apiBalance, setApiBalance] = useState(null);
  const [loadingApiBalance, setLoadingApiBank] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const isAdmin = user?.role === "adm"; // Only admin can see bank/api

  const fetchBankBalance = async () => {
    setLoadingBank(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_BANK_BALANCE
      );

      if (response) {
        setBankBalance(response?.data);
        console.log("Bank Balance data:", response);
      } else {
        console.error("Bank Balance API error:", error);
      }
    } catch (err) {
      console.error("Bank Balance fetch failed:", err);
    } finally {
      setLoadingBank(false);
    }
  };

  const fetchDashboard2 = async () => {
    setLoadingDashboard2(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_DASHBOARD2
      );

      if (response) {
        setDashboardData2(response);
        console.log("Dashboard2 data:", response);
      } else {
        console.error("Dashboard2 API error:", error);
      }
    } catch (err) {
      console.error("Dashboard2 fetch failed:", err);
    } finally {
      setLoadingDashboard2(false);
    }
  };

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

        // Transform API data into table-friendly format
        const stats = response.data.map((item) => ({
          type: item.role,
          count: item.total_users,
          w1: item.total_w1,
          w2: item.total_w2,
          w3: item.total_w3,
          icon: null, // replace with icon if needed
        }));

        // setUserStatsDynamic(stats);
      } else {
        console.error("Dashboard API error:", error);
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoadingDashboard(false);
    }
  };
  const fetchApiBalance = async () => {
    setLoadingApiBank(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.API_BALANCE
      );

      if (response?.data) {
        const balances = response.data;

        // ✅ total calculate (safely convert to numbers)
        const total = Object.values(balances).reduce(
          (acc, val) => acc + parseFloat(val || 0),
          0
        );

        setApiBalance(balances);
        setTotalBalance(total);

        console.log("Balances:", balances);
        console.log("Total Balance:", total);
      } else {
        console.error("Dashboard API error:", error);
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoadingApiBank(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchDashboard2();
    if (isAdmin) {
      fetchBankBalance();
      fetchApiBalance();
    }
  }, [isAdmin]);
  const cardStyle = {
    p: 3,
    width: "100%",
    borderRadius: 2,
    background: "white",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  };
  // Inside your Dashboard component, after fetching dashboardData
  const roleIcons = {
    ret: <Group sx={{ color: "#4f46e5" }} />,
    asm: <SupervisorAccount sx={{ color: "#16a34a" }} />,
    md: <CorporateFare sx={{ color: "#f97316" }} />,
    ad: <Engineering sx={{ color: "#dc2626" }} />,
    dd: <SupervisorAccount sx={{ color: "#0891b2" }} />,
    api: <Devices sx={{ color: "#9333ea" }} />,
    admin: <AdminPanelSettings sx={{ color: "#eab308" }} />,
    zsm: <AccountCircle sx={{ color: "#2563eb" }} />,
    di: <AccountCircle sx={{ color: "#1d4ed8" }} />, // Add more roles as needed
  };

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return "0"; // null, undefined ya NaN handle
    if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + " L";
    return num.toLocaleString();
  };

  const userStatsDynamic = dashboardData?.data?.map((roleItem) => {
    const role = roleItem.role.toLowerCase();
    return {
      type:
        role === "ret"
          ? "Retailers"
          : role === "adm"
          ? "Admin"
          : role === "md"
          ? "Master Distributor"
          : role === "ad"
          ? "Area Distributor"
          : role === "dd"
          ? "Direct Dealer"
          : role === "api"
          ? "API"
          : role === "asm"
          ? "Area Sales Manager"
          : role === "zsm"
          ? "Zonal Sales Manager"
          : role === "di"
          ? "Distributor"
          : role.toUpperCase(),
      count: roleItem.total_users.toLocaleString(),
      icon: roleIcons[role] || <AccountCircle />,
      w1: roleItem.total_w1, // keep as number
      w2: roleItem.total_w2, // keep as number
      w3: roleItem.total_w3, // keep as number
    };
  });

  const cards = [
    {
      title: "Primary",
      value: "1.3 Cr",
      icon: <AccountBalance sx={{ color: "#fff" }} />,
    },
    {
      title: "Tertiary",
      value: "1.6 Cr",
      icon: <TrendingUp sx={{ color: "#16a34a" }} />,
    },
    {
      title: "TOTAL",
      value: "2953",
      icon: <PointOfSale sx={{ color: "#9333ea" }} />,
    },
    {
      title: "SUCCESS",
      value: "2023",
      icon: <CheckCircle sx={{ color: "#22c55e" }} />,
    },
    {
      title: "PENDING",
      value: "22",
      icon: <Schedule sx={{ color: "#f97316" }} />,
    },
    {
      title: "Wallet Balance",
      value: `₹${formatNumber(grandTotal)}`,
      icon: <AccountBalanceWallet sx={{ color: "#0ea5e9" }} />,
    },
    // Admin-only cards

    // Inside your cards array
    ...(isAdmin
      ? [
          {
            title: "Bank Balance",
            value: `₹${formatNumber(bankBalance)}`,
            icon: (
              <IconButton
                size="small"
                onClick={fetchBankBalance}
                disabled={loadingBank}
              >
                {loadingBank ? (
                  <CircularProgress size={18} sx={{ color: "#1d4ed8" }} />
                ) : (
                  <Refresh sx={{ color: "#1d4ed8" }} />
                )}
              </IconButton>
            ),
          },
          {
            title: "API Balance",
            value: `${formatInLakh(totalBalance)}`,
            icon: (
              <IconButton
                size="small"
                onClick={fetchApiBalance}
                disabled={loadingApiBalance}
              >
                {loadingApiBalance ? (
                  <CircularProgress size={18} sx={{ color: "#e11d48" }} />
                ) : (
                  <Refresh sx={{ color: "#e11d48" }} />
                )}
              </IconButton>
            ),
          },
        ]
      : []),
  ];

  const serviceData = dashboardData2?.data
    ? Object.entries(dashboardData2.data).map(([service, stats]) => {
        const mtd = parseFloat(stats.mtd_amount); // This month till date
        const lmtd = parseFloat(stats.lmtd_amount); // Last month till date

        let percentChange = 0;
        if (lmtd > 0) {
          percentChange = ((mtd - lmtd) / lmtd) * 100; // Percent change vs last month
        } else if (mtd > 0 && lmtd === 0) {
          percentChange = 100; // If last month was 0 but we have this month, show 100%
        }

        return {
          service: service.toUpperCase(),
          totalTxns: stats.total_txns ?? 0,
          tdAmount: stats.td_amount ?? "0.00",
          tdCount: stats.td_count ?? 0,
          mtdAmount: stats.mtd_amount ?? "0.00",
          mtdCount: stats.mtd_count ?? 0,
          lmtdAmount: stats.lmtd_amount ?? "0.00",
          lmtdCount: stats.lmtd_count ?? 0,
          percentChange: percentChange.toFixed(2), // 2 decimal places
        };
      })
    : [];

  const totalW1 = userStatsDynamic?.reduce(
    (acc, stat) => acc + Number(stat.w1 || 0),
    0
  );

  const totalW2 = userStatsDynamic?.reduce(
    (acc, stat) => acc + Number(stat.w2 || 0),
    0
  );
  const totalW3 = userStatsDynamic?.reduce(
    (acc, stat) => acc + Number(stat.w3 || 0),
    0
  );
  useEffect(() => {
    const total = totalW1 + totalW2 + totalW3;
    setGrrandTotal(total);
  }, [totalW1, totalW2, totalW3]);

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", p: 2 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={4}
      >
        {isMobile && (
          <IconButton sx={{ mr: 1, color: "text.secondary" }} aria-label="menu">
            <MenuIcon />
          </IconButton>
        )}
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            size="small"
            sx={{
              minWidth: 180,
              bgcolor: "white",
              borderRadius: 2,
              mr: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem value="7">Last 7 Days</MenuItem>
            <MenuItem value="30">Last 30 Days</MenuItem>
            <MenuItem value="90">Last 90 Days</MenuItem>
          </Select>
          <Box sx={{ display: "flex", gap: 1.5, mr: 2 }}>
            {["today", "week", "month"].map((item) => {
              const label =
                item === "today"
                  ? "Today"
                  : item === "week"
                  ? "Last Week"
                  : "This Month";
              const isSelected = range === item;
              return (
                <Button
                  key={item}
                  onClick={() => setRange(item)}
                  variant={isSelected ? "contained" : "outlined"}
                  size="small"
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    px: 2.5,
                    py: 0.8,
                    fontWeight: 500,
                    fontSize: 14,
                    color: isSelected ? "#fff" : "#2563eb",
                    background: isSelected
                      ? "linear-gradient(135deg, #3b82f6, #60a5fa)"
                      : "transparent",
                    borderColor: "#3b82f6",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: isSelected
                        ? "linear-gradient(135deg, #2563eb, #3b82f6)"
                        : "rgba(59,130,246,0.1)",
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Box>
      {/* Cards */}
      <Grid container spacing={1.6} mb={4}>
        {cards.map((card, i) => {
          let customStyle = { ...cardStyle };
          let textColor = "#111827"; // default dark text

          if (card.title === "Primary") {
            customStyle = {
              ...customStyle,
              background: "linear-gradient(135deg, #f472b6, #f9a8d4)", // pink gradient similar to Tertiary
              color: "#fff",
              border: "none",
              boxShadow: "0 6px 16px rgba(244, 114, 182, 0.3)", // pinkish shadow
            };
            textColor = "#fff";
          } else if (card.title === "Tertiary") {
            customStyle = {
              ...customStyle,
              background: "#f0fdf4", // light green background
              color: "#16a34a",
              border: "1px solid #16a34a",
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.15)",
            };
            textColor = "#16a34a";
          }

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Card sx={customStyle}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: textColor,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Box sx={{ color: textColor }}>{card.icon}</Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: textColor,
                    }}
                  >
                    {card.value}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
      <Grid container spacing={2} mb={4}>
        {/* Service-wise Transaction Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Service-wise Transaction Summary
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                maxHeight: 400,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Service
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      LMTD Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      MTD Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Today's Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Total Txns
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      % Change
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingDashboard2 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    serviceData.map((item, i) => (
                      <TableRow
                        key={i}
                        hover
                        sx={{ "&:hover": { bgcolor: "#f9fafb" } }}
                      >
                        <TableCell>{item.service}</TableCell>
                        <TableCell>
                          ₹{item.lmtdAmount} ({item.lmtdCount})
                        </TableCell>
                        <TableCell>
                          ₹{item.mtdAmount} ({item.mtdCount})
                        </TableCell>
                        <TableCell>
                          ₹{item.tdAmount} ({item.tdCount})
                        </TableCell>
                        <TableCell>{item.totalTxns}</TableCell>
                        <TableCell
                          sx={{
                            color: item.percentChange >= 0 ? "green" : "red",
                          }}
                        >
                          {item.percentChange}%
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* User Table */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              User Table
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                maxHeight: 360,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Total Users
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Wallet 1
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Wallet 2
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Wallet 3
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingDashboard ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {userStatsDynamic.map((stat, i) => (
                        <TableRow
                          key={i}
                          hover
                          sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Box sx={{ mr: 1 }}>{stat.icon}</Box>
                              {stat.type}
                            </Box>
                          </TableCell>
                          <TableCell>{stat.count}</TableCell>
                          <TableCell>
                            {(stat.w1 / 100).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {(stat.w2 / 100).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {(stat.w3 / 100).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {(
                              (stat.w1 + stat.w2 + stat.w3) /
                              100
                            ).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Grand Total Row */}
                      <TableRow sx={{ bgcolor: "#f1f5f9", fontWeight: "bold" }}>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell>
                          {(totalW1 / 100).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {(totalW2 / 100).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {(totalW3 / 100).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {(grandTotal / 100).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
