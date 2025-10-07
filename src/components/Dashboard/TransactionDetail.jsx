// Map status to background color
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";

import { Refresh } from "@mui/icons-material";
import AuthContext from "../../contexts/AuthContext";

const statusColors = {
  success: "#2E8B57",
  failed: "#C0392B",
  pending: "#E67E22",
  processing: "#2980B9",
  default: "#37649F",
};

const TransactionDetail = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [bankBalance, setBankBalance] = useState(null);
  const [loadingBank, setLoadingBank] = useState(false);

  // ✅ Fetch Transaction Summary
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

  // ✅ Fetch Bank Balance
  const fetchBankBalance = async () => {
    setLoadingBank(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_BANK_BALANCE
      );
      if (response) {
        setBankBalance(response?.data);
      } else {
        console.error("Bank Balance API error:", error);
      }
    } catch (err) {
      console.error("Bank Balance fetch failed:", err);
    } finally {
      setLoadingBank(false);
    }
  };

  useEffect(() => {
    fetchTxnDetails();
    fetchBankBalance();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  const cardCount = Object.keys(data).length + 1;
  const scaleValue = Math.min(1, 9 / cardCount); // auto shrink factor

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${cardCount}, 1fr)`,
        gap: 2,
        p: 2,
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": { display: "none" }, // Chrome
        justifyItems: "center",
        alignItems: "stretch",
        "& > *": {
          transform: `scale(${scaleValue})`,
          transformOrigin: "top center",
          transition: "transform 0.3s ease",
        },
      }}
    >
      {/* ✅ Transaction Summary Cards */}
      {Object.entries(data).map(([service, values]) => {
        const bgColor =
          statusColors[values?.status?.toLowerCase()] || statusColors.default;

        return (
          <Card
            key={service}
            sx={{
              width: "100%",
              maxWidth: 220,
              minWidth: 180,
              borderRadius: 3,
              backgroundColor: bgColor,
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
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

      {(user.role === "adm" || user.role === "sadm") && (
        <Card
          sx={{
            width: "100%",
            maxWidth: 220,
            minWidth: 180,
            borderRadius: 3,
            background: "linear-gradient(135deg, #4B0082 0%, #6A0DAD 100%)",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            },
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 1,
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>Bank Balance</Typography>
              <IconButton
                size="small"
                onClick={fetchBankBalance}
                disabled={loadingBank}
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
                  width: 25,
                  height: 25,
                }}
              >
                {loadingBank ? (
                  <CircularProgress size={16} sx={{ color: "#fff" }} />
                ) : (
                  <Refresh sx={{ fontSize: 15 }} />
                )}
              </IconButton>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              ₹{bankBalance !== null ? bankBalance : "--"}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TransactionDetail;
