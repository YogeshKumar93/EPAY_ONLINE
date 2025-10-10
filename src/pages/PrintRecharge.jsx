import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import biggpayLogo from "../assets/Images/PPALogor.png";
import { ddmmyyWithTime } from "../utils/DateUtils";

const PrintRecharge = () => {
  const [receiptType, setReceiptType] = useState("large");
  const [orientation] = useState("portrait");
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [data, setData] = useState([]);

  // Calculate total only for successful transactions
  const totalAmountValue = data
    .filter((txn) => txn.status?.toLowerCase() === "success")
    .reduce((acc, txn) => acc + parseFloat(txn.amount || 0), 0);

  // Load transaction data
  useEffect(() => {
    let txnData = location.state?.txnData;

    if (!txnData) {
      const storedData = sessionStorage.getItem("txnData");
      if (storedData) txnData = JSON.parse(storedData);
    }

    if (txnData) {
      setData(Array.isArray(txnData) ? txnData : [txnData]);
    }
  }, [location.state]);

  if (!data || data.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error" variant="h6">
          No Transaction Data Available
        </Typography>
      </Box>
    );
  }

  const headers = [
    "Date",
    "Txn ID",
    "Mobile",
    "Operator",
    "Ref No",
    "Status",
    "Amount",
  ];

  return (
    <>
      <style>{`
        @media print {
          @page { size: ${orientation}; margin: 10mm; }
          body * { visibility: hidden; }
          .receipt-container, .receipt-container * { visibility: visible; }
          .receipt-container { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; }
          .no-print { display: none !important; }
        }
        .table-container { width: 100%; display: table; border-collapse: collapse; }
        .table-row { display: table-row; }
        .table-cell { display: table-cell; border: 1px solid #e0e0e0; padding: 9px 12px; vertical-align: middle; font-size: 0.85rem; }
        .header-cell { font-weight: 600; background: #f9fafb; font-size: 0.85rem; }
        .amount-red { font-weight: 700; color: #d32f2f; }
      `}</style>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100vh"
        pt={4}
      >
        {/* Controls */}
        <Box display="flex" justifyContent="center" mb={2} className="no-print">
          <RadioGroup
            row
            value={receiptType}
            onChange={(e) => setReceiptType(e.target.value)}
          >
            <FormControlLabel
              value="large"
              control={<Radio />}
              label="Large Receipt"
            />
            <FormControlLabel
              value="small"
              control={<Radio />}
              label="Small Receipt"
            />
          </RadioGroup>
        </Box>

        {/* Receipt */}
        <Box
          className="receipt-container"
          sx={{
            width: "100%",
            maxWidth: receiptType === "large" ? "xl" : 400,
            border: "2px solid #d6e4ed",
            borderRadius: 2,
            background: "#fff",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 3 },
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom="2px solid #e0e0e0"
            pb={1}
          >
            <Box
              sx={{
                width: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={biggpayLogo}
                alt="Logo"
                sx={{ width: 130, height: 60, objectFit: "contain" }}
              />
            </Box>
            <Box textAlign="right">
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.establishment || "Null"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.mobile || "Null"}
              </Typography>
            </Box>
          </Box>

          {/* Title */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="h6"
              sx={{
                borderRadius: 2,
                border: "2px solid #2b9bd7",
                color: "#000",
                textTransform: "none",
                px: 3,
                "&:hover": { borderColor: "#ff9a3c", color: "#ff9a3c" },
              }}
            >
              Transaction Summary
            </Button>
          </Box>

          {/* Table */}
          {receiptType === "large" ? (
            <Box className="table-container" mt={2}>
              <Box className="table-row">
                {headers.map((h, i) => (
                  <Box key={i} className="table-cell header-cell">
                    {h}
                  </Box>
                ))}
              </Box>
              {data.map((txn, idx) => {
                const values = [
                  txn.created_at ? ddmmyyWithTime(txn.created_at) : "",
                  txn.txn_id || "",
                  txn.number || "",
                  txn.operator || "",
                  txn.client_ref || "",
                  txn.status || "",
                  `₹ ${parseFloat(txn.amount || 0).toFixed(2)}`,
                ];

                return (
                  <Box key={idx} className="table-row">
                    {values.map((v, i) => (
                      <Box
                        key={i}
                        className={`table-cell ${
                          i === values.length - 1 ? "amount-red" : ""
                        }`}
                      >
                        {v}
                      </Box>
                    ))}
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box mt={2} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
              {data.map((txn, idx) => {
                const values = [
                  txn.created_at ? ddmmyyWithTime(txn.created_at) : "",
                  txn.txn_id || "",
                  txn.number || "",
                  txn.operator || "",
                  txn.client_ref || "",
                  txn.status || "",
                  `₹ ${parseFloat(txn.amount || 0).toFixed(2)}`,
                ];

                return (
                  <Box
                    key={idx}
                    sx={{
                      mb: 2,
                      borderBottom:
                        idx !== data.length - 1 ? "1px solid #f0f0f0" : "none",
                    }}
                  >
                    {headers.map((label, i) => (
                      <Box
                        key={i}
                        display="flex"
                        justifyContent="space-between"
                        sx={{ px: 1, py: 1.3 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {label}:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={
                            i === headers.length - 1
                              ? { color: "#d32f2f", fontWeight: 600 }
                              : {}
                          }
                        >
                          {values[i]}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                );
              })}
            </Box>
          )}

          <Box display="flex" justifyContent="flex-end" mt={1} sx={{ pr: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Total Amount: ₹ {totalAmountValue.toFixed(2)}
            </Typography>
          </Box>

          {/* Print Button */}
          <Box
            display="flex"
            justifyContent="flex-end"
            mt={2}
            className="no-print"
          >
            <Button
              onClick={() => window.print()}
              variant="contained"
              sx={{
                borderRadius: 2,
                background: "#2b9bd7",
                textTransform: "none",
                px: 4,
                "&:hover": { background: "#ff9a3c" },
              }}
            >
              Print
            </Button>
          </Box>

          {/* Footer */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={3}
          >
            <Typography variant="caption" fontWeight={500}>
              © 2025 All Rights Reserved
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", textAlign: "right" }}
            >
              System-generated receipt. No signature required.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PrintRecharge;
