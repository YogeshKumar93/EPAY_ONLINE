import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { ddmmyyWithTime } from "../utils/DateUtils";
import biggpayLogo from "../assets/logo(1).png";

// Number to Words (Indian System)
const numberToWords = (num) => {
  if (num === 0) return "Zero Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const numToWords = (n) => {
    let str = "";
    if (n > 99) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n = n % 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + " " + a[n % 10] + " ";
    } else if (n > 0) {
      str += a[n] + " ";
    }
    return str.trim();
  };

  let result = "";
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const remainder = num % 100;

  if (crore) result += numToWords(crore) + " Crore ";
  if (lakh) result += numToWords(lakh) + " Lakh ";
  if (thousand) result += numToWords(thousand) + " Thousand ";
  if (hundred) result += numToWords(hundred) + " Hundred ";
  if (remainder) result += (result ? "and " : "") + numToWords(remainder) + " ";

  return result.trim() + " Only";
};

const PrintDmt = () => {
  const [receiptType, setReceiptType] = useState("large");
  const [orientation, setOrientation] = useState("portrait"); // portrait / landscape
  const location = useLocation();
  const data = location.state?.txnData;

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error" variant="h6">
          No Transaction Data Available
        </Typography>
      </Box>
    );
  }

  const amountInWords = numberToWords(data.amount);

  const headers = ["Date","UTR","Operator","Sender","Ben Name","Account No","IFSC Code","Amount","Status"];
  const values = [
    ddmmyyWithTime(data.created_at),
    data.txn_id,
    data.operator,
    data.sender_mobile,
    data.beneficiary_name,
    data.account_number,
    data.ifsc_code,
    `₹ ${data.amount}`,
    data.status,
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
        .amount { font-weight: 700; color: #d32f2f; }
        .status-success { font-weight: 700; color: green; }
        .status-failed { font-weight: 700; color: red; }
      `}</style>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", pt: 4 }}>
        {/* Receipt Type & Orientation Toggle */}
        <Box display="flex" justifyContent="center" mb={2} className="no-print">
          <RadioGroup row value={receiptType} onChange={(e) => setReceiptType(e.target.value)}>
            <FormControlLabel value="large" control={<Radio />} label="Large Receipt" />
            <FormControlLabel value="small" control={<Radio />} label="Small Receipt" />
          </RadioGroup>
          <RadioGroup row value={orientation} onChange={(e) => setOrientation(e.target.value)} sx={{ ml: 3 }}>
            <FormControlLabel value="portrait" control={<Radio />} label="Portrait" />
            <FormControlLabel value="landscape" control={<Radio />} label="Landscape" />
          </RadioGroup>
        </Box>

        {/* Receipt Container */}
        <Box className="receipt-container" sx={{
          width: "100%",
          maxWidth: receiptType === "large" ? "xl" : 400,
          border: "2px solid #d6e4ed",
          borderRadius: 2,
          background: "#fff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          fontFamily: "Roboto, sans-serif",
        }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom="2px solid #e0e0e0">
            <Box sx={{ width: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box component="img" src={biggpayLogo} alt="Logo" sx={{ width: 130, height: 60, objectFit: "contain" }} />
            </Box>
            <Box textAlign="right">
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{data.company || "Company Name"}</Typography>
              <Typography variant="body2" color="text.secondary">{data.companyNumber}</Typography>
            </Box>
          </Box>

          {/* Receipt Table & Summary */}
          {receiptType === "large" ? (
            <>
              <Box className="table-container" mt={3}>
                <Box className="table-row">
                  {headers.map((header,i) => <Box key={i} className="table-cell header-cell">{header}</Box>)}
                </Box>
                <Box className="table-row">
                  {values.map((value,i) => {
                    if (i === 7) return <Box key={i} className="table-cell amount">{value}</Box>;
                    if (i === 8) return <Box key={i} className={`table-cell ${data.status?.toLowerCase() === "success" ? "status-success" : "status-failed"}`}>{value}</Box>;
                    return <Box key={i} className="table-cell">{value}</Box>;
                  })}
                </Box>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, fontSize: "0.95rem" }}>
                  Total Amount: ₹ {data.amount}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "#555", fontSize: "0.85rem" }}>
                  Amount in Words: <b>{amountInWords} /-</b>
                </Typography>
              </Box>
            </>
          ) : (
            // Small Receipt
            <Box mt={2} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden" }}>
              {[{ label: "Date", value: ddmmyyWithTime(data.created_at) },
                { label: "Txn ID", value: data.txn_id },
                { label: "Beneficiary", value: data.beneficiary_name },
                { label: "Account No", value: data.account_number },
                { label: "Amount", value: `₹ ${data.amount}`, type: "amount" },
                { label: "Status", value: data.status, type: "status" }].map((item,i) => (
                <Box key={i} display="flex" justifyContent="space-between" sx={{ px: 1, py: 1.3, borderBottom: i !== 5 ? "1px solid #f0f0f0" : "none", bgcolor: i % 2 === 0 ? "#fafafa" : "transparent" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>{item.label}:</Typography>
                  <Typography variant="body2" sx={{
                    fontWeight: item.type ? "bold" : "normal",
                    fontSize: "0.85rem",
                    color: item.type === "amount" ? "#d32f2f" : item.type === "status" && data.status?.toLowerCase() === "success" ? "green" : item.type === "status" ? "red" : "inherit"
                  }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Footer */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
            <Typography variant="caption" color="text.secondary">© 2025 All Rights Reserved</Typography>
            <Button onClick={() => window.print()} className="no-print" variant="contained" sx={{ borderRadius: 2, background: "#2b9bd7", textTransform: "none", px: 4, "&:hover": { background: "#ff9a3c" } }}>
              Print
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PrintDmt;
