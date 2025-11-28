import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";

const PrintClaimedReceipt = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("PRINT_DATA");
    if (!stored) return;

    const parsed = JSON.parse(stored);

    // Ensure always an array
    setRows(Array.isArray(parsed) ? parsed : [parsed]);
  }, []);

  if (!rows.length) return <h2>No Data Found</h2>;

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
      }}
    >
      {/* TABLE */}
      <Box sx={{ marginTop: 2, overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
            fontSize: "14px",
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
            {rows.map((row, idx) => (
              <tr key={idx}>
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
                ].map((value, i) => (
                  <td key={i} style={tdStyle}>
                    {value ?? "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      {/* PRINT BUTTON */}
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
