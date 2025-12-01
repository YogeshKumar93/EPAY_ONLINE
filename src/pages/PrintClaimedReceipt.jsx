import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

const PrintClaimedReceipt = () => {
  const [rows, setRows] = useState([]);
  const receiptRef = useRef(null);

  // Download menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const stored = localStorage.getItem("PRINT_DATA");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setRows(Array.isArray(parsed) ? parsed : [parsed]);
  }, []);

  if (!rows.length) return <h2>No Data Found</h2>;

  const handlePrint = () => window.print();

  const totalCredit = rows.reduce((sum, r) => sum + (Number(r.credit) || 0), 0);
  const totalDebit = rows.reduce((sum, r) => sum + (Number(r.debit) || 0), 0);

  const downloadPDF = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("receipt.pdf");
    handleMenuClose();
  };

  const downloadPNG = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element);
    const link = document.createElement("a");
    link.download = "receipt.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    handleMenuClose();
  };

  const downloadExcel = () => {
    const wsData = [
      ["S.No", "Txn Date", "Mode", "Particulars", "Credit", "Debit", "Status"],
      ...rows.map((r, idx) => [
        idx + 1,
        r.date ?? "N/A",
        r.mop ?? "N/A",
        r.particulars ?? "N/A",
        r.credit ?? 0,
        r.debit ?? 0,
        r.status === 0 ? "Unclaimed" : "Claimed",
      ]),
      ["Grand Total", "", "", "", totalCredit, totalDebit, ""],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Receipt");
    XLSX.writeFile(wb, "receipt.xlsx");
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        margin: "20px auto",
        padding: "20px",
        border: "2px solid #ccc",
        borderRadius: "16px",
        background: "#fff",
      }}
    >
      {/* ONLY RECEIPT CONTENT WILL BE PRINTED */}
      <Box sx={{ marginTop: 4, overflowX: "auto" }} ref={receiptRef} className="receipt-content">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "2px solid #aaa",
            fontSize: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#dbd3e4ff", color: "#492077" }}>
              {["S.No", "Txn Date", "Mode", "Particulars", "Credit", "Debit", "Status"].map(
                (title) => (
                  <th key={title} style={thStyle}>
                    {title}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{idx + 1}</td>
                {[row.date, row.mop, row.particulars, row.credit, row.debit, row.status === 0 ? "Unclaimed" : "Claimed"].map(
                  (value, i) => (
                    <td key={i} style={tdStyle}>
                      {value ?? "N/A"}
                    </td>
                  )
                )}
              </tr>
            ))}
            <tr style={{ backgroundColor: "#f0e8ff", fontWeight: "bold" }}>
              <td style={tdStyle} colSpan={4}>
                Grand Total
              </td>
              <td style={tdStyle}>{totalCredit.toFixed(2)}</td>
              <td style={tdStyle}>{totalDebit.toFixed(2)}</td>
              <td style={tdStyle}>--</td>
            </tr>
          </tbody>
        </table>
      </Box>

      {/* BUTTONS - HIDDEN ON PRINT */}
      <Box
        sx={{
          textAlign: "center",
          marginTop: 5,
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
        className="no-print"
      >
        <Button variant="contained" sx={{ fontSize: "14px", padding: "12px 30px" }} onClick={handlePrint}>
          Print Receipt
        </Button>

        <Button variant="contained" sx={{ fontSize: "14px", padding: "12px 30px" }} onClick={handleMenuClick}>
          Download
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={downloadPDF}>PDF</MenuItem>
          <MenuItem onClick={downloadExcel}>Excel</MenuItem>
          <MenuItem onClick={downloadPNG}>PNG</MenuItem>
        </Menu>
      </Box>

      {/* PRINT STYLES */}
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

const thStyle = {
  padding: "16px",
  border: "2px solid #ddd",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "14px",
};

const tdStyle = {
  padding: "16px",
  border: "2px solid #ddd",
  textAlign: "center",
  fontSize: "14px",
};

export default PrintClaimedReceipt;
