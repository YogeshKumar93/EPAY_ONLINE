import React, { useEffect, useState } from "react";
import { Box, Button, Divider } from "@mui/material";
 

const PrintClaimedReceipt = () => {
  const [row, setRow] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("PRINT_DATA");
    if (stored) setRow(JSON.parse(stored));
  }, []);

  if (!row) return <h2>No Data Found</h2>;

  const handlePrint = () => window.print();

  return (
    <Box
      sx={{
        position: "relative",
        width: "95%",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      

     

     

      {/* HORIZONTAL TABLE */}
      <Box sx={{ marginTop: 3, overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
            fontSize: "14px",
            background: "rgba(255,255,255,0.85)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#dbd3e4ff", color: "#492077" }}>
              {[
                "ID",
                "Bank ID",
                "Txn Date",
                "Mode",
                "UTR",
                "Particulars",
                "Credit",
                "Debit",
                "Balance",
                "Remark",
                "Status",
              ].map((title) => (
                <th key={title} style={thStyle}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              {[
                row.id,
                row.bank_id,
                row.date,
                row.mop,
                row.utr,
                row.particulars,
                row.credit,
                row.debit,
                row.balance,
                row.remark,
                row.status === 0 ? "Unclaimed" : "Claimed",
              ].map((value, index) => (
                <td key={index} style={tdStyle}>
                  {value ? value : "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Box>

      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Button variant="contained" onClick={handlePrint}>
          Print Receipt
        </Button>
      </Box>
    </Box>
  );
};

/* STYLES */
const thStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "center",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "center",
};

export default PrintClaimedReceipt;
