import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  TablePagination,
  Chip,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  Download,
  Print,
  AccountBalance,
  PictureAsPdf,
  Email,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const EnhancedBankStatementDesign = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const statementRef = useRef();

  const bankStatement = location.state?.bankStatement || [];
  console.log("THe bank staem is ", bankStatement);
  const accountInfo = location.state?.accountInfo || {
    accountNumber: "XXXXXX123456",
    accountHolder: "John Doe",
    branch: "Main Branch",
    ifscCode: "SBIN0000123",
    period: "01 Dec 2023 - 31 Dec 2023",
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [filterType, setFilterType] = useState("ALL"); // ALL, CREDIT, DEBIT

  // Enhanced calculations with error handling
  const credits = bankStatement.filter((txn) => txn.txnType === "C");
  const debits = bankStatement.filter((txn) => txn.txnType === "D");

  const totalCredit = credits.reduce(
    (sum, txn) => sum + (parseFloat(txn.amount) || 0),
    0
  );
  const totalDebit = debits.reduce(
    (sum, txn) => sum + (parseFloat(txn.amount) || 0),
    0
  );

  const openingBalance = 25000.0;
  const closingBalance = openingBalance + totalCredit - totalDebit;

  // Filter data based on transaction type
  const filteredData = bankStatement.filter((txn) => {
    if (filterType === "ALL") return true;
    if (filterType === "CREDIT") return txn.txnType === "C";
    if (filterType === "DEBIT") return txn.txnType === "D";
    return true;
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Enhanced PDF Generation
  const generatePDF = async () => {
    const element = statementRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(
      `Bank_Statement_${accountInfo.accountNumber}_${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  // Enhanced print functionality
  const printStatement = () => {
    const originalStyles = document.createElement("style");
    originalStyles.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-section, .print-section * {
          visibility: visible;
        }
        .print-section {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(originalStyles);
    window.print();
    setTimeout(() => {
      document.head.removeChild(originalStyles);
    }, 500);
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      // Handle your specific date format "1:/6:"
      const cleanedDate = dateString.replace(/[^0-9/]/g, "");
      if (cleanedDate) {
        return new Date(cleanedDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const getTransactionType = (type) => {
    return type === "C" ? "CREDIT" : "DEBIT";
  };

  const getTransactionColor = (type) => {
    return type === "C" ? "#2e7d32" : "#c62828";
  };

  const formatAmount = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (bankStatement.length === 0) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            No statement data available
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#1a237e", mb: 3 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <AccountBalance sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Official Bank Statement
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              color="inherit"
              startIcon={<PictureAsPdf />}
              onClick={generatePDF}
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? "PDF" : "Save PDF"}
            </Button>
            <Button
              color="inherit"
              startIcon={<Print />}
              onClick={printStatement}
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? "Print" : "Print"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1400, margin: "0 auto", p: { xs: 1, md: 3 } }}>
        <Paper sx={{ p: 2, mb: 2 }} className="no-print">
          <Grid container spacing={2} alignItems="center">
            <Grid
              item
              xs={12}
              md={6}
              sx={{ textAlign: { xs: "left", md: "right" } }}
            >
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label="All Transactions"
                  clickable
                  color={filterType === "ALL" ? "primary" : "default"}
                  onClick={() => setFilterType("ALL")}
                />
                <Chip
                  label="Credits Only"
                  clickable
                  color={filterType === "CREDIT" ? "primary" : "default"}
                  onClick={() => setFilterType("CREDIT")}
                />
                <Chip
                  label="Debits Only"
                  clickable
                  color={filterType === "DEBIT" ? "primary" : "default"}
                  onClick={() => setFilterType("DEBIT")}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Statement Table */}
        <div ref={statementRef} className="print-section">
          <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#1a237e" }}>
                    {[
                      "Date",
                      "Description",

                      "Type",
                      "Debit (₹)",
                      "Credit (₹)",
                    ].map((header, index) => (
                      <TableCell
                        key={header}
                        align={index >= 3 ? "right" : "left"}
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          borderRight:
                            index < 6 ? "1px solid #ffffff44" : "none",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedData.map((txn, index) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                          "&:hover": { bgcolor: "#f0f7ff" },
                        }}
                      >
                        <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                          <Typography variant="body2" fontWeight="500">
                            {formatDate(txn.date)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                          <Typography variant="body2">
                            {txn.narration || "N/A"}
                          </Typography>
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{ borderRight: "1px solid #e0e0e0" }}
                        >
                          <Chip
                            label={getTransactionType(txn.txnType)}
                            size="small"
                            sx={{
                              bgcolor: getTransactionColor(txn.txnType),
                              color: "white",
                              fontWeight: "bold",
                              minWidth: 80,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderRight: "1px solid #e0e0e0",
                            fontWeight: "bold",
                            color: "#c62828",
                          }}
                        >
                          {txn.txnType === "D" ? formatAmount(txn.amount) : "-"}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderRight: "1px solid #e0e0e0",
                            fontWeight: "bold",
                            color: "#2e7d32",
                          }}
                        >
                          {txn.txnType === "C" ? formatAmount(txn.amount) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 15, 25, 50]}
              sx={{ borderTop: "1px solid #e0e0e0" }}
              className="no-print"
            />
          </Paper>
        </div>
      </Box>
    </Box>
  );
};

export default EnhancedBankStatementDesign;
