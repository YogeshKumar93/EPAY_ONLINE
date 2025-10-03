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
import { ddmmyyWithTime, dateToTime, ddmmyy } from "../utils/DateUtils";

const PrintPayout = () => {
  const [receiptType, setReceiptType] = useState("large");
  const [orientation, setOrientation] = useState("portrait");
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [data, setData] = useState(null);

  useEffect(() => {
    let txnData = location.state?.txnData;
    if (!txnData) {
      const storedData = sessionStorage.getItem("txnData");
      if (storedData) txnData = JSON.parse(storedData);
    } else {
      sessionStorage.setItem("txnData", JSON.stringify(txnData));
    }
    if (txnData) setData(txnData);
  }, [location.state]);

   const totalAmountValue = data
  .filter(txn => txn.status?.toLowerCase() === "success")
  .reduce((acc, txn) => acc + parseFloat(txn.amount || 0), 0);

  if (!data)
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

  // Parse numeric values safely
  const amount = parseFloat(data.amount || 0);
  const charges = parseFloat(data.charges || 0);
  const commission = parseFloat(data.commission || data.comm || 0);
  const gst = parseFloat(data.gst || 0);
  const tds = parseFloat(data.tds || 0);

  // ✅ Include ALL fields shown in PayoutTxn
  const headers = [
    "Date/Time",
    "Updated At",
  
    "Platform",
    "Service",
    "Route",
    "Txn ID",
 
    "Operator Id",
    "Sender Mobile",
    "Beneficiary Name",
    "Account Number",
    "IFSC Code",
    "Bank Name",
    "Purpose",
    "Amount (₹)",
  
    "Status",
  ];

  const values = [
    data.created_at ? ddmmyyWithTime(data.created_at) : "",
    data.updated_at ? `${ddmmyy(data.updated_at)} ${dateToTime(data.updated_at)}` : "",
 
    data.operator || "",
    data.route || "",
    data.txn_id || "",
   
    data.operator || "",
    data.sender_mobile || "",
    data.beneficiary_name || "",
    data.account_number || "",
    data.ifsc_code || "",
    data.bank_name || "",
    data.purpose || "N/A",
    `₹ ${amount.toFixed(2)}`,
  
    data.status || "",
  ];

  return (
    <>
      <style>{`
        @media print {
          @page { size: ${orientation}; margin: 10mm; }
          body * { visibility: hidden; }
          .receipt-container, .receipt-container * { visibility: visible; }
          .receipt-container { position: absolute; left: 0; top: 0; width: 100%; padding: 2; margin: 0; box-shadow: none; }
          .no-print { display: none !important; }
        }
        .table-container { width: 100%; display: table; border-collapse: collapse; }
        .table-row { display: table-row; }
        .table-cell { display: table-cell; border: 1px solid #e0e0e0; padding: 9px 12px; vertical-align: middle; word-break: break-word; font-size: 0.85rem; }
        .header-cell { font-weight: 600; background: #f9fafb; font-size: 0.85rem; }
        .amount-gray { font-weight: 700; color: #555; }
        .amount-red { font-weight: 700; color: #d32f2f; }
      `}</style>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          pt: 4,
        }}
      >
        {/* Receipt Options */}
        <Box display="flex" justifyContent="center" mb={2} className="no-print">
          <RadioGroup
            row
            value={receiptType}
            onChange={(e) => setReceiptType(e.target.value)}
          >
            <FormControlLabel value="large" control={<Radio />} label="Large Receipt" />
            <FormControlLabel value="small" control={<Radio />} label="Small Receipt" />
          </RadioGroup>
          <RadioGroup
            row
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            sx={{ ml: 3 }}
          >
            <FormControlLabel value="portrait" control={<Radio />} label="Portrait" />
          </RadioGroup>
        </Box>

        {/* Receipt Container */}
        <Box
          className="receipt-container"
          sx={{
            width: "100%",
            maxWidth: receiptType === "large" ? "xl" : 400,
            border: "2px solid #d6e4ed",
            borderRadius: 2,
            background: "#fff",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            px: 3,
            py: 3,
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom="2px solid #e0e0e0"
          >
            <Box sx={{ width: 140, display: "flex", justifyContent: "center" }}>
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
              Payout Transaction Summary
            </Button>
          </Box>

          {/* Large Receipt Table */}
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
                    className={`table-cell ${
                      i >= 15 && i <= 19 ? "amount-gray" : i === 20 ? "amount-red" : ""
                    }`}
                  >
                    {v}
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            // Small Receipt
            <Box mt={2} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
              {headers.map((h, i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  sx={{
                    px: 1,
                    py: 1.3,
                    borderBottom: i !== headers.length - 1 ? "1px solid #f0f0f0" : "none",
                    bgcolor: i % 2 === 0 ? "#fafafa" : "transparent",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {h}:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: i >= 15 && i <= 19 ? "bold" : "normal",
                      color: i >= 15 && i <= 19 ? "#555" : i === 20 ? "#d32f2f" : "inherit",
                    }}
                  >
                    {values[i]}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}


 <Box display="flex" justifyContent="flex-end" mt={1} sx={{ pr: 2 }}>
         <Typography variant="body1" sx={{ fontWeight: 700 }}>
           Total Amount: ₹ {totalAmountValue.toFixed(2)}
         </Typography>
       </Box>
          {/* Print Button */}
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button
              onClick={() => {
                window.print();
                sessionStorage.removeItem("txnData");
              }}
              className="no-print"
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
            <Typography variant="caption" fontWeight={500}>
              © 2025 All Rights Reserved
            </Typography>
            <Typography variant="caption">
              This is a system-generated receipt. No signature required.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PrintPayout;
