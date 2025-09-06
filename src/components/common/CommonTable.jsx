import React, { useState, useEffect, useMemo, memo } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { apiCall } from "../../api/apiClient";
import DataTable from "react-data-table-component";
import { red } from "@mui/material/colors";

const CommonTable = ({
  columns,
  endpoint,
  filters = [],
  refreshInterval = 0,
  defaultPageSize = 10,
  title = "Data Table",
  queryParam = "",
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Initialize filter values
  useEffect(() => {
    const initialFilterValues = {};
    filters.forEach((filter) => {
      initialFilterValues[filter.id] = filter.type === "dropdown" ? "All" : "";
    });
    setFilterValues(initialFilterValues);
    setAppliedFilters(initialFilterValues);
  }, [filters]);

  // Fetch data function
  const fetchData = async (page = currentPage, limit = perPage) => {
    setLoading(true);
    setError(null);

    const params = {
      ...appliedFilters,
      page,
      paginate: limit,
    };

    // Clean up params
    Object.keys(params).forEach((key) => {
      if (params[key] === "All" || params[key] === "" || params[key] == null) {
        delete params[key];
      }
    });

    // Add queryParam if provided
    let finalEndpoint = endpoint;
    if (typeof queryParam === "string" && queryParam.trim() !== "") {
      finalEndpoint = `${endpoint}?${queryParam}`;
    } else if (
      typeof queryParam === "object" &&
      queryParam !== null &&
      Object.keys(queryParam).length > 0
    ) {
      Object.assign(params, queryParam);
    }

    try {
      const { error: apiError, response } = await apiCall(
        "POST",
        finalEndpoint,
        null,
        params
      );

      if (apiError) {
        setError(apiError.message || "Failed to fetch data");
      } else {
        // Normalize data structure
        let normalizedData =
          response?.data?.data || response?.data || response || [];

        // Handle total count
        let total =
          response?.data?.total ||
          response?.total ||
          normalizedData?.length ||
          0;

        setData(
          Array.isArray(normalizedData) ? normalizedData : [normalizedData]
        );
        setTotalRows(total);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Setup refresh interval
  useEffect(() => {
    let intervalId;
    if (refreshInterval > 0) {
      intervalId = setInterval(() => {
        fetchData();
      }, refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshInterval]);

  // Handle filter changes
  const handleFilterChange = (filterId, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filterValues });
    setCurrentPage(1);
    if (isSmallScreen) {
      setFilterModalOpen(false);
    }
    fetchData(1, perPage);
  };

  const resetFilters = () => {
    const resetValues = {};
    filters.forEach((filter) => {
      resetValues[filter.id] = filter.type === "dropdown" ? "All" : "";
    });
    setFilterValues(resetValues);
    setAppliedFilters(resetValues);
    setCurrentPage(1);
    fetchData(1, perPage);
  };

  const removeFilter = (filterId) => {
    const resetValue =
      filters.find((f) => f.id === filterId)?.type === "dropdown" ? "All" : "";

    setFilterValues((prev) => ({ ...prev, [filterId]: resetValue }));
    setAppliedFilters((prev) => ({ ...prev, [filterId]: resetValue }));
    setCurrentPage(1);
    fetchData(1, perPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
    fetchData(page, newPerPage);
  };

  const handleManualRefresh = () => {
    fetchData(currentPage, perPage);
  };

  // Render filter inputs
  const renderFilterInputs = () =>
    filters.map((filter) => (
      <Box key={filter.id} sx={{ minWidth: 120, mb: 2 }}>
        {filter.type === "dropdown" ? (
          <TextField
            select
            fullWidth
            size="small"
            label={filter.label}
            value={filterValues[filter.id] || "All"}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {filter.options &&
              filter.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
        ) : (
          <TextField
            fullWidth
            size="small"
            label={filter.label}
            value={filterValues[filter.id] || ""}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
          />
        )}
      </Box>
    ));

  // Applied filters chips
  const appliedFiltersChips = useMemo(
    () =>
      Object.entries(appliedFilters)
        .filter(([key, value]) => value && value !== "All" && value !== "")
        .map(([key, value]) => {
          const filterConfig = filters.find((f) => f.id === key);
          return (
            <Chip
              key={key}
              label={`${filterConfig?.label}: ${value}`}
              onDelete={() => removeFilter(key)}
              size="small"
              sx={{ m: 0.5 }}
            />
          );
        }),
    [appliedFilters, filters]
  );

  // Custom styles for the data table with improved responsive behavior
  const customStyles = {
    table: {
      style: {
        width: "100%",
        minWidth: "100%",
        tableLayout: "fixed",
      },
    },
    tableWrapper: {
      style: {
        display: "table",
        width: "100%",
        overflowX: "auto",
      },
    },
    headRow: {
      style: {
        backgroundColor: theme.palette.grey[100],
        minHeight: "56px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        fontSize: "14px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        minWidth: "80px", // Added minimum width for cells
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        minWidth: "80px", // Added minimum width for cells
      },
    },
    pagination: {
      style: {
        minHeight: "56px",
        flexWrap: "wrap",
        justifyContent: "center",
      },
    },
  };

  const responsiveColumns = useMemo(() => {
    return columns.map((column) => {
      return {
        ...column,
        omit: isSmallScreen && column.omitOnMobile,
        // Add responsive width for small screens
        width:
          isSmallScreen && column.maxWidth ? column.maxWidth : column.width,
        minWidth: column.minWidth || "80px", // Ensure columns have a minimum width
      };
    });
  }, [columns, isSmallScreen]);

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Filter Section */}
      {filters.length > 0 && (
        <>
          <Paper
            sx={{
              p: 2,
              mb: 2,
              display: { xs: "none", md: "block" },
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FilterListIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Filters</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 2,
                width: "100%",
              }}
            >
              {renderFilterInputs()}

              <Button variant="contained" onClick={applyFilters}>
                Apply
              </Button>
              <Button
                variant="outlined"
                onClick={resetFilters}
                startIcon={<ClearIcon />}
              >
                Reset
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {appliedFiltersChips}
            </Box>
          </Paper>

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
              mb: 2,
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterModalOpen(true)}
            >
              Filters
            </Button>
          </Box>

          {/* Filter Modal for mobile */}
          <Dialog
            open={filterModalOpen}
            onClose={() => setFilterModalOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FilterListIcon sx={{ mr: 1 }} />
                Filters
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>{renderFilterInputs()}</Box>

              {/* Applied filters chips */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {appliedFiltersChips}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={resetFilters} startIcon={<ClearIcon />}>
                Reset
              </Button>
              <Button
                onClick={() => setFilterModalOpen(false)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button onClick={applyFilters} variant="contained">
                Apply
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* Table Header with Refresh */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
          width: "100%",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            textAlign: { xs: "center", sm: "left" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={handleManualRefresh}
          disabled={loading}
          sx={{
            alignSelf: { xs: "center", sm: "flex-end" },
          }}
        >
          {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </Box>

      {/* Data Table */}
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {error ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="error">Error: {error}</Typography>
            <Button
              variant="contained"
              onClick={handleManualRefresh}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <Box sx={{ width: "100%", overflow: "auto" }}>
            <DataTable
              columns={responsiveColumns}
              data={data}
              progressPending={loading}
              progressComponent={
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress />
                </Box>
              }
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              customStyles={customStyles}
              responsive
              striped
              highlightOnHover
              pointerOnHover
              noDataComponent={
                <Typography sx={{ py: 3, textAlign: "center" }}>
                  No data found
                </Typography>
              }
              fixedHeader
              fixedHeaderScrollHeight="400px"
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default memo(CommonTable);
