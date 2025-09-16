// Dashboard.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
} from "@mui/material";

const services = ["Prepaid", "Utility", "Money Transfer", "Nepal Transfer", "Payments"];

const MD_Dashboard = () => {
  const [period, setPeriod] = useState("TODAY");

  // Mock data for each period
  const dataByPeriod = {
    TODAY: services.map((s) => ({
      service: s,
      lastMonth: 0,
      thisMonth: 0,
      today: Math.floor(Math.random() * 1000),
      achieved: Math.floor(Math.random() * 100),
    })),
    THIS: services.map((s) => ({
      service: s,
      lastMonth: 0,
      thisMonth: Math.floor(Math.random() * 1000),
      today: 0,
      achieved: Math.floor(Math.random() * 100),
    })),
    LAST: services.map((s) => ({
      service: s,
      lastMonth: Math.floor(Math.random() * 1000),
      thisMonth: 0,
      today: 0,
      achieved: Math.floor(Math.random() * 100),
    })),
  };

  const handlePeriodChange = (p) => setPeriod(p);
  const productSales = dataByPeriod[period];

  return (
 <>
  {/* 🔹 Scrolling Marquee */}
  <Box
    sx={{
      backgroundColor: "#1976d2",
      color: "white",
      py: 1,
      mb: 1,
      borderRadius: "8px",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <Typography
      component="div"
      sx={{
        whiteSpace: "nowrap",
        display: "inline-block",
        px: 2,
        animation: "scrollText 15s linear infinite",
        fontWeight: 600,
      }}
    >
      🚀 Welcome to your Dashboard! | UPI Service is working Fine | New updates available | Keep track of
      your transactions here...
    </Typography>
    <style>
      {`
        @keyframes scrollText {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}
    </style>
  </Box>

  {/* 🔹 Full Width Container */}
  <Box
    sx={{
      minHeight: "100vh",
      backgroundColor: "#f4f7fb",
      p: 0,
    }}
  >
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: "12px",
        backgroundColor: "#fff",
      }}
    >   

      {/* Status Boxes */}
      <Typography variant="h6" mb={2} sx={{color:"blueviolet"}}>
        Transaction Summary
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: "TOTAL", color: "#fff8e7" },
          { title: "SUCCESS", color: "#e8f7f9" },
          { title: "PENDING", color: "#fffbea" },
          { title: "FAILED", color: "#fde8eb" },
        ].map((status) => (
          <Grid item xs={12} sm={6} md={3} key={status.title}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                backgroundColor: status.color,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: "12px",
              }}
            >
              <Typography fontWeight={600}>{status.title}</Typography>
              <Typography variant="h5" fontWeight={700}>
                ₹ {Math.floor(Math.random() * 5000)}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: "green" }}>
                +{Math.floor(Math.random() * 10)}% ↑
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Period Selection */}
      <Typography variant="h6" mb={2}>
        Product Sales
      </Typography>
      <Box sx={{ mb: 2 }}>
        {["TODAY", "THIS", "LAST"].map((p) => (
          <Button
            key={p}
            variant={period === p ? "contained" : "outlined"}
            color="primary"
            onClick={() => handlePeriodChange(p)}
            sx={{ mr: 1 }}
          >
            {p}
          </Button>
        ))}
      </Box>

      {/* Product Sale Table */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: "12px" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f9fafb" }}>
              <TableRow>
                <TableCell>Services</TableCell>
                <TableCell>Last Month</TableCell>
                <TableCell>This Month</TableCell>
                <TableCell>Today</TableCell>
                <TableCell>Achieved (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productSales.map((row) => (
                <TableRow key={row.service}>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>₹ {row.lastMonth}</TableCell>
                  <TableCell>₹ {row.thisMonth}</TableCell>
                  <TableCell>₹ {row.today}</TableCell>
                  <TableCell sx={{ width: 200 }}>
                    <LinearProgress
                      variant="determinate"
                      value={row.achieved}
                      sx={{ height: 8, borderRadius: "5px" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Account Overview */}
      <Typography variant="h6" mb={2}>
        Account Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={2}
            sx={{ p: 3, height: "100%", borderRadius: "12px", background: "#fefefe" }}
          >
            <Typography variant="h6" fontWeight={600}>
              My Earnings
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              ₹ {Math.floor(Math.random() * 5000)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={2}
            sx={{ p: 3, height: "100%", borderRadius: "12px", background: "#fefefe" }}
          >
            <Typography variant="h6" fontWeight={600}>
              Spending Limit
            </Typography>
            <Typography variant="body1" fontWeight={500} mb={1}>
              ₹ {Math.floor(Math.random() * 500)} of ₹ 1,200
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.floor(Math.random() * 100)}
              sx={{ height: 10, borderRadius: "5px" }}
            />
            <Button size="small" sx={{ mt: 2 }} variant="outlined">
              View Report
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  </Box>
</>

  );
};

export default MD_Dashboard;
