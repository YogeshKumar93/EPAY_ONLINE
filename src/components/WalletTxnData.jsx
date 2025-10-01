import React, { useState, useEffect } from "react";
import {
  Drawer,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";

const WalletTxnData = ({ open, onClose, rowId }) => {
  const [loading, setLoading] = useState(false);
  const [txnData, setTxnData] = useState(null);
  const { showToast } = useToast();

const fetchWalletTxnData = async () => {
    if (!rowId) return;
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.WALLET_LEDGER_TXNDATA,
        { txn_id: rowId }
      );
      if (response) {
        setTxnData(response.data);
      } else {
        showToast("Failed to load transaction data", "error");
      }
    } catch (err) {
      showToast(
        "Something went wrong while fetching transaction data",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && rowId) {
      fetchWalletTxnData();
    }
  }, [rowId, open]);

  const rows = txnData
    ? [
        { label: "Amount", value: txnData.amount },
        { label: "Retailer Commission", value: txnData.ret_comm },
        { label: "Distributor Commission", value: txnData.di_comm },
        { label: "Master Distributor Commission", value: txnData.md_comm },
        { label: "Retailer TDS", value: txnData.ret_tds },
        { label: "Distributor TDS", value: txnData.di_tds },
        { label: "Master Distributor TDS", value: txnData.md_tds },
      ]
    : [];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
     ModalProps={{
    keepMounted: true, // Mobile perf ke liye
  }}
  sx={{
    "& .MuiDrawer-paper": {
      width: { xs: "100%", sm: 450 },
      p: 2,
      zIndex: (theme) => theme.zIndex.appBar + 1, // 👈 AppBar ke upar
    },
  }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Transaction Details</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Loader */}
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="70%"
        >
          <CircularProgress />
        </Box>
      )}

      {/* Table */}
      {!loading && txnData && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: "#f5f5f5", width: "50%" }}
                  >
                    {row.label}
                  </TableCell>
                  <TableCell align="right">{row.value ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Drawer>
  );
};

export default WalletTxnData;
