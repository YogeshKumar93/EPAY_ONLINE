import React, { useContext, useEffect, useState } from "react";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Card,
  TextField,
  Button,
} from "@mui/material";
import { AccountBalance } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import Spinner from "./Spinner";
// import Spinner from "./common/Spinner";
const ServiceWiseProfit = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [dateRange, setDateRange] = useState({
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
  });
  const [activeFilter, setActiveFilter] = useState("today");
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  // Function to get date ranges
  const getDateRange = (type) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    switch (type) {
      case "today":
        return {
          fromDate: today.toISOString().split("T")[0],
          toDate: today.toISOString().split("T")[0],
        };
      case "thisMonth":
        return {
          fromDate: startOfMonth.toISOString().split("T")[0],
          toDate: today.toISOString().split("T")[0],
        };
      case "lastMonth":
        return {
          fromDate: startOfLastMonth.toISOString().split("T")[0],
          toDate: endOfLastMonth.toISOString().split("T")[0],
        };
      default:
        return {
          fromDate: today.toISOString().split("T")[0],
          toDate: today.toISOString().split("T")[0],
        };
    }
  };

  const fetchProfitDetails = async () => {
    if (!user) return;

    let endpoint = null;

    endpoint = ApiEndpoints.GET_SERVICE_WISE_PROFIT_ADMIN;

    setLoading(true);
    try {
      const payload = {
        from_date: dateRange.fromDate,
        to_date: dateRange.toDate,
      };

      const { error, response } = await apiCall("post", endpoint, payload);

      if (response) {
        setData(response?.data || {});
      } else {
        console.error("Profit API error:", error);
      }
    } catch (err) {
      console.error("Profit fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when component mounts
  useEffect(() => {
    fetchProfitDetails();
  }, [user?.role]);

  // Auto-fetch when date range changes
  useEffect(() => {
    if (dateRange.fromDate && dateRange.toDate) {
      const timer = setTimeout(() => {
        fetchProfitDetails();
      }, 500); // Debounce to avoid too many API calls

      return () => clearTimeout(timer);
    }
  }, [dateRange.fromDate, dateRange.toDate]);

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
    setActiveFilter("custom"); // Set to custom when manually selecting dates
  };

  const handleQuickFilter = (filterType) => {
    const newDateRange = getDateRange(filterType);
    setDateRange(newDateRange);
    setActiveFilter(filterType);
  };

  const handleResetFilter = () => {
    const todayRange = getDateRange("today");
    setDateRange(todayRange);
    setActiveFilter("today");
  };

  const services = data?.services || {};
  const grandTotal = data?.grand_total || {};
  const isAdmin = user?.role === "adm";
  const isMd = user?.role === "md";
  const isDi = user?.role === "di";
  const isRet = user?.role === "ret";

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #f8fbfe 0%, #f0f7ff 100%)",
        border: "1px solid #e1edff",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(34, 117, 183, 0.1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header with Date Filter */}
      <Box
        sx={{
          p: 1.5,
          background: "linear-gradient(135deg, #2275B7, #1a67a8)",
          color: "white",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          gap: 1.5,
        }}
      >
        {/* Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: 1,
            minWidth: { md: "200px" },
          }}
        >
          <AccountBalance sx={{ fontSize: 20 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: "0.95rem" }}
          >
            Profit Summary
          </Typography>
        </Box>

        {/* Quick Filter Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            flexWrap: "wrap",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          {["today", "thisMonth", "lastMonth"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "contained" : "outlined"}
              size="small"
              onClick={() => handleQuickFilter(filter)}
              disabled={loading}
              sx={{
                minWidth: "auto",
                px: 1.5,
                py: 0.5,
                fontSize: "0.7rem",
                fontWeight: 600,
                borderColor: "white",
                color: activeFilter === filter ? "#2275B7" : "white",
                bgcolor: activeFilter === filter ? "white" : "transparent",
                "&:hover": {
                  bgcolor:
                    activeFilter === filter
                      ? "#f8fafc"
                      : "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
                transition: "all 0.2s ease",
              }}
            >
              {filter === "today" && "Today"}
              {filter === "thisMonth" && "This Month"}
              {filter === "lastMonth" && "Last Month"}
            </Button>
          ))}
        </Box>

        {/* Date Range Picker */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: "white",
              fontWeight: 600,
              display: { xs: "none", sm: "block" },
            }}
          >
            Date:
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                color: "white",
                display: { xs: "none", sm: "block" },
              }}
            >
              From
            </Typography>
            <TextField
              type="date"
              size="small"
              value={dateRange.fromDate}
              onChange={(e) =>
                handleDateRangeChange("fromDate", e.target.value)
              }
              disabled={loading}
              sx={{
                "& .MuiInputBase-input": {
                  py: 0.8,
                  fontSize: "0.75rem",
                  color: "#1e293b",
                  bgcolor: "white",
                  borderRadius: 1,
                  "&:disabled": { bgcolor: "grey.100" },
                },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                width: { xs: "120px", sm: "130px" },
                minWidth: "120px",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                color: "white",
                display: { xs: "none", sm: "block" },
              }}
            >
              To
            </Typography>
            <TextField
              type="date"
              size="small"
              value={dateRange.toDate}
              onChange={(e) => handleDateRangeChange("toDate", e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiInputBase-input": {
                  py: 0.8,
                  fontSize: "0.75rem",
                  color: "#1e293b",
                  bgcolor: "white",
                  borderRadius: 1,
                  "&:disabled": { bgcolor: "grey.100" },
                },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                width: { xs: "120px", sm: "130px" },
                minWidth: "120px",
              }}
            />
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={handleResetFilter}
            disabled={loading}
            sx={{
              minWidth: "auto",
              px: 1.5,
              py: 0.5,
              fontSize: "0.7rem",
              fontWeight: 600,
              borderColor: "white",
              color: "white",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
              "&:disabled": {
                borderColor: "grey.400",
                color: "grey.400",
              },
              transition: "all 0.2s ease",
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>

      <TableContainer
        sx={{
          flex: 1,
          maxHeight: 360,
          position: "relative",
          transition: "all 0.3s ease",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {/* Loading Overlay - Only shows spinner in table */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(248, 251, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              backdropFilter: "blur(2px)",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Spinner loading={loading} />
            </Box>
          </Box>
        )}

        <Table
          size="small"
          stickyHeader
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": {
              transition: "all 0.2s ease",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  bgcolor: "#f8fafc",
                  py: 1.2,
                  borderRight: "1px solid #e2e8f0",
                  width: "20%",
                  minWidth: "120px",
                }}
              >
                Service
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  bgcolor: "#f8fafc",
                  py: 1.2,
                  borderRight: "1px solid #e2e8f0",
                  width: "15%",
                  minWidth: "100px",
                }}
              >
                Amount
              </TableCell>

              {/* Admin View - Full breakdown */}
              {isAdmin && (
                <>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "9%",
                      minWidth: "80px",
                    }}
                  >
                    Admin Comm
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "9%",
                      minWidth: "80px",
                    }}
                  >
                    MD Comm
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "9%",
                      minWidth: "80px",
                    }}
                  >
                    MD TDS
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "9%",
                      minWidth: "80px",
                    }}
                  >
                    DI Comm
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "9%",
                      minWidth: "80px",
                    }}
                  >
                    DI TDS
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "9%",
                      minWidth: "80px",
                    }}
                  >
                    Total Comm
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "9%",
                      minWidth: "80px",
                    }}
                  >
                    Total TDS
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "9%",
                      minWidth: "80px",
                    }}
                  >
                    Charges
                  </TableCell>
                </>
              )}

              {/* MD View - Shows only own commission data (no profit/charges) */}
              {isMd && (
                <>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "32.5%",
                      minWidth: "120px",
                    }}
                  >
                    MD Comm
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "32.5%",
                      minWidth: "120px",
                    }}
                  >
                    MD TDS
                  </TableCell>
                </>
              )}

              {/* DI View - Shows only own commission data (no profit/charges) */}
              {isDi && (
                <>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "32.5%",
                      minWidth: "120px",
                    }}
                  >
                    DI Comm
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "32.5%",
                      minWidth: "120px",
                    }}
                  >
                    DI TDS
                  </TableCell>
                </>
              )}

              {/* Retailer View - Detailed view with total commission and TDS */}
              {isRet && (
                <>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "16%",
                      minWidth: "100px",
                    }}
                  >
                    Total Comm
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "16%",
                      minWidth: "100px",
                    }}
                  >
                    Total TDS
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#f8fafc",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                      width: "16%",
                      minWidth: "100px",
                    }}
                  >
                    Charges
                  </TableCell>
                </>
              )}

              {/* Profit Column - Only show for Admin and Retailer */}
              {(isAdmin || isRet) && (
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    bgcolor: "#f8fafc",
                    py: 1.2,
                    width: "13%",
                    minWidth: "90px",
                  }}
                >
                  Profit
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {Object?.keys(services)?.length === 0 && !loading ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 11 : isMd ? 4 : isDi ? 4 : isRet ? 6 : 5}
                  sx={{
                    py: 4,
                    textAlign: "center",
                    bgcolor: "#ffffff",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        fontSize: "0.8rem",
                        mb: 1,
                      }}
                    >
                      📊
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                      }}
                    >
                      No data found for the selected period
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {Object.entries(services)?.map(([service, values], index) => (
                  <TableRow
                    key={service}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f8fbff",
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 4px rgba(34, 117, 183, 0.1)",
                        transition: "all 0.2s ease",
                      },
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafcff",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        py: 1.2,
                        fontSize: "0.75rem",
                        color: "#1e293b",
                        borderRight: "1px solid #f1f5f9",
                      }}
                    >
                      {service.toUpperCase()}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        py: 1.2,
                        fontSize: "0.75rem",
                        borderRight: "1px solid #f1f5f9",
                        fontWeight: 500,
                      }}
                    >
                      ₹{(values.total_amount || 0).toFixed(2)}
                    </TableCell>

                    {/* Admin View Data */}
                    {isAdmin && (
                      <>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.a_comm || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.md_comm || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.md_tds || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.di_comm || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.di_tds || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.total_comm || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.total_tds || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.total_charges || 0).toFixed(2)}
                        </TableCell>
                      </>
                    )}

                    {/* MD View Data - Only show own commission data (no profit/charges) */}
                    {isMd && (
                      <>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.md_comm || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.md_tds || 0).toFixed(2)}
                        </TableCell>
                      </>
                    )}

                    {/* DI View Data - Only show own commission data (no profit/charges) */}
                    {isDi && (
                      <>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.di_comm || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.di_tds || 0).toFixed(2)}
                        </TableCell>
                      </>
                    )}

                    {/* Retailer View Data - Show total commission, TDS and charges */}
                    {isRet && (
                      <>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.total_comm || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.total_tds || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2,
                            fontSize: "0.75rem",
                            borderRight: "1px solid #f1f5f9",
                            fontWeight: 500,
                          }}
                        >
                          ₹{(values.total_charges || 0).toFixed(2)}
                        </TableCell>
                      </>
                    )}

                    {/* Profit Column - Only show for Admin and Retailer */}
                    {(isAdmin || isRet) && (
                      <TableCell
                        align="right"
                        sx={{
                          py: 1.2,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color:
                            (values.profit || 0) >= 0 ? "#16a34a" : "#dc2626",
                        }}
                      >
                        ₹{(values.profit || 0).toFixed(2)}
                      </TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Grand Total Row */}
                <TableRow
                  sx={{
                    backgroundColor: "#e8f2ff",
                    "&:hover": {
                      backgroundColor: "#e1edff",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                    }}
                  >
                    TOTAL
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      py: 1.2,
                      borderRight: "1px solid #e2e8f0",
                    }}
                  >
                    ₹{(grandTotal.total_amount || 0).toFixed(2)}
                  </TableCell>

                  {/* Grand Total - Admin View */}
                  {isAdmin && (
                    <>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.a_comm || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.md_comm || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.md_tds || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.di_comm || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.di_tds || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.total_comm || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.total_tds || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.total_charges || 0).toFixed(2)}
                      </TableCell>
                    </>
                  )}

                  {/* Grand Total - MD View */}
                  {isMd && (
                    <>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.md_comm || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.md_tds || 0).toFixed(2)}
                      </TableCell>
                    </>
                  )}

                  {/* Grand Total - DI View */}
                  {isDi && (
                    <>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.di_comm || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.di_tds || 0).toFixed(2)}
                      </TableCell>
                    </>
                  )}

                  {/* Grand Total - Retailer View */}
                  {isRet && (
                    <>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.total_comm || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.total_tds || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          py: 1.2,
                          borderRight: "1px solid #e2e8f0",
                        }}
                      >
                        ₹{(grandTotal.total_charges || 0).toFixed(2)}
                      </TableCell>
                    </>
                  )}

                  {/* Profit Column - Only show for Admin and Retailer */}
                  {(isAdmin || isRet) && (
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        py: 1.2,
                        color:
                          (grandTotal.profit || 0) >= 0 ? "#15803d" : "#b91c1c",
                      }}
                    >
                      ₹{(grandTotal.profit || 0).toFixed(2)}
                    </TableCell>
                  )}
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ServiceWiseProfit;
