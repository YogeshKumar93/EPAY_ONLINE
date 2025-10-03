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
import TransactionDetail from "../components/TransactionDetail";
import ServiceWiseProfit from "../components/ServiceWiseProfilt";
// import TransactionDetail from "../components/TransactionDetail";
// import ServiceWiseProfit from "../components/ServiceWiseProfilt";

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
        const stats = response?.data?.map((item) => ({
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
    const role = roleItem?.role?.toLowerCase();
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
    ? Object.entries(dashboardData2?.data).map(([service, stats]) => {
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
    <Box
      sx={{
        backgroundColor: "#f8fafc",
      }}
    >
      {<TransactionDetail />}
      {user.role !== "ret" && (
        <Grid container spacing={2} mb={4}>
          {cards.map((card, i) => {
            let textColor = "#111827";
            return (
              <Grid item key={i} sx={{}}>
                <Card
                  sx={{
                    width: "350px",
                    height: "100%",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                    alignItems: "center",
                    ml: 4,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: textColor }}
                    >
                      {card.title}
                    </Typography>
                    <Box sx={{ color: textColor }}>{card.icon}</Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: textColor }}
                  >
                    {card.value}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <ServiceWiseProfit />
      {user.role === "adm" && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={6}>
            <Box
              sx={{ height: "100%", minHeight: { xs: "400px", md: "500px" } }}
            >
              <Card
                sx={{
                  p: 1,
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    p: { xs: 1, sm: 1.5 },
                    background: "#fff",
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <TrendingUp
                    sx={{ fontSize: { xs: 18, sm: 20 }, color: "#000" }}
                  />
                  Service-wise Summary
                </Typography>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "0 0 8px 8px",
                    borderTop: "none",

                    maxHeight: { xs: "350px", sm: "400px", md: "440px" },
                    overflow: "auto",
                  }}
                >
                  <Table
                    stickyHeader
                    sx={{
                      "& .MuiTableCell-root": {
                        fontSize: {
                          xs: "0.65rem",
                          sm: "0.7rem",
                          md: "0.75rem",
                        },
                        py: { xs: 0.5, sm: 1 },
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "30%", sm: "28%", md: "25%" },
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          Service
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "16%", sm: "17%", md: "18%" },
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          LMTD
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "16%", sm: "17%", md: "18%" },
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          MTD
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "16%", sm: "17%", md: "18%" },
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          Today
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "11%", sm: "11%", md: "12%" },
                            textAlign: "center",
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          Txns
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "11%", sm: "10%", md: "9%" },
                            textAlign: "center",
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          %
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {loadingDashboard2 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            sx={{
                              py: 3,
                              textAlign: "center",
                              bgcolor: "#ffffff",
                            }}
                          >
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              gap={1}
                            >
                              <CircularProgress
                                size={20}
                                sx={{ color: "#2275B7" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                }}
                              >
                                Loading data...
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        serviceData?.map((item, i) => (
                          <TableRow
                            key={i}
                            hover
                            sx={{
                              "&:hover": { backgroundColor: "#f8fbff" },
                              "&:last-child td": { borderBottom: "none" },
                              backgroundColor:
                                i % 2 === 0 ? "#ffffff" : "#fafcff",
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                py: { xs: 0.5, sm: 1 },
                                color: "#1e293b",
                                borderRight: "1px solid #f1f5f9",
                                fontSize: {
                                  xs: "0.65rem",
                                  sm: "0.7rem",
                                  md: "0.75rem",
                                },
                              }}
                            >
                              {item.service}
                            </TableCell>
                            <TableCell
                              sx={{
                                py: { xs: 0.5, sm: 1 },
                                borderRight: "1px solid #f1f5f9",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="body2"
                                  fontWeight={500}
                                  sx={{
                                    fontSize: "inherit",
                                    lineHeight: 1.2,
                                  }}
                                >
                                  ₹{item.lmtdAmount}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="#64748b"
                                  sx={{
                                    fontSize: { xs: "0.6rem", sm: "0.65rem" },
                                    lineHeight: 1.2,
                                  }}
                                >
                                  ({item.lmtdCount})
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                py: { xs: 0.5, sm: 1 },
                                borderRight: "1px solid #f1f5f9",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="body2"
                                  fontWeight={500}
                                  sx={{
                                    fontSize: "inherit",
                                    lineHeight: 1.2,
                                  }}
                                >
                                  ₹{item.mtdAmount}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="#64748b"
                                  sx={{
                                    fontSize: { xs: "0.6rem", sm: "0.65rem" },
                                    lineHeight: 1.2,
                                  }}
                                >
                                  ({item.mtdCount})
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                py: { xs: 0.5, sm: 1 },
                                borderRight: "1px solid #f1f5f9",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="body2"
                                  fontWeight={500}
                                  sx={{
                                    fontSize: "inherit",
                                    lineHeight: 1.2,
                                  }}
                                >
                                  ₹{item.tdAmount}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="#64748b"
                                  sx={{
                                    fontSize: { xs: "0.6rem", sm: "0.65rem" },
                                    lineHeight: 1.2,
                                  }}
                                >
                                  ({item.tdCount})
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                py: { xs: 0.5, sm: 1 },
                                fontWeight: 600,
                                color: "#000",
                                borderRight: "1px solid #f1f5f9",
                                textAlign: "center",
                                fontSize: {
                                  xs: "0.65rem",
                                  sm: "0.7rem",
                                  md: "0.75rem",
                                },
                              }}
                            >
                              {item.totalTxns}
                            </TableCell>
                            <TableCell
                              sx={{
                                py: { xs: 0.5, sm: 1 },
                                fontWeight: 700,
                                color:
                                  item.percentChange >= 0
                                    ? "#16a34a"
                                    : "#dc2626",
                                textAlign: "center",
                                fontSize: {
                                  xs: "0.65rem",
                                  sm: "0.7rem",
                                  md: "0.75rem",
                                },
                              }}
                            >
                              {item.percentChange >= 0 ? "+" : ""}
                              {item.percentChange}%
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                height: "100%",
                minHeight: { xs: "400px", md: "500px" },
              }}
            >
              <Card
                sx={{
                  p: 1,

                  minHeight: { xs: "400px", sm: "450px", md: "500px" },
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    p: { xs: 1, sm: 1.5 },
                    background: "#fff",
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  User Statistics
                </Typography>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "0 0 8px 8px",
                    borderTop: "none",
                    // flex: 1,
                    maxHeight: { xs: "350px", sm: "400px", md: "440px" },
                    overflow: "auto",
                  }}
                >
                  <Table
                    stickyHeader
                    sx={{
                      "& .MuiTableCell-root": {
                        fontSize: {
                          xs: "0.65rem",
                          sm: "0.7rem",
                          md: "0.75rem",
                        },
                        // py: { xs: 0.5, sm: 1 },
                        px: { xs: 0.5, sm: 1 },
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "28%", sm: "26%", md: "25%" },
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          Role
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "14%", sm: "15%", md: "15%" },
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          Total Users
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "14%", sm: "15%", md: "15%" },
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          Wallet 1
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "14%", sm: "15%", md: "15%" },
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          Wallet 2
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "14%", sm: "15%", md: "15%" },
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          Wallet 3
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#f8fafc",
                            width: { xs: "16%", sm: "14%", md: "15%" },
                            py: { xs: 0.5, sm: 1 },
                          }}
                        >
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loadingDashboard ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            sx={{
                              py: 3,
                              textAlign: "center",
                              bgcolor: "#ffffff",
                            }}
                          >
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              gap={1}
                            >
                              <CircularProgress
                                size={20}
                                sx={{ color: "#2275B7" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                }}
                              >
                                Loading data...
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {userStatsDynamic?.map((stat, i) => (
                            <TableRow
                              key={i}
                              hover
                              sx={{
                                "&:hover": { backgroundColor: "#f8fbff" },
                                backgroundColor:
                                  i % 2 === 0 ? "#ffffff" : "#fafcff",
                              }}
                            >
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  py: { xs: 0.5, sm: 1 },
                                  color: "#1e293b",
                                  borderRight: "1px solid #f1f5f9",
                                  fontSize: {
                                    xs: "0.65rem",
                                    sm: "0.7rem",
                                    md: "0.75rem",
                                  },
                                }}
                              >
                                <Box display="flex" alignItems="center">
                                  <Box
                                    sx={{
                                      mr: 1,
                                      display: { xs: "none", sm: "block" },
                                    }}
                                  >
                                    {stat.icon}
                                  </Box>
                                  <Box
                                    sx={{
                                      fontSize: {
                                        xs: "0.65rem",
                                        sm: "0.7rem",
                                        md: "0.75rem",
                                      },
                                    }}
                                  >
                                    {stat.type}
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{
                                  py: { xs: 0.5, sm: 1 },
                                  borderRight: "1px solid #f1f5f9",
                                }}
                              >
                                {stat.count}
                              </TableCell>
                              <TableCell
                                sx={{
                                  py: { xs: 0.5, sm: 1 },
                                  borderRight: "1px solid #f1f5f9",
                                }}
                              >
                                {(stat.w1 / 100).toLocaleString()}
                              </TableCell>
                              <TableCell
                                sx={{
                                  py: { xs: 0.5, sm: 1 },
                                  borderRight: "1px solid #f1f5f9",
                                }}
                              >
                                {(stat.w2 / 100).toLocaleString()}
                              </TableCell>
                              <TableCell
                                sx={{
                                  py: { xs: 0.5, sm: 1 },
                                  borderRight: "1px solid #f1f5f9",
                                }}
                              >
                                {(stat.w3 / 100).toLocaleString()}
                              </TableCell>
                              <TableCell
                                sx={{
                                  py: { xs: 0.5, sm: 1 },
                                  fontWeight: 600,
                                  color: "#000",
                                  fontSize: {
                                    xs: "0.65rem",
                                    sm: "0.7rem",
                                    md: "0.75rem",
                                  },
                                }}
                              >
                                {(
                                  (stat.w1 + stat.w2 + stat.w3) /
                                  100
                                ).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}

                          {/* Grand Total Row */}
                          <TableRow
                            sx={{
                              bgcolor: "#f1f5f9",
                              "&:last-child td": { borderBottom: "none" },
                              "& td": {
                                fontWeight: 700,
                                py: { xs: 0.5, sm: 1 },
                                fontSize: {
                                  xs: "0.65rem",
                                  sm: "0.7rem",
                                  md: "0.75rem",
                                },
                                borderRight: "1px solid #e2e8f0",
                                "&:last-child": { borderRight: "none" },
                              },
                            }}
                          >
                            <TableCell>Total</TableCell>
                            <TableCell>
                              {userStatsDynamic.reduce(
                                (sum, stat) => sum + stat.count,
                                0
                              )}
                            </TableCell>
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
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
