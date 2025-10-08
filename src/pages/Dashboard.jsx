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
  TrendingDown,
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
import TransactionDetail from "../components/Dashboard/TransactionDetail";
import ServiceWiseProfit from "../components/Dashboard/ServiceWiseProfilt";
import ServiceWiseSummary from "../components/Dashboard/ServiceWiseSummary";
import RoleWiseUserSummary from "../components/Dashboard/RoleWiseUserSummary";
import ApiBalance from "../components/Dashboard/ApiBalance";

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

  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const isAdmin = user?.role === "adm"; // Only admin can see bank/api
  const [newsData, setNewsData] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      const { error, response } = await apiCall("post", ApiEndpoints.GET_NEWS);

      if (response?.data) {
        setNewsData(response.data);
        console.log("News data:", response.data);
      } else {
        console.error("News API error:", error);
      }
    } catch (err) {
      console.error("News fetch failed:", err);
    } finally {
      setLoadingNews(false);
    }
  };
  const newsLine = newsData.map((item) => item.description).join(" | ");
  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#f8fafc",

        py: 2,
        px: { xs: 1, sm: 2, md: 3 },
        width: "100%", // ✅ Ensure full width
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          bgcolor: "#eef2ff",
          py: 1.5,
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          border: "1px solid #c7d2fe",
          position: "relative",
          // mb: 3,
          width: "100%", // ✅ Full width for banner
        }}
      >
        {/* News Section */}
        {loadingNews ? (
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            justifyContent="center"
          >
            <CircularProgress size={20} sx={{ color: "#6366f1" }} />
            <Typography variant="body2" color="text.secondary">
              Loading news...
            </Typography>
          </Box>
        ) : newsData.length > 0 ? (
          <Box
            component="div"
            sx={{
              display: "inline-block",
              whiteSpace: "nowrap",
              fontWeight: 500,
              color: "#1e40af",
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              animation: "scrollNews 20s linear infinite",
              paddingLeft: "100%",
              width: "100%", // ✅ Add this
            }}
          >
            {newsLine}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No news available
          </Typography>
        )}

        <style>
          {`
        @keyframes scrollNews {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}
        </style>
      </Box>

      {/* Transaction + Profit Section */}
      <Box sx={{ justifyContent: "flex-start", display: "flex" }}>
        <TransactionDetail />
      </Box>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" }, // small screen: column, large: row
          gap: 2, // gap between left-right
          width: "100%",
        }}
      >
        {/* Left: ServiceWiseProfit */}
        <Box
          sx={{
            flex: "0 0 70%",
            minWidth: { xs: "100%", md: "70%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ServiceWiseProfit />
        </Box>

        {/* Right: ApiBalance */}
        {!["dd", "ret"].includes(user?.role) && (
          <Box
            sx={{
              flex: "0 0 30%",
              minWidth: { xs: "100%", md: "30%" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ApiBalance />
          </Box>
        )}
      </Box>

      {(user.role === "adm" || user.role === "sadm") && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: { xs: "column", lg: "row" }, // small screen: column, large: row
            gap: 2, // gap between left-right
            width: "100%",
          }}
        >
          {/* Left Column */}
          <Box
            sx={{
              flex: 1, // occupy half width on large screens
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ServiceWiseSummary />
          </Box>

          {/* Right Column */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <RoleWiseUserSummary />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
