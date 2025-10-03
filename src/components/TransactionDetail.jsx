import React, { useEffect, useState } from "react";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

// Map status to background color
const statusColors = {
  success: "#4CAF50", // green
  pending: "#FFC107", // yellow
  failed: "#F44336",  // red
  total:"#4B0082"
};

const TransactionDetail = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const fetchTxnDetails = async () => {
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_TXN_SUMMARY
      );

      if (response) {
        setData(response?.data || {});
      } else {
        console.error("Txn Summary API error:", error);
      }
    } catch (err) {
      console.error("Txn Summary fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTxnDetails();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 2,
        p: 2,
        fontFamily: "'Roboto', sans-serif",
        "&::-webkit-scrollbar": { display: "none" },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      {Object.entries(data).map(([service, values], index) => {
        const bgColor = statusColors[values?.status?.toLowerCase()] || "#37649F";

        return (
          <Card
            key={service}
            sx={{
              minWidth: 220,
              flexShrink: 0,
              borderRadius: 3,
              backgroundColor: bgColor,
              color: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, fontFamily: "'Roboto', sans-serif" }}
              >
                {values?.status?.toUpperCase()}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Total Txns: {values.total_txns}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Total Amount: ₹{values.total_amount}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default TransactionDetail;
