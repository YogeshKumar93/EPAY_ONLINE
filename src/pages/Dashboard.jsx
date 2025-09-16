import React, { useState } from "react";
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

// --- Sales Data
const salesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  datasets: [
    {
      label: "Sales (in lakhs)",
      data: [0, 5, 7, 6, 5, 4, 3, 2, 1, 0],
      backgroundColor: [
        "#f97316",
        "#16a34a",
        "#2563eb",
        "#9333ea",
        "#ef4444",
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#8b5cf6",
        "#14b8a6",
      ],
      borderColor: "#64748b",
      borderWidth: 2,
      borderRadius: 6,
    },
  ],
};

const salesOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#334155",
      bodyColor: "#475569",
      borderColor: "#e2e8f0",
      borderWidth: 1,
      cornerRadius: 6,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#64748b" },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (val) => `${val} L`,
        color: "#64748b",
      },
      grid: {
        borderDash: [6, 6],
        color: "rgba(148, 163, 184, 0.15)",
      },
    },
  },
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [range, setRange] = useState("30");

  const cardStyle = {
    p: 3,
    width: "100%",
    borderRadius: 2,
    background: "white",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  };

  const userStats = [
    { type: "Retailers", count: "2,453", icon: <Group sx={{ color: "#4f46e5" }} />, change: "+12%" },
    { type: "ASM", count: "342", icon: <SupervisorAccount sx={{ color: "#16a34a" }} />, change: "+5%" },
    { type: "MD", count: "15", icon: <CorporateFare sx={{ color: "#f97316" }} />, change: "+0%" },
    { type: "AD", count: "28", icon: <Engineering sx={{ color: "#dc2626" }} />, change: "+8%" },
    { type: "DD", count: "56", icon: <SupervisorAccount sx={{ color: "#0891b2" }} />, change: "+15%" },
    { type: "API", count: "1,243", icon: <Devices sx={{ color: "#9333ea" }} />, change: "+22%" },
    { type: "Admin", count: "42", icon: <AdminPanelSettings sx={{ color: "#eab308" }} />, change: "-3%" },
    { type: "ZSM", count: "4,179", icon: <AccountCircle sx={{ color: "#2563eb" }} />, change: "+10%" },
  ];

  const cards = [
    { title: "Primary", value: "1.3 Cr", icon: <AccountBalance sx={{ color: "#fff" }} /> },
    { title: "Tertiary", value: "1.6 Cr", icon: <TrendingUp sx={{ color: "#16a34a" }} /> },
    { title: "TOTAL", value: "2953", icon: <PointOfSale sx={{ color: "#9333ea" }} /> },
    { title: "SUCCESS", value: "2023", icon: <CheckCircle sx={{ color: "#22c55e" }} /> },
    { title: "PENDING", value: "22", icon: <Schedule sx={{ color: "#f97316" }} /> },
    { title: "Wallet Balance", value: "₹1.26 Cr", icon: <AccountBalanceWallet sx={{ color: "#0ea5e9" }} /> },
    { title: "Bank Balance", value: "₹0.88 Cr", icon: <AccountBalance sx={{ color: "#1d4ed8" }} /> },
    { title: "API Balances", value: "₹0.03 Cr", icon: <Api sx={{ color: "#e11d48" }} /> },
  ];

  const tableData = [
    { service: "Prepaid", lastMonth: "₹38,877", thisMonth: "₹14,275", today: "₹44,729", achieved: 39.71, icon: <Payment sx={{ color: "#2563eb" }} /> },
    { service: "Utility", lastMonth: "₹3,96,933", thisMonth: "₹2,37,715", today: "₹47,064", achieved: 29.79, icon: <Receipt sx={{ color: "#16a34a" }} /> },
    { service: "Money Transfer", lastMonth: "₹34,800", thisMonth: "₹54,579", today: "₹11,24,718", achieved: 59.52, icon: <CompareArrows sx={{ color: "#9333ea" }} /> },
    { service: "Aeps", lastMonth: "₹9,93,639", thisMonth: "₹3,53,750", today: "₹7,44,750", achieved: 62.44, icon: <AllInbox sx={{ color: "#f97316" }} /> },
    { service: "Verification", lastMonth: "₹8,127", thisMonth: "₹4,323", today: "₹193", achieved: 83.19, icon: <VerifiedUser sx={{ color: "#22c55e" }} /> },
    { service: "Payments", lastMonth: "₹0", thisMonth: "₹0", today: "₹0", achieved: 0, icon: <PaymentRounded sx={{ color: "#3b82f6" }} /> },
    { service: "Railways", lastMonth: "₹0", thisMonth: "₹0", today: "₹0", achieved: 0, icon: <Train sx={{ color: "#ef4444" }} /> },
    { service: "CMS", lastMonth: "₹0", thisMonth: "₹0", today: "₹0", achieved: 0, icon: <AccountBalance sx={{ color: "#10b981" }} /> },
    { service: "Settlements", lastMonth: "₹0", thisMonth: "₹0", today: "₹0", achieved: 0, icon: <LocalAtm sx={{ color: "#f59e0b" }} /> },
    { service: "Mini ATM", lastMonth: "₹0", thisMonth: "₹0", today: "₹0", achieved: 0, icon: <LocalAtm sx={{ color: "#8b5cf6" }} /> },
    { service: "Nepal Transfer", lastMonth: "₹0", thisMonth: "₹0", today: "₹0", achieved: 0, icon: <TransferWithinAStation sx={{ color: "#14b8a6" }} /> },
  ];

  const ProgressBar = ({ value }) => {
    let color = value >= 70 ? "success" : value >= 40 ? "warning" : "error";
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {value}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={value}
          color={color}
          sx={{
            height: 6,
            borderRadius: 3,
            mt: 0.5,
            background: "linear-gradient(to right, #e2e8f0, #f1f5f9)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
            },
          }}
        />
      </Box>
    );
  };

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", p: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={4}>
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
    const label = item === "today" ? "Today" : item === "week" ? "Last Week" : "This Month";
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
          background: isSelected ? "linear-gradient(135deg, #3b82f6, #60a5fa)" : "transparent",
          borderColor: "#3b82f6",
          transition: "all 0.3s ease",
          "&:hover": {
            background: isSelected ? "linear-gradient(135deg, #2563eb, #3b82f6)" : "rgba(59,130,246,0.1)",
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

      {/* User Stats */}
      <Grid container spacing={2.5} mb={4}>
        {userStats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
              <Card sx={cardStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box>{stat.icon}</Box>
                  <Chip
                    icon={stat.change.includes("+") ? <ArrowDropUp /> : <ArrowDropDown />}
                    label={stat.change}
                    size="small"
                    sx={{ bgcolor: "#f1f5f9", fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="h5" fontWeight={700}>{stat.count}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.type}</Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
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


      {/* Table + Bar Chart */}
      <Grid container spacing={2} mb={4}>
        {/* Table */}
        <Grid item xs={12} md={9}>
          <Card sx={cardStyle}>
            <Typography variant="h6" fontWeight={600} mb={2}>Product Sale Table</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, maxHeight: 360, width:"800px" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>Services</TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>Last Month</TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>This Month</TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>Today</TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>Achieved</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, i) => (
                    <TableRow key={i} hover sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box sx={{ mr: 1 }}>{row.icon}</Box>
                          {row.service}
                        </Box>
                      </TableCell>
                      <TableCell>{row.lastMonth}</TableCell>
                      <TableCell>{row.thisMonth}</TableCell>
                      <TableCell>{row.today}</TableCell>
                      <TableCell><ProgressBar value={row.achieved} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={3}>
          <Card sx={cardStyle}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} width="300px">
              <Typography variant="h6" fontWeight={600}>Sales Overview</Typography>
              <TrendingUp sx={{ color: "#16a34a" }} />
            </Box>
            <Box sx={{ width: "100%", height: { xs: 280, sm: 360 } }}>
              <Bar data={salesData} options={salesOptions} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
