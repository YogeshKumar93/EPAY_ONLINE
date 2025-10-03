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
import CachedIcon from "@mui/icons-material/Cached";
import { apiCall } from "../../api/apiClient";
import Loader from "./Loader";
import { DateRangePicker } from "rsuite";
import { predefinedRanges, yyyymmdd } from "../../utils/DateUtils";
import "rsuite/dist/rsuite.min.css";

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
  refresh = true,
  customHeader = null, // Add this line
  rowHoverHandlers, // Add this prop to accept hover handlers
  rowProps,
  enableActionsHover = true,
}) => {
  const { afterToday } = DateRangePicker;
  const [hoveredRow, setHoveredRow] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

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
    availableFilters?.forEach((filter) => {
      if (filter.type === "dropdown") {
        values[filter.id] = "All";
      } else if (filter.type === "date") {
        values[filter.id] = "";
      } else if (filter.type === "daterange") {
        values[filter.id] = { start: "", end: "" };
      } else {
        values[filter.id] = "";
      }
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
    // Copy current filter values
    const formattedFilters = { ...filterValues };

    Object.keys(formattedFilters).forEach((key) => {
      const filterConfig = availableFilters.find((f) => f.id === key);

      if (filterConfig?.type === "date" && formattedFilters[key]) {
        // Format single date to YYYY-MM-DD
        formattedFilters[key] = new Date(formattedFilters[key])
          .toISOString()
          .split("T")[0];
      } else if (filterConfig?.type === "daterange" && formattedFilters[key]) {
        // Convert daterange to from_date / to_date
        if (formattedFilters[key].start) {
          formattedFilters["from_date"] = new Date(formattedFilters[key].start)
            .toISOString()
            .split("T")[0];
        }
        if (formattedFilters[key].end) {
          formattedFilters["to_date"] = new Date(formattedFilters[key].end)
            .toISOString()
            .split("T")[0];
        }
        // Remove original daterange object
        delete formattedFilters[key];
      }
    });

    // Apply filters
    setAppliedFilters(formattedFilters);
    appliedFiltersRef.current = formattedFilters;
    setPage(0);
    pageRef.current = 0;

    // Close mobile modal if small screen
    if (isSmallScreen) {
      setFilterModalOpen(false);
    }

    // Fetch data with new filters
    fetchData();
  }, [filterValues, fetchData, availableFilters]);

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
      const filterConfig = availableFilters.find((f) => f.id === filterId);
      let resetValue;

      if (filterConfig?.type === "dropdown") {
        resetValue = "All";
      } else if (filterConfig?.type === "daterange") {
        resetValue = { start: "", end: "" };
      } else {
        resetValue = "";
      }

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
          ) : filter.type === "date" ? (
            <TextField
              fullWidth
              size="small"
              label={filter.label}
              type="date"
              value={filterValues[filter.id] || ""}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : filter.type === "daterange" ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", minWidth: 200 }}
            >
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                {filter.label}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <DateRangePicker
                  size="md"
                  editable
                  ranges={predefinedRanges}
                  cleanable
                  showOneCalendar
                  appearance="subtle"
                  placeholder="Select Date Range"
                  placement="auto"
                  value={filterValues[filter.id]?.value || null}
                  onChange={(value) => {
                    if (value) {
                      handleFilterChange(filter.id, {
                        value: value,
                        start: yyyymmdd(value[0]),
                        end: yyyymmdd(value[1]),
                      });
                    } else {
                      handleFilterChange(filter.id, { start: "", end: "" });
                    }
                  }}
                  disabledDate={afterToday()}
                  container={() => document.body}
                  style={{
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    zIndex: 9999,
                  }}
                />
              </Box>
            </Box>
          ) : (
          <TextField
              fullWidth
              size="small"
              label={filter.label}
              type={filter.textType || "text"}
              value={filterValues[filter.id] || ""}
              onChange={(e) => {
                let value = e.target.value;

                handleFilterChange(filter.id, value);
              }}
              inputProps={{
                maxLength: filter.id === "mobile" ? 10 : undefined,
                inputMode: filter.id === "mobile" ? "numeric" : undefined,
              }}
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
        .filter(([key, value]) => {
          // Skip date range sub-filters (they're handled separately)
          if (key.includes("_start") || key.includes("_end")) return false;

          const filterConfig = availableFilters.find((f) => f.id === key);

          if (filterConfig?.type === "daterange") {
            return value && (value.start || value.end);
          }

          return value && value !== "All" && value !== "";
        })
        .map(([key, value]) => {
          const filterConfig = availableFilters.find((f) => f.id === key);

          if (filterConfig?.type === "daterange") {
            if (!value.start && !value.end) return null;

            const label = `${filterConfig.label}: ${
              value.start || "Start"
            } to ${value.end || "End"}`;
            return (
              <Chip
                key={key}
                label={label}
                onDelete={() => removeFilter(key)}
                size="small"
                sx={{ m: 0.5 }}
              />
            );
          }

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

  const renderDesktopFilters = useCallback(
    () =>
      availableFilters.map((filter) => (
        <Box key={filter.id} sx={{ minWidth: 120 }}>
          {filter.type === "dropdown" ? (
            <FormControl
              size="small"
              sx={{ minWidth: 120 }}
              className="textFieldCustom"
            >
              <TextField
                className="textFieldCustom"
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
          ) : filter.type === "date" ? (
            <TextField
              size="small"
              label={filter.label}
              type="date"
              value={filterValues[filter.id] || ""}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ minWidth: 140, fontFamily: "DM Sans, sans-serif" }}
            />
          ) : filter.type === "daterange" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 280,
                mt: -1,
              }}
            >
              <Typography
                className="textFieldCustom"
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: "bold",
                }}
              >
                {filter.label}
              </Typography>
              <DateRangePicker
                size="md"
                editable
                ranges={predefinedRanges}
                cleanable
                showOneCalendar
                appearance="subtle"
                placeholder="Select Date Range"
                placement="bottomEnd"
                value={filterValues[filter.id]?.value || null}
                onChange={(value) => {
                  if (value) {
                    handleFilterChange(filter.id, {
                      value: value,
                      start: yyyymmdd(value[0]),
                      end: yyyymmdd(value[1]),
                    });
                  } else {
                    handleFilterChange(filter.id, { start: "", end: "" });
                  }
                }}
                disabledDate={afterToday()}
                container={() => document.body}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  zIndex: 9999,
                }}
              />
            </Box>
          ) : (
            <TextField
              fullWidth
              size="small"
              label={filter.label}
              type={filter.textType || "text"}
              value={filterValues[filter.id] || ""}
              onChange={(e) => {
                let value = e.target.value;

                handleFilterChange(filter.id, value);
              }}
              inputProps={{
                maxLength: filter.id === "mobile" ? 10 : undefined,
                inputMode: filter.id === "mobile" ? "numeric" : undefined,
              }}
            />
          )}
        </Box>
      )),
    [availableFilters, filterValues, handleFilterChange]
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
              padding: 40,
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                fontFamily: "DM Sans, sans-serif",
              }}
            >
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
              padding: 40,
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <Typography variant="body1">No data available</Typography>
          </td>
        </tr>
      );
    }

    return data.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        {/* This is the main row with data */}
        <tr
          style={{
            backgroundColor: "#fefefe",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            borderRadius: "8px",
            marginBottom: "12px",
            display: "table-row",
          }}
          className="table-row"
          // Add hover handlers if provided
          onMouseEnter={() => enableActionsHover && setHoveredRow(row.id)} // ✅ hover sirf jab enableActionsHover true ho
          onMouseLeave={() => enableActionsHover && setHoveredRow(null)}
        >
          {initialColumns.map((column, colIndex) => (
            <td
              key={colIndex}
              style={{
                padding: "6px 10px",
                verticalAlign: "middle",
                textAlign: "left",
                fontSize: "15px",
                lineHeight: "1",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 400,

                color: "#646e84",
                border: "none", // Remove default borders
              }}
            >
              {column.selector ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {column.selector(row, {
                    hoveredRow,
                    enableActionsHover, // ✅ pass down as helper
                  })}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "DM Sans, sans-serif", color: "#8094ae" }}
                >
                  {row[column.name] || "—"}
                </Typography>
              )}
            </td>
          ))}
        </tr>

        {/* This is the spacing row between cards */}
        <tr style={{ height: "12px", backgroundColor: "transparent" }}>
          <td
            colSpan={initialColumns.length}
            style={{ padding: 0, border: "none" }}
          ></td>
        </tr>
      </React.Fragment>
    ));
  }, [loading, data, initialColumns, hoveredRow, enableActionsHover]);

  // Memoized table headers
  const tableHeaders = useMemo(
    () =>
      initialColumns.map((column, index) => (
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
    [initialColumns]
  );

  return (
    <Box>
      <Loader request={loading} />
      {/* Filter Section */}
      {availableFilters.length > 0 && (
        <>
          <Paper sx={{ p: 1, display: { xs: "none", md: "block" } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                // mb: 2
              }}
            >
              {renderDesktopFilters()}
              {/* Apply and Reset buttons */}
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {/* Left side buttons */}
                <Button
                  className="btnCustom"
                  variant="contained"
                  onClick={applyFilters}
                  size="small"
                  sx={{ backgroundColor: "#00A300" }}
                >
                  Apply
                </Button>

                <Button
                  // className="btnCustom"
                  // variant="outlined"
                  onClick={resetFilters}
                  startIcon={<ClearIcon />}
                  size="small"
                  sx={{ backgroundColor: "#FF542E", color: "#fff" }}
                >
                  Reset
                </Button>
                <Tooltip title="Refresh">
                  <IconButton onClick={handleManualRefresh} disabled={loading}>
                    <CachedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ marginLeft: "auto" }}>{customHeader}</Box>
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
          mb: 1,
        }}
      >
        <Typography variant="h5">{title}</Typography>

        {/* <Box sx={{ display: "flex", alignItems: "center" }}></Box> */}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">{title}</Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* ✅ Show Refresh only if no filters are used */}
          {availableFilters.length === 0 && refresh && (
            <>
              <Box sx={{ marginLeft: "auto" }}>{customHeader}</Box>

              <Tooltip title="Refresh">
                <IconButton
                  onClick={handleManualRefresh}
                  disabled={loading}
                  sx={{ ml: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : <CachedIcon />}
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>

      {/* Data Table */}
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
              <table
                style={{
                  width: "100%",
                  // borderCollapse: "separate",
                }}
              >
                <thead>
                  <tr
                    style={{
                      display: "table-row",

                      backgroundColor: "#fefefe",
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    {tableHeaders}
                  </tr>
                  <tr
                    style={{
                      height: "10px",
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                    }}
                  />{" "}
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
