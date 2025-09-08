import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  memo,
} from "react";
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  Tooltip,
  Button,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  TablePagination,
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
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import CachedIcon from '@mui/icons-material/Cached';
import { apiCall } from "../../api/apiClient";
import Loader from "./Loader";

// Memoized TablePaginationActions component
const TablePaginationActions = memo(function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = useCallback(
    (event) => {
      onPageChange(event, 0);
    },
    [onPageChange]
  );

  const handleBackButtonClick = useCallback(
    (event) => {
      onPageChange(event, page - 1);
    },
    [onPageChange, page]
  );

  const handleNextButtonClick = useCallback(
    (event) => {
      onPageChange(event, page + 1);
    },
    [onPageChange, page]
  );

  const handleLastPageButtonClick = useCallback(
    (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    },
    [onPageChange, count, rowsPerPage]
  );

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
});

// Memoized filter chip component
const FilterChip = memo(({ filterId, value, filterConfig, onRemove }) => (
  <Chip
    label={`${filterConfig?.label}: ${value}`}
    onDelete={() => onRemove(filterId)}
    size="small"
    sx={{ m: 0.5 }}
  />
));

const CommonTable = ({
  columns: initialColumns,
  endpoint,
  filters: availableFilters = [],
  refreshInterval = 0,
  defaultPageSize = 15,
  defaultFilters,
  title = "",
  queryParam = "",
  onFetchRef,
    customHeader = null, // Add this line
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Use refs to track values without causing re-renders
  const appliedFiltersRef = useRef({});
  const pageRef = useRef(0);
  const rowsPerPageRef = useRef(defaultPageSize);
  const refreshIntervalRef = useRef(refreshInterval);
  const hasFetchedInitialData = useRef(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Memoized initial filter values
  const initialFilterValues = useMemo(() => {
    const values = {};
    availableFilters.forEach((filter) => {
      values[filter.id] = filter.type === "dropdown" ? "All" : "";
    });
    return values;
  }, [availableFilters]);

  // Initialize filter values
  useEffect(() => {
    setFilterValues(initialFilterValues);
    setAppliedFilters(initialFilterValues);
    appliedFiltersRef.current = initialFilterValues;
  }, []);

  // Memoized fetch data function
  const fetchData = useCallback(
    async (isManualRefresh = false) => {
      setLoading(true);
      setError(null);

      const currentAppliedFilters = appliedFiltersRef.current;
      const currentPage = pageRef.current;
      const currentRowsPerPage = rowsPerPageRef.current;

      // Prepare params for API call
      const params = {
        ...currentAppliedFilters,
        page: currentPage + 1,
        paginate: currentRowsPerPage,
      };

      // Clean up params
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "All" ||
          params[key] === "" ||
          params[key] == null
        ) {
          delete params[key];
        }
      });

      // Add queryParam if provided
      let finalEndpoint = endpoint;
      if (typeof queryParam === "string" && queryParam.trim() !== "") {
        // queryParam is a query string → append to URL
        finalEndpoint = `${endpoint}?${queryParam}`;
      } else if (
        typeof queryParam === "object" &&
        queryParam !== null &&
        Object.keys(queryParam).length > 0
      ) {
        // queryParam is an object → merge into params
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
          if (response) {
            if (apiError) {
              setError(apiError.message || "Failed to fetch data");
            } else if (response) {
              // ✅ Normalize data structure
              let normalizedData =
                response?.data?.data || // case: response.data.data
                response?.data || // case: response.data
                response || // case: direct response
                [];

              // ✅ Handle total count safely
              let total =
                response?.data?.total ||
                response?.total ||
                normalizedData?.length ||
                0;

              setData(
                Array.isArray(normalizedData)
                  ? normalizedData
                  : [normalizedData]
              );
              setTotalCount(total);
            } else {
              setData([]);
              setTotalCount(0);
            }
          } else if (Array.isArray(response)) {
            setData(response);
            setTotalCount(response.length);
          } else {
            setData([]);
            setTotalCount(0);
          }
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [endpoint, queryParam]
  );

  // Update refs when state changes
  useEffect(() => {
    appliedFiltersRef.current = appliedFilters;
    pageRef.current = page;
    rowsPerPageRef.current = rowsPerPage;
    refreshIntervalRef.current = refreshInterval;
  }, [appliedFilters, page, rowsPerPage, refreshInterval]);

  // Initial data fetch
  useEffect(() => {
    if (!hasFetchedInitialData.current) {
      fetchData();
      hasFetchedInitialData.current = true;
    }
  }, [fetchData]);

  // Setup refresh interval
  useEffect(() => {
    let intervalId;
    if (refreshIntervalRef.current > 0) {
      intervalId = setInterval(() => {
        fetchData();
      }, refreshIntervalRef.current);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData]);

  // Memoized filter handlers
  const handleFilterChange = useCallback((filterId, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...filterValues });
    appliedFiltersRef.current = { ...filterValues };
    setPage(0);
    pageRef.current = 0;
    if (isSmallScreen) {
      setFilterModalOpen(false);
    }
    fetchData();
  }, [filterValues, isSmallScreen, fetchData]);

  const resetFilters = useCallback(() => {
    setFilterValues(initialFilterValues);
    setAppliedFilters(initialFilterValues);
    appliedFiltersRef.current = initialFilterValues;
    setPage(0);
    pageRef.current = 0;
    fetchData();
  }, [initialFilterValues, fetchData]);

  const removeFilter = useCallback(
    (filterId) => {
      const resetValue =
        availableFilters.find((f) => f.id === filterId)?.type === "dropdown"
          ? "All"
          : "";

      setFilterValues((prev) => ({ ...prev, [filterId]: resetValue }));
      setAppliedFilters((prev) => ({ ...prev, [filterId]: resetValue }));
      appliedFiltersRef.current = {
        ...appliedFiltersRef.current,
        [filterId]: resetValue,
      };
      setPage(0);
      pageRef.current = 0;
      fetchData();
    },
    [availableFilters, fetchData]
  );

  const handleChangePage = useCallback(
    (event, newPage) => {
      setPage(newPage);
      pageRef.current = newPage;
      fetchData();
    },
    [fetchData]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      rowsPerPageRef.current = newRowsPerPage;
      setPage(0);
      pageRef.current = 0;
      fetchData();
    },
    [fetchData]
  );

  // Manual refresh handler
  const handleManualRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);
  useEffect(() => {
    if (onFetchRef) onFetchRef(fetchData);
  }, [fetchData, onFetchRef]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  // Memoized filter inputs renderer
  const renderFilterInputs = useCallback(
    () =>
      availableFilters.map((filter) => (
        <Box key={filter.id} sx={{ minWidth: 120, mb: 2 }}>
          {filter.type === "dropdown" ? (
            <FormControl size="small" fullWidth>
              <TextField
                select
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
            </FormControl>
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
      )),
    [availableFilters, filterValues, handleFilterChange]
  );

  // Memoized applied filters chips
  const appliedFiltersChips = useMemo(
    () =>
      Object.entries(appliedFilters)
        .filter(([key, value]) => value && value !== "All" && value !== "")
        .map(([key, value]) => {
          const filterConfig = availableFilters.find((f) => f.id === key);
          return (
            <FilterChip
              key={key}
              filterId={key}
              value={value}
              filterConfig={filterConfig}
              onRemove={removeFilter}
            />
          );
        }),
    [appliedFilters, availableFilters, removeFilter]
  );

  // Memoized table rows
const tableRows = useMemo(() => {
  if (loading) {
    return (
      <tr>
        <td
          colSpan={initialColumns.length}
          style={{ 
            textAlign: "center", 
            padding: "40px 20px",
            fontStyle: "italic",
            color: "#666"
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <CircularProgress size={30} />
            <Typography variant="body2">Loading data...</Typography>
          </Box>
        </td>
      </tr>
    );
  }

  if (data.length === 0) {
    return (
      <tr>
        <td
          colSpan={initialColumns.length}
          style={{ 
            textAlign: "center", 
            padding: "40px 20px",
            fontStyle: "italic",
            color: "#666"
          }}
        >
          <Typography variant="body1">
            No data available
          </Typography>
        </td>
      </tr>
    );
  }

  return data.map((row, rowIndex) => (
    <tr 
      key={rowIndex} 
      style={{ 
        borderBottom: "1px solid #e0e0e0",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: "#f8f9fa"
        }
      }}
      className="table-row"
    >
      {initialColumns.map((column, colIndex) => (
        <td
          key={colIndex}
          style={{
            padding: "14px 12px",
            verticalAlign: "middle",
            width: column.width || "auto",
            textAlign: "left",
            fontSize: "16px",
            lineHeight: "1",
            fontFamily: "'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
            color: "#333"
          }}
        >
          {column.selector ? (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center",
              textAlign: "left",
              justifyContent: "flex-start"
            }}>
              {column.selector(row)}
            </Box>
          ) : (
            <Typography 
              variant="body2" 
              sx={{ 
                textAlign: "left",
                fontWeight: column.name === "Amount" ? 600 : 400,
                color: column.name === "Status" ? "transparent" : "inherit" // Status will be handled by its selector
              }}
            >
              {row[column.name] || "—"}
            </Typography>
          )}
        </td>
      ))}
    </tr>
  ));
}, [loading, data, initialColumns]);
  // Memoized table headers
const tableHeaders = useMemo(
  () =>
    initialColumns.map((column, index) => (
      <th
        key={index}
        style={{
          padding: "16px 12px",
          textAlign: "left",
          fontWeight: 500,
          fontSize: "15px",
          width: column.width || "auto",
          minWidth: column.width || "auto",
          backgroundColor: "#000",
          color: "#fff",
          letterSpacing: "0.5px",
          borderBottom: "2px solid #e2e8f0",
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
          position: "sticky",
          top: 0,
          zIndex: 1,
          whiteSpace: "nowrap"
        }}
      >
        {typeof column.name === "string" ? (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <span>{column.name}</span>
            {/* Optional: Add sorting indicators if needed */}
            {/* <ArrowUpwardIcon sx={{ fontSize: 14, opacity: 0.5 }} /> */}
          </Box>
        ) : (
          column.name?.props?.children || `Column ${index + 1}`
        )}
      </th>
    )),
  [initialColumns]
);
  return (
    <Box sx={{}}>
      <Loader request={loading} />
      {/* Filter Section */}
      {availableFilters.length > 0 && (
        <>
          <Paper sx={{ p: 2, mb: 2, display: { xs: "none", md: "block" } }}>
            {/* <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}> */}
              {/* <FilterListIcon sx={{ mr: 1 }} /> */}
              {/* <Typography variant="h6">Filters</Typography> */}
            {/* </Box> */}

            <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        flexWrap: "wrap", 
        gap: 2, 
        mb: 2 
      }}>
        {availableFilters.map((filter) => (
          <Box key={filter.id} sx={{ minWidth: 120 }}>
            {filter.type === "dropdown" ? (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <TextField
                  select
                  label={filter.label}
                  value={filterValues[filter.id] || "All"}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  size="small"
                >
                  <MenuItem value="All">All</MenuItem>
                  {filter.options &&
                    filter.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              </FormControl>
            ) : (
              <TextField
                size="small"
                label={filter.label}
                value={filterValues[filter.id] || ""}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                sx={{ minWidth: 120 }}
              />
            )}
          </Box>
        ))}
        
        {/* Apply and Reset buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={applyFilters} size="small">
            Apply
          </Button>
          <Button
            variant="outlined"
            onClick={resetFilters}
            startIcon={<ClearIcon />}
            size="small"
          >
            Reset
          </Button>
        </Box>
      </Box>

            {/* Applied filters chips */}
            {/* <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {appliedFiltersChips}
            </Box> */}
          </Paper>

          {/* Mobile filter button */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
              mb: 2,
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
  }}
>
  <Typography variant="h5">{title}</Typography>
  
  <Box sx={{ display: "flex", alignItems: "center" }}>
    {customHeader} {/* Add custom header content here */}
    <Tooltip title="Refresh">
      <IconButton onClick={handleManualRefresh} disabled={loading} sx={{ ml: 1 }}>
        {loading ? <CircularProgress size={24} /> : <CachedIcon />}
      </IconButton>
    </Tooltip>
  </Box>
</Box>

      {/* Data Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
          <>
            <Box sx={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>{tableHeaders}</tr>
                </thead>
                <tbody>{tableRows}</tbody>
              </table>
            </Box>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default memo(CommonTable);