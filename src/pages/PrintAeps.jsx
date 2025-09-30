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
import biggpayLogo from "../assets/Images/PPALogo.jpeg";

const PrintAeps = () => {
  const [receiptType, setReceiptType] = useState("large");
  const orientation = "portrait"; // ✅ By default portrait, fixed
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [data, setData] = useState(null);

  // Load transaction data
  useEffect(() => {
    let txnData = location.state?.txnData;
    if (!txnData) {
      const storedData = sessionStorage.getItem("txnData");
      if (storedData) txnData = JSON.parse(storedData);
    }
    if (txnData) {
      setData(txnData);
      sessionStorage.setItem("txnData", JSON.stringify(txnData));
    }
  }, [location.state]);

  if (!data) {
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

  // ✅ Required fields only
  const amount = parseFloat(data.amount || 0);

  const headers = [
    "Date",
    "Txn ID",
    "Aadhaar No",
    "Txn Type",
    "RRN",
    "Status",
    "Amount",
  ];

  const values = [
    data.created_at ? new Date(data.created_at).toLocaleString() : "",
    data.txn_id || "",
    data.aadhaar_number ? `**** **** ${data.aadhaar_number.slice(-4)}` : "",
    data.txn_type || "",
    data.rrn || "",
    data.status || "",
    `₹ ${amount.toFixed(2)}`, // Amount will be styled in red
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
                {user ? user.establishment : "Null"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user ? user.mobile : "Null"}
              </Typography>
            </Box>
          </Box>

          {/* Title */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#2b9bd7" }}>
              AEPS Transaction Receipt
            </Typography>
          </Box>

          {/* Large Table */}
          {receiptType === "large" ? (
            <Box className="table-container" mt={2}>
              <Box className="table-row">
                {headers.map((h, i) => (
                  <Box key={i} className="table-cell header-cell">
                    {h}
                  </Box>
                ))}
              </Box>
              <Box className="table-row">
                {values.map((v, i) => (
                  <Box
                    key={i}
                    className="table-cell"
                    sx={
                      i === values.length - 1
                        ? { color: "red", fontWeight: 600 }
                        : {}
                    }
                  >
                    {v}
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            // Small Receipt
            <Box mt={2} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
              {headers.map((label, i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  sx={{
                    px: 1,
                    py: 1.3,
                    borderBottom:
                      i !== headers.length - 1 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {label}:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={
                      i === values.length - 1
                        ? { color: "red", fontWeight: 600 }
                        : {}
                    }
                  >
                    {values[i]}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Print Button */}
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              onClick={() => window.print()}
              className="no-print"
              variant="contained"
              sx={{
                borderRadius: 2,
                background: "#2b9bd7",
                textTransform: "none",
                px: 4,
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
            <Typography variant="caption">
              © 2025 All Rights Reserved
            </Typography>
            <Typography variant="caption" textAlign="right">
              System-generated receipt. No signature required.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PrintAeps;
