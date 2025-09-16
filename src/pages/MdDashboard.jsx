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
} from "@mui/material";
 import nodata from "../assets/animate-icons/check.json";

const services = ["Prepaid", "Utility", "Money Transfer", "Nepal Transfer", "Payments"];

const MdDashboard = () => {
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

  const stats = [
    { title: "TOTAL", color: "#f05353ff" },
    { title: "SUCCESS", color: "#9bc4c9ff" },
    { title: "PENDING", color: "#e5dcb4ff" },
    { title: "FAILED", color: "#e4a3adff" },
    { title: " ", color: "#f6eff0ff" },
  ];

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
          🚀 Welcome to your Dashboard! | UPI Service is working Fine | New updates available | Keep
          track of your transactions here...
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
          {/* Transaction Summary */}
          <Typography variant="h6" mb={2} sx={{ color: "blueviolet" }}>
            Transaction Summary
          </Typography>

          {/* Status Cards */}
          <Grid container spacing={3} sx={{ mb: 3, alignItems: "stretch" }}>
            {stats.map((status, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    height: 180,
                    width: 220,
                    backgroundColor: status.color,
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden",
                   

                    backgroundRepeat: "repeat",
                    backgroundSize: "auto",

                    backgroundSize: "cover",
                    backgroundBlendMode: "multiply",
                  }}
                >
                    <svg
    viewBox="0 0 600 300"
    preserveAspectRatio="none"
    style={{
      position: "absolute",
      top: 12,
      left: 0,
      width: "100%",
      height: "100%",
    }}
  >
    <path
      d="M0,150 C150,100 450,200 600,150 L600,300 L0,300 Z"
      fill="none"
      stroke="#4a90e2"
      strokeWidth="2"
    />
  </svg>
                  {status.title.trim() === "" ? (
                    // 🔹 Show Period Buttons
                    <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                      {["TODAY", "THIS", "LAST"].map((p) => (
                        <Button
                          key={p}
                          size="small"
                          variant={period === p ? "contained" : "outlined"}
                          onClick={() => handlePeriodChange(p)}
                          sx={{ m: 0.5 }}
                        >
                          {p}
                        </Button>
                      ))}
                    </Box>
                  ) : (
                    // 🔹 Default Stat Card
                    <Box sx={{ position: "relative", zIndex: 2 }}>
                      <Typography fontWeight={600} variant="subtitle1">
                        {status.title}
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        ₹ {Math.floor(Math.random() * 5000)}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 14, fontWeight: 600, color: "green", mt: 1 }}
                      >
                        +{Math.floor(Math.random() * 10)}% ↑
                      </Typography>
                    </Box>
                  )}

                  {/* Overlay Gradient */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.4), transparent)",
                      borderRadius: "16px",
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Product Sales Section */}
          <Typography variant="h6" mb={2}>
            Product Sales
          </Typography>

          {/* Period Selector */}
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

          {/* Product Sales Table */}
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

         {/* 🔹 Account Overview Section */}
<Typography variant="h6" mb={2}>
  Account Overview
</Typography>
<Grid container spacing={3}>
  {/* Wrap both cards in a single container */}
  <Grid item xs={12} container spacing={3}>
    {/* Left Card: My Earnings */}
   <Grid item xs={12} md={6}>
  <Paper
    elevation={3}
    sx={{
      p: 3,
      height: "300px",
      width: "600px",
      borderRadius: "16px",
      backgroundColor: "#fce4ec", // light pink
      color: "#880e4f",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      
    }}
  >
    <Box>
      <Typography variant="h6" fontWeight={600}>
        My Earnings
      </Typography>
      <Typography variant="h4" fontWeight={700} mt={1}>
        ₹ {Math.floor(Math.random() * 5000)}
      </Typography>
    </Box>

    {/* Image in the middle */}
    <Box sx={{ mt: 2, mb: 2, ml:25, alignItems:"center" }}>
      <img
        src= {nodata}
        alt="Earnings"
        style={{ width: "100px", height: "100px", objectFit: "contain" }}
      />
    </Box>

    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
      <Button size="small" variant="contained" sx={{ bgcolor: "#f8bbd0", color: "#880e4f" }}>
        Withdraw
      </Button>
    </Box>
  </Paper>
</Grid>


    {/* Right Card: Spending Limit */}
    <Grid item xs={12} md={6}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "300px",
          width:"600px",
          borderRadius: "16px",
          backgroundColor: "#e1f5fe", // light blue
          color: "#0277bd",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Spending Limit
          </Typography>
          <Typography variant="body1" fontWeight={500} mt={1}>
            ₹ {Math.floor(Math.random() * 300)} of ₹ 1,2000
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.floor(Math.random() * 100)}
            sx={{
              height: 10,
              borderRadius: "5px",
              mt: 1,
              backgroundColor: "rgba(255,255,255,0.5)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#0277bd",
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button size="small" variant="contained" sx={{ bgcolor: "#b3e5fc", color: "#0277bd" }}>
            View Report
          </Button>
        </Box>
      </Paper>
    </Grid>
  </Grid>
</Grid>



        </Paper>
      </Box>
    </>
  );
};

export default MdDashboard;
