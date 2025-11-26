import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";

const Print = () => {
  const [row, setRow] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("PRINT_DATA");
    if (stored) setRow(JSON.parse(stored));
  }, []);

  if (!row) return <h2>No Data Found</h2>;

  const handlePrint = () => window.print();

  const grandTotal = row.items?.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  return (
    <Box
      sx={{
        width: "800px",
        margin: "20px auto",
        padding: "25px",
        background: "#fff",
        border: "1px solid #d9d9d9",
        borderRadius: "10px",
        fontFamily: "'Times New Roman', serif",
        boxShadow: "0 0 10px rgba(0,0,0,0.15)",
      }}
    >
      {/* ----------------- TOP HEADER ----------------- */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* LEFT - STORE DETAILS */}
        <Box sx={{ width: "55%" }}>
          <Box sx={{ fontSize: "30px", fontWeight: "bold", color: "#333" }}>
            Shree Radhey General Store
          </Box>

          <Box sx={{ marginTop: "5px", fontSize: "15px", color: "#555" }}>
            Main Bus Stand, Village Mungeshpur <br />
            Phone: 99999 99999 <br />
            GSTIN: _______________________
          </Box>
        </Box>

        {/* RIGHT - INVOICE BOX */}
        <Box
          sx={{
            width: "40%",
            border: "1px solid #999",
            borderRadius: "8px",
            padding: "12px",
            background: "#fafafa",
          }}
        >
          <Box
            sx={{
              fontWeight: "bold",
              fontSize: "18px",
              marginBottom: "10px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            Invoice Details
          </Box>

          <Box sx={{ fontSize: "15px", lineHeight: 1.8 }}>
            <strong>Invoice No:</strong> ____________ <br />
            <strong>Date:</strong> {row.date || "_____________"} <br />
            <strong>Payment Mode:</strong> ____________
          </Box>
        </Box>
      </Box>

      {/* ----------------- CUSTOMER INFO ----------------- */}
      <Box
        sx={{
          marginTop: "20px",
          border: "1px solid #999",
          borderRadius: "8px",
          padding: "12px",
          background: "#fcfcfc",
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            fontSize: "18px",
            marginBottom: "8px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "5px",
          }}
        >
          Bill To
        </Box>

        <Box sx={{ fontSize: "15px", lineHeight: 1.8 }}>
          <strong>Name:</strong> ______________________________ <br />
          <strong>Address:</strong> ____________________________ <br />
          <strong>Mobile:</strong> _____________________________ <br />
          <strong>Email:</strong> ______________________________
        </Box>
      </Box>

      {/* ----------------- ITEMS TABLE ----------------- */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "25px",
          fontSize: "15px",
        }}
      >
        <thead>
          <tr style={{ background: "#eaeaea" }}>
            {["Si. No.", "Particulars", "Qty", "Rate", "Amount"].map((h) => (
              <th key={h} style={thStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {row.items?.map((item, index) => (
            <tr key={index}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{item.item}</td>
              <td style={tdStyle}>{item.qty}</td>
              <td style={tdStyle}>{item.rate}</td>
              <td style={tdStyle}>{item.amount}</td>
            </tr>
          ))}

          <tr>
            <td colSpan={4} style={{ ...tdStyle, textAlign: "right" }}>
              <strong>Sub Total</strong>
            </td>
            <td style={tdStyle}>{grandTotal}</td>
          </tr>

          <tr>
            <td colSpan={4} style={{ ...tdStyle, textAlign: "right" }}>
              <strong>Tax</strong>
            </td>
            <td style={tdStyle}>0</td>
          </tr>

          <tr>
            <td colSpan={4} style={{ ...tdStyle, textAlign: "right" }}>
              <strong>Total</strong>
            </td>
            <td style={{ ...tdStyle, fontWeight: "bold" }}>{grandTotal}</td>
          </tr>
        </tbody>
      </table>

      {/* ----------------- FOOTER ----------------- */}
      <Box
        sx={{
          marginTop: "20px",
          fontSize: "15px",
          padding: "10px",
          borderTop: "1px solid #ddd",
        }}
      >
        <strong>Amount in Words:</strong> __________________________
      </Box>

      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "15px",
        }}
      >
        <Box>Thank you for your business!</Box>
        <Box>Authorized Signature: __________________</Box>
      </Box>

      {/* PRINT BUTTON */}
      <Box sx={{ textAlign: "center", marginTop: 3 }} className="no-print">
        <Button variant="contained" onClick={handlePrint}>
          Print Invoice
        </Button>
      </Box>

      {/* HIDE ON PRINT */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
    </Box>
  );
};

/* Table Styles */
const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
};

export default Print;
