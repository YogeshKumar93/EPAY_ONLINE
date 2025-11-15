import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { Logo } from "../iconsImports";

const SolitechReceipt = ({ payoutResponse, onRepeat, onNewTxn, sender }) => {
  if (!payoutResponse) return null;
  console.log("payoput response ", payoutResponse);

  const fields = [
    ["Sender Mobile", payoutResponse?.mobile_number || "N/A"],
    ["Sender Name", sender?.sender_name || "N/A"],
    ["Beneficiary Name", payoutResponse?.beneficiary_name || "N/A"],
    ["Account Number", payoutResponse?.account_number || "N/A"],
    ["Amount", `₹${payoutResponse?.amount || "N/A"}`],
    ["Transfer Mode", payoutResponse?.mop || "N/A"],
    ["Purpose", payoutResponse?.purpose || "N/A"],
    ["UTR", payoutResponse?.operator_id || "N/A"],
  ];
  const currentTime = new Date().toLocaleTimeString();

  const handlePrint = () => {
    const printWin = window.open("", "_blank");

    const transactionDate = payoutResponse?.response?.data?.transactionDate
      ? new Date(payoutResponse.response.data.transactionDate)
      : new Date();

    const formattedDate = `${transactionDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${(transactionDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${transactionDate.getFullYear()} ${transactionDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${transactionDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${transactionDate
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const fields = [
      "Sender Mobile",
      "Sender Name",
      "Beneficiary Name",
      "Account Number",
      "Amount",
      "Transfer Mode",
      "Purpose",
      "UTR",
    ];

    const values = [
      payoutResponse?.mobile_number || "---",
      sender?.sender_name || "---",
      payoutResponse?.beneficiary_name || "---",
      payoutResponse?.account_number || "---",
      `₹${payoutResponse?.amount || 0}`,
      payoutResponse?.mop || "---",
      payoutResponse?.purpose || "N/A",
      payoutResponse?.operator_id || "---",
    ];

    const html = `
    <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial; padding: 20px; color: #333; }
          .logo { text-align: center; margin-bottom: 10px; }
          .logo img { height: 40px; }
          h2 { text-align: center; color: #1976d2; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: center; }
          th { background: #f0f4ff; font-weight: bold; }
          .status { text-align: center; font-weight: bold; margin: 15px 0; color: ${
            payoutResponse?.response?.status === "FAILED" ? "red" : "green"
          }; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #666; }
          @media print {
            body { padding: 10px; }
            table { font-size: 11px; }
            th, td { padding: 6px 8px; }
          }
        </style>
      </head>
      <body>
        <div class="logo">
          <img src="${Logo}" alt="Logo" />
        </div>
        <h2>Payment Receipt</h2>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <div class="status">
          Status: ${
            payoutResponse?.response?.status === "FAILED" ? "FAILED" : "SUCCESS"
          } | ${payoutResponse?.response?.message || "Transaction Successful"}
        </div>
        <table>
          <thead>
            <tr>
              ${fields.map((f) => `<th>${f}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${values.map((v) => `<td>${v}</td>`).join("")}
            </tr>
          </tbody>
        </table>
        <div class="footer">
          <p>© 2025 All Rights Reserved</p>
          <p>This is a system-generated receipt. No signature required.</p>
        </div>
      </body>
    </html>
  `;

    printWin.document.write(html);
    printWin.document.close();
    printWin.print();
  };

  return (
    <Box
      p={1}
      bgcolor="#f9faff"
      borderRadius={2}
      boxShadow={2}
      maxWidth={900}
      mx="auto"
      id="receiptContent"
    >
      {/* Logo */}
      <Box textAlign="center" mb={1}>
        <img src={Logo} alt="Logo" style={{ height: 40 }} />
      </Box>

      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary.main"
            sx={{ lineHeight: 1.2 }}
          >
            Payment Receipt
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1 }}
          >
            Date: {new Date().toLocaleDateString()}
            {currentTime}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color:
              payoutResponse?.response?.status === "FAILED" ? "red" : "green",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {payoutResponse?.response?.message || "Transaction Successful"}
        </Typography>
      </Box>

      {/* Table */}
      <Paper
        variant="outlined"
        sx={{ borderRadius: 1.5, overflowX: "auto", background: "#fff" }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontFamily: "Arial, sans-serif",
            fontSize: "0.875rem",
          }}
        >
          <thead
            style={{ background: "#f0f4ff", borderBottom: "1px solid #ccc" }}
          >
            <tr>
              <th style={{ padding: "8px 12px", width: "30%" }}>Field</th>
              <th style={{ padding: "8px 12px", width: "70%" }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {fields.map(([label, value], index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <td
                  style={{
                    padding: "8px 12px",
                    fontWeight: "bold",
                    color: "#555",
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {label}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    color: "#222",
                    wordBreak: "break-word",
                  }}
                >
                  {value || "---"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>

      {/* Buttons */}
      <Box mt={2} display="flex" justifyContent="center" gap={1}>
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={onNewTxn}
        >
          New Txn
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onRepeat}
        >
          Repeat Txn
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={handlePrint}
        >
          Print Receipt
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: "block", textAlign: "center" }}
        >
          This is a system-generated receipt. No signature required.
        </Typography>
      </Box>
    </Box>
  );
};

export default SolitechReceipt;
