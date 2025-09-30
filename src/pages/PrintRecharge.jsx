import React, { useState, useEffect } from "react";
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

const PrintRecharge = () => {
  const [receiptType, setReceiptType] = useState("large");
  const [orientation, setOrientation] = useState("portrait");
  const location = useLocation();

  // ✅ Get data from navigation or sessionStorage
  let txnData = location.state?.txnData;
  if (!txnData) {
    txnData = JSON.parse(sessionStorage.getItem("txnData"));
  } else {
    sessionStorage.setItem("txnData", JSON.stringify(txnData));
  }

  // ✅ Only RechargeTxn fields
  const headers = [
    "Transaction ID",
    "Operator",
    "Mobile Number",
    "Amount",
    "Status",
    "Date",
  ];

  const values = [
    txnData?.txn_id || "-",
    txnData?.operator || "-",
    txnData?.mobile_number || "-",
    txnData?.amount || "-",
    txnData?.status || "-",
    txnData?.created_at || "-",
  ];

  return (
    <Box sx={{ p: 2 }}>
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
            }
            @page { size: ${orientation}; }
          }
        `}
      </style>

      {/* Logo */}
      <Box textAlign="center" mb={2}>
        <img src={biggpayLogo} alt="Logo" style={{ maxWidth: "150px" }} />
      </Box>

      {/* Heading */}
      <Typography variant="h6" align="center" gutterBottom>
        Recharge Transaction Receipt
      </Typography>

      {/* Large Layout (Table Style) */}
      {receiptType === "large" && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "left",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {values.map((val, idx) => (
                <td
                  key={idx}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
                >
                  {val}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}

      {/* Small Layout (Key/Value Style) */}
      {receiptType === "small" && (
        <Box mt={2}>
          {headers.map((header, idx) => (
            <Box key={idx} display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1" fontWeight="bold">
                {header}:
              </Typography>
              <Typography variant="body1">{values[idx]}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Controls */}
      <Box mt={3} textAlign="center">
        <Typography variant="subtitle1" gutterBottom>
          Choose Receipt Layout:
        </Typography>
        <RadioGroup
          row
          value={receiptType}
          onChange={(e) => setReceiptType(e.target.value)}
          style={{ justifyContent: "center" }}
        >
          <FormControlLabel value="large" control={<Radio />} label="Large" />
          <FormControlLabel value="small" control={<Radio />} label="Small" />
        </RadioGroup>

        <Typography variant="subtitle1" gutterBottom>
          Choose Orientation:
        </Typography>
        <RadioGroup
          row
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
          style={{ justifyContent: "center" }}
        >
          <FormControlLabel
            value="portrait"
            control={<Radio />}
            label="Portrait"
          />
          <FormControlLabel
            value="landscape"
            control={<Radio />}
            label="Landscape"
          />
        </RadioGroup>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.print();
            sessionStorage.removeItem("txnData");
          }}
          style={{ marginTop: "20px" }}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default PrintRecharge;
