
import React from "react";
import {
  useMemo,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  TablePagination,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Cached as CachedIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  LockOpen,
} from "@mui/icons-material";
import { Edit } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import CreateServiceModal from "../components/CreateServiceModal";
import EditServiceModal from "../components/EditServiceModaL";
import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";

import BlockUnblockService from "./BlockUnblockService";
import { apiCall } from "../api/apiClient";
const Services = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [openMpinModal, setOpenMpinModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionTarget, setActionTarget] = useState(null);

  // New states for standalone table
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleLockUnlockClick = (service, action, type) => {
    setSelectedService(service);
    setActionType(action);
    setActionTarget(type);
    setOpenMpinModal(true);
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: apiError, response } = await apiCall(
        "POST",
        ApiEndpoints.GET_SERVICES,
        null,
        { ...query, page: page + 1, paginate: rowsPerPage },
        false
      );

      if (apiError) {
        setError(apiError.message || "Failed to fetch data");
      } else {
        const normalizedData =
          response?.data?.data || response?.data || response || [];
        setData(
          Array.isArray(normalizedData) ? normalizedData : [normalizedData]
        );
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [query, page, rowsPerPage]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter(
      (service) =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.route?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const columns = useMemo(
    () => [
      {
        name: "User Id",
        selector: (row) => (
          <Tooltip title={row?.id}>
            <div style={{ textAlign: "left" }}>{row?.id}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Service Name",
        selector: (row) => (
          <Tooltip title={row?.name}>
            <div style={{ textAlign: "left" }}>{row?.name}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Code",
        selector: (row) => (
          <Tooltip title={row?.code}>
            <div style={{ textAlign: "left" }}>{row?.code}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Route",
        selector: (row) => (
          <Tooltip title={row?.route}>
            <div style={{ textAlign: "left" }}>{row?.route || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Status",
        selector: (row) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span
                style={{
                  color: row.is_active ? "#1EE0AC" : "#e85347",
                  minWidth: "60px",
                  display: "inline-block",
                }}
              >
                {row.is_active ? "Active" : "Inactive"}
              </span>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "40px",
                  justifyContent: "center",
                  visibility: "visible",
                  transition: "visibility 0.2s, opacity 0.2s",
                  opacity: 1,
                }}
              >
                {row.is_active ? (
                  <Tooltip title="Click to Block">
                    <LockOpen
                      sx={{ color: "#1EE0AC", cursor: "pointer" }}
                      onClick={() =>
                        handleLockUnlockClick(row, "block", "service")
                      }
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to Unblock">
                    <Lock
                      sx={{ color: "#e85347", cursor: "pointer" }}
                      onClick={() =>
                        handleLockUnlockClick(row, "unblock", "service")
                      }
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>
          );
        },
      },
      {
        name: "Api Status",
        selector: (row) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span
                style={{
                  color: row.is_active_api ? "#1EE0AC" : "#e85347",
                  minWidth: "60px",
                  display: "inline-block",
                }}
              >
                {row.is_active_api ? "Active" : "Inactive"}
              </span>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "40px",
                  justifyContent: "center",
                  visibility: "visible",
                  transition: "visibility 0.2s, opacity 0.2s",
                  opacity: 1,
                }}
              >
                {row.is_active_api ? (
                  <Tooltip title="Click to Block">
                    <LockOpen
                      sx={{ color: "#1EE0AC", cursor: "pointer" }}
                      onClick={() => handleLockUnlockClick(row, "block", "api")}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to Unblock">
                    <LockOpen
                      sx={{ color: "#e85347", cursor: "pointer" }}
                      onClick={() =>
                        handleLockUnlockClick(row, "unblock", "api")
                      }
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>
          );
        },
      },
      {
        name: "User Status",
        selector: (row) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span
                style={{
                  color: row.is_active_users ? "#1EE0AC" : "#e85347",
                  minWidth: "60px",
                  display: "inline-block",
                }}
              >
                {row.is_active_users ? "Active" : "Inactive"}
              </span>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "40px",
                  justifyContent: "center",
                  visibility: "visible",
                  transition: "visibility 0.2s, opacity 0.2s",
                  opacity: 1,
                }}
              >
                {row.is_active_users ? (
                  <Tooltip title="Click to Block">
                    <LockOpen
                      sx={{ color: "#1EE0AC", cursor: "pointer" }}
                      onClick={() =>
                        handleLockUnlockClick(row, "block", "users")
                      }
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to Unblock">
                    <Lock
                      sx={{ color: "#e85347", cursor: "pointer" }}
                      onClick={() =>
                        handleLockUnlockClick(row, "unblock", "users")
                      }
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>
          );
        },
      },
      {
        name: "Actions",
        selector: (row) => {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minWidth: "80px",
              }}
            >
              <IconButton
                color="primary"
                size="small"
                onClick={() => {
                  setSelectedService(row);
                  setOpenEdit(true);
                }}
                sx={{
                  visibility: "visible",
                  transition: "visibility 0.2s, opacity 0.2s",
                  opacity: 1,
                }}
              >
                <Edit />
              </IconButton>
            </Box>
          );
        },
        width: "100px",
      },
    ],
    []
  );

  // Table rows rendering
  const tableRows = useMemo(() => {
    if (loading) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            style={{ textAlign: "center", padding: 40 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CircularProgress size={30} />
              <Typography variant="body2">Loading services...</Typography>
            </Box>
          </td>
        </tr>
      );
    }

    if (filteredData.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            style={{ textAlign: "center", padding: 40 }}
          >
            <Typography variant="body1">
              {searchTerm
                ? "No services found matching your search"
                : "No services available"}
            </Typography>
          </td>
        </tr>
      );
    }

    return filteredData.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        <tr
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            borderRadius: "8px",
            marginBottom: "12px",
            display: "table-row",
            transition: "all 0.2s ease-in-out",
            cursor: "default",
            border: "1px solid #f0f0f0",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f8f9ff";
            e.currentTarget.style.boxShadow = "0px 4px 12px rgba(0,0,0,0.12)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.boxShadow = "0px 2px 8px rgba(0,0,0,0.08)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {columns.map((column, colIndex) => (
            <td
              key={colIndex}
              style={{
                padding: "12px 16px",
                verticalAlign: "middle",
                textAlign: "left",
                fontSize: "14px",
                lineHeight: "1.4",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 400,
                color: "#646e84",
                border: "none",
                borderRight:
                  colIndex < columns.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              {column.selector ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: "24px",
                  }}
                >
                  {column.selector(row)}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "DM Sans, sans-serif",
                    color: "#8094ae",
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {row[column.name] || "—"}
                </Typography>
              )}
            </td>
          ))}
        </tr>
        <tr style={{ height: "8px", backgroundColor: "transparent" }}>
          <td colSpan={columns.length} style={{ padding: 0, border: "none" }} />
        </tr>
      </React.Fragment>
    ));
  }, [loading, filteredData, columns, searchTerm]);

  // Table headers
  const tableHeaders = useMemo(
    () =>
      columns.map((column, index) => (
        <th
          key={index}
          style={{
            backgroundColor: "#fefefe",
            boxShadow: " rgba(0,0,0,0.08)", // ✅ same as row
            borderRadius: "8px",
            marginBottom: "12px",
            padding: "12px 16px",
            verticalAlign: "middle",
            textAlign: "left",
            fontSize: "14.5px",
            lineHeight: "1.3",
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 600,
            color: "#526484", // header ka thoda dark color
            border: "none",
          }}
        >
          {column.name}
        </th>
      )),
    [columns]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}
        >
          Services
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Search Box */}
          <TextField
            size="small"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: 250,
              "& .MuiOutlinedInput-root": {
                fontFamily: "DM Sans, sans-serif",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8094ae" }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm("")}
                    sx={{ color: "#8094ae" }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Refresh Button */}
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <CachedIcon />}
            </IconButton>
          </Tooltip>

          {/* Create Service Button */}
          {user?.role === "sadm" || user?.role === "adm" && (
            <Button
              variant="contained"
              onClick={() => setOpenCreate(true)}
              sx={{
                backgroundColor: "#526484",
                // "&:hover": { backgroundColor: "#008a00" },
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Create Service
            </Button>
          )}
        </Box>
      </Box>

      {/* Services Table */}
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        {error ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography
              color="error"
              sx={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Error: {error}
            </Typography>
            <Button
              variant="contained"
              onClick={handleRefresh}
              sx={{ mt: 2, fontFamily: "DM Sans, sans-serif" }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ overflow: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 8px",
                }}
              >
                <thead>
                  <tr>{tableHeaders}</tr>
                </thead>
                <tbody>{tableRows}</tbody>
              </table>
            </Box>

            {/* Pagination - Only show if not searching */}
            {!searchTerm && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, 25, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  fontFamily: "DM Sans, sans-serif",
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontFamily: "DM Sans, sans-serif",
                    },
                }}
              />
            )}
          </>
        )}
      </Paper>

      {/* Modals */}
      <CreateServiceModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onFetchRef={fetchData}
      />

      <EditServiceModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        service={selectedService}
        onFetchRef={fetchData}
      />

      <BlockUnblockService
        open={openMpinModal}
        setOpen={setOpenMpinModal}
        serviceId={selectedService?.id}
        actionType={actionType}
        actionTarget={actionTarget}
        onSuccess={fetchData}
      />
    </Box>
  );
};
export default Services;
