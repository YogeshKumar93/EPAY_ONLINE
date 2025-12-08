import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  memo,
  useContext,
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
  Autocomplete,
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
import AuthContext from "../../contexts/AuthContext";
import { useExcelExport } from "../../hooks/useExcelExport";
import ExportExcelButton from "./ExportExcelButton";
// import { RoleUserFilter } from "./RoleUserFilter";

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
  setSummary=()=>{},
  refresh = true,
  customHeader = null, // Add this line
  rowHoverHandlers, // Add this prop to accept hover handlers
  rowProps,
  enableActionsHover = true,
  onFilterChange, // Add this prop
  enableExcelExport = false, // New prop to enable export
  exportFileName = "TableData", // New prop for export file name
  exportEndpoint, // New prop for export API endpoint (can be different from main endpoint)
  exportPayload,
  onSelectionChange, // Add this prop
  selectedRows = [], // Add this prop
  onExportComplete,
  enableRowSelection = false, 
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
  const authCtx = useContext(AuthContext);
  const [exportFilters, setExportFilters] = useState({}); // ✅ Use state for export filters
  const [resetKey, setResetKey] = useState(0);
  // const [selectedRows, setSelectedRows] = useState([]); // array of selected row IDs
  const allRowIds = useMemo(() => data.map((row) => row.id), [data]); // assumes each row has unique `id`

  const user = authCtx?.user;
  // Use refs to track values without causing re-renders
  const appliedFiltersRef = useRef({});
  const pageRef = useRef(0);
  const rowsPerPageRef = useRef(defaultPageSize);
  const refreshIntervalRef = useRef(refreshInterval);
  const hasFetchedInitialData = useRef(false);
  const currentAppliedFiltersRef = useRef({});

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
  // Select/unselect all
const handleSelectAll = (event) => {
  if (event.target.checked) {
    onSelectionChange?.(data); // Pass full row objects
  } else {
    onSelectionChange?.([]);
  }
};
  // Select/unselect individual row - use the prop function
  const handleSelectRow = (row) => {
    const isSelected = selectedRows.some(
      (selectedRow) => selectedRow.id === row.id
    );
    const newSelectedRows = isSelected
      ? selectedRows.filter((selectedRow) => selectedRow.id !== row.id)
      : [...selectedRows, row];
    onSelectionChange?.(newSelectedRows);
  };

  // useEffect(() => {
  //   setFilterValues(initialFilterValues);
  //   setAppliedFilters(initialFilterValues);
  //   setExportFilters(initialFilterValues); // ✅ Initialize export filters state
  //   appliedFiltersRef.current = initialFilterValues;
  //   console.log("🔍 [Table] Initialized all filters:", initialFilterValues);
  // }, [initialFilterValues]);
  const { handleExportExcel } = useExcelExport();

  const handleTableExport = useCallback(async () => {
    const payload = {
      ...exportFilters, // filters from UI
      ...exportPayload, // extra payload from props
    };
    const result = await handleExportExcel(
      exportEndpoint || endpoint,
      payload,
      exportFilters, // ✅ Use state instead of ref
      exportFileName
    );

    if (onExportComplete) {
      onExportComplete(result);
    }
  }, [
    endpoint,
    exportEndpoint,
    exportFileName,
    handleExportExcel,
    onExportComplete,
    exportPayload,
    exportFilters, // ✅ Add to dependencies
  ]);

  const enhancedCustomHeader = useMemo(
    () => (
      <>
        {customHeader}
        {enableExcelExport && (
          <ExportExcelButton
            endpoint={exportEndpoint || endpoint}
            appliedFilters={{ ...exportFilters, ...exportPayload }} // ✅ merge both
            fileName={exportFileName}
            variant="icon"
          />
        )}
      </>
    ),
    [
      customHeader,
      enableExcelExport,
      exportEndpoint,
      endpoint,
      exportFileName,
      exportFilters,
    ]
  );

  const visibleFilters = useMemo(() => {
    return availableFilters.filter((filter) => {
      if (!filter.roles) return true; // filters with no role restriction
      return filter.roles.includes(user?.role); // only include if allowed
    });
  }, [availableFilters, user?.role]);
  // Initialize filter values
  useEffect(() => {
    setFilterValues(initialFilterValues);
    setAppliedFilters(initialFilterValues);
    appliedFiltersRef.current = initialFilterValues;
  }, []);

  const fetchData = useCallback(
    async (isManualRefresh = false) => {
      setLoading(true);
      setError(null);

      const currentAppliedFilters = appliedFiltersRef.current;
      const currentPage = pageRef.current;
      const currentRowsPerPage = rowsPerPageRef.current;

      // Prepare params for API call - this will go in the request body
      const requestBody = {
        ...currentAppliedFilters,
        page: currentPage + 1,
        paginate: currentRowsPerPage,
      };

      // Clean up params
      Object.keys(requestBody).forEach((key) => {
        if (
          requestBody[key] === "All" ||
          requestBody[key] === "" ||
          requestBody[key] == null
        ) {
          delete requestBody[key];
        }
      });

      // Handle queryParam - if it's an object, merge into requestBody
      let finalEndpoint = endpoint;
      let finalRequestBody = requestBody;

      if (typeof queryParam === "string" && queryParam.trim() !== "") {
        // queryParam is a query string → append to URL
        finalEndpoint = `${endpoint}?${queryParam}`;
      } else if (
        typeof queryParam === "object" &&
        queryParam !== null &&
        Object.keys(queryParam).length > 0
      ) {
        // queryParam is an object → merge into request body
        finalRequestBody = {
          ...requestBody,
          ...queryParam,
        };
      }

      try {
        const { error: apiError, response } = await apiCall(
          "POST",
          finalEndpoint,
          null,
          finalRequestBody // This sends the data in the request body
        );

        if (apiError) {
          setError(apiError.message || "Failed to fetch data");
        } else {
          if (response) {
            // ✅ Normalize data structure
            let normalizedData =
              response?.data?.data || // case: response.data.data
              response?.data || // case: response.data
              response || // case: direct response
              [];

            // ✅ Add serial numbers here
            const dataWithSerial = Array.isArray(normalizedData)
              ? normalizedData.map((item, index) => ({
                  ...item,
                  serialNo: index + 1,
                }))
              : [{ ...normalizedData, serialNo: 1 }];

            // ✅ Handle total count safely
            let total =
              response?.data?.total ||
              response?.total ||
              normalizedData?.length ||
              0;
             setSummary(response?.data?.summary??[])
            setData(dataWithSerial); // ✅ Use dataWithSerial instead of normalizedData
            setTotalCount(total);
          } else if (Array.isArray(response)) {
            // ✅ Also add serial numbers for array response case
            const dataWithSerial = response.map((item, index) => ({
              ...item,
              serialNo: index + 1,
            }));
            setData(dataWithSerial);
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
  // ✅ Memoized filter change handler
  // ✅ Memoized filter change handler
  // const handleFilterChange = (id, newValue) => {
  //   console.log("🧩 Updating filter value for:", id, newValue);
  //   setFilterValues((prev) => ({ ...prev, [id]: newValue }));
  // };
  const handleFilterChange = (id, value) => {
    console.log("🟢 [Table] Filter change:", id, value);

    // Update both states
    setFilterValues((prev) => ({ ...prev, [id]: value }));
    setAppliedFilters((prev) => ({ ...prev, [id]: value }));
  };

  const applyFilters = useCallback(() => {
    console.log("🔍 [Table] applyFilters called with:", filterValues);

    const formattedFilters = { ...filterValues };

    Object.keys(formattedFilters).forEach((key) => {
      const filterConfig = availableFilters.find((f) => f.id === key);
      const val = formattedFilters[key];

      // 🚫 Skip empty or "All" values
      if (val === "" || val === null || val === undefined || val === "All") {
        delete formattedFilters[key];
        return;
      }
      // Add this case in the Object.keys(formattedFilters).forEach loop:
      if (filterConfig?.type === "roleuser" && val) {
        // If val is an object with user_id, extract it, otherwise use as-is
        formattedFilters[key] =
          typeof val === "object" ? val.id || val.id || val : val;
        return;
      }
      // 🧠 Extract ID or value for dropdown/autocomplete
      if (
        (filterConfig?.type === "dropdown" ||
          filterConfig?.type === "autocomplete") &&
        val
      ) {
        // For autocomplete, we want to send the ID (value property)
        if (filterConfig?.type === "autocomplete" && typeof val === "object") {
          formattedFilters[key] = val.value || val.id || val; // Use value property which contains the ID
        } else {
          formattedFilters[key] = val.id || val.value || val;
        }
      }

      // 📅 Handle single date filter
      if (filterConfig?.type === "date" && val) {
        formattedFilters[key] = new Date(val).toISOString().split("T")[0];
      }

      // 📆 Handle date range
      if (filterConfig?.type === "daterange" && val) {
        if (val.start) {
          formattedFilters["from_date"] = new Date(val.start)
            .toISOString()
            .split("T")[0];
        }
        if (val.end) {
          formattedFilters["to_date"] = new Date(val.end)
            .toISOString()
            .split("T")[0];
        }
        delete formattedFilters[key];
      }
    });

    console.log("✅ [Table] Final formatted filters:", formattedFilters);

    // ✅ Update filter states & refs
    setAppliedFilters(formattedFilters);
    setExportFilters(formattedFilters);
    appliedFiltersRef.current = formattedFilters;

    // ✅ Trigger parent callback if present
    if (onFilterChange) {
      onFilterChange(formattedFilters);
    }

    // Reset pagination & refetch data
    setPage(0);
    pageRef.current = 0;

    if (isSmallScreen) {
      setFilterModalOpen(false);
    }

    // 🚀 Fetch data with updated filters
    fetchData();
  }, [
    filterValues,
    availableFilters,
    isSmallScreen,
    fetchData,
    onFilterChange,
  ]);

  // ✅ Reset filters completely
  const resetFilters = useCallback(() => {
    // clear filters
    const cleared = {};
    Object.keys(initialFilterValues).forEach((key) => {
      cleared[key] = null;
    });

    setFilterValues(cleared);
    setAppliedFilters(cleared);
    setExportFilters(cleared);
    appliedFiltersRef.current = cleared;

    // 🔥 FORCE RE-MOUNT ALL FILTER COMPONENTS
    setResetKey((prev) => prev + 1);

    if (onFilterChange) {
      onFilterChange(cleared);
    }

    setPage(0);
    pageRef.current = 0;
    fetchData();
  }, [initialFilterValues, fetchData, onFilterChange]);

  // ✅ Remove an individual filter safely
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

      const newFilters = {
        ...appliedFiltersRef.current,
        [filterId]: resetValue,
      };

      setFilterValues((prev) => ({ ...prev, [filterId]: resetValue }));
      setAppliedFilters(newFilters);
      setExportFilters(newFilters);
      appliedFiltersRef.current = newFilters;

      if (onFilterChange) {
        onFilterChange(newFilters);
      }

      setPage(0);
      pageRef.current = 0;
      fetchData();
    },
    [availableFilters, fetchData, onFilterChange]
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
  // Fetch only when queryParam changes, not when fetchData reference changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(queryParam)]);

  // useEffect(() => {
  //   fetchData();
  // }, [queryParam]);

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
      visibleFilters.map((filter) => (
        <Box key={filter.id} sx={{ minWidth: 120 }}>
          {filter.type === "autocomplete" ? (
            <Autocomplete
              options={filter.options || []}
              getOptionLabel={filter.getOptionLabel}
              isOptionEqualToValue={filter.isOptionEqualToValue}
              onInputChange={(e, val) => filter.onSearch?.(val)}
              value={filterValues[filter.id] || null}
              onChange={(e, newValue) => {
                console.log("🟠 Selected value:", newValue);
                handleFilterChange(filter.id, newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={filter.label}
                  variant="outlined"
                />
              )}
            />
          ) : filter.type === "roleuser" ? (
            <RoleUserFilter
              key={resetKey}
              filter={filter}
              value={appliedFilters[filter.id] || ""}
              onChange={handleFilterChange}
            />
          ) : filter.type === "dropdown" ? (
            <FormControl>
              <TextField
                select
                label={filter.label}
                value={filterValues[filter.id] || "All"}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
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
              sx={{
                minWidth: 120,
                fontFamily: "DM Sans, sans-serif",
                "& .MuiInputBase-root": {
                  height: 32, // reduce overall height
                },
                "& input": {
                  padding: "8px 8px", // tighter padding
                  fontSize: "0.85rem",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.8rem",
                },
              }}
            />
          ) : filter.type === "daterange" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 160,
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
                size="md" // ✅ smaller built-in size
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
                  height: 40,
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
                style: {
                  padding: "6px 8px", // ✅ reduces inner padding (default is ~10px 14px)
                  fontSize: "0.85rem", // optional: smaller text for compact look
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 40, // ✅ total input height
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.8rem", // optional: smaller label
                },
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
          colSpan={enableRowSelection ? initialColumns.length + 1 : initialColumns.length} // ✅ colspan adjust करें
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
          colSpan={enableRowSelection ? initialColumns.length + 1 : initialColumns.length} // ✅ colspan adjust करें
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
          backgroundColor: "rgba(254, 254, 254, 1)",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
          borderRadius: "8px",
          marginBottom: "12px",
          display: "table-row",
        }}
        className="table-row"
        onMouseEnter={() => enableActionsHover && setHoveredRow(row.id)}
        onMouseLeave={() => enableActionsHover && setHoveredRow(null)}
      >
        {/* ✅ Conditionally render checkbox cell */}
        {enableRowSelection && (
          <td style={{ padding: "6px 10px", textAlign: "center" }}>
            <input
              type="checkbox"
              checked={selectedRows.some(
                (selectedRow) => selectedRow.id === row.id
              )}
              onChange={() => handleSelectRow(row)}
            />
          </td>
        )}

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
              fontWeight: 600,
              color: "#7e51b2ff",
              border: "none",
            }}
          >
            {column.selector ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {column.selector(row, {
                  hoveredRow,
                  enableActionsHover,
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
          colSpan={enableRowSelection ? initialColumns.length + 1 : initialColumns.length} // ✅ colspan adjust करें
          style={{ padding: 0, border: "none" }}
        ></td>
      </tr>
    </React.Fragment>
  ));
}, [
  loading, 
  data, 
  initialColumns, 
  hoveredRow, 
  enableActionsHover, 
  selectedRows, 
  enableRowSelection // ✅ dependency add करें
]);

 
// Memoized table headers
const tableHeaders = useMemo(() => {
  const headers = [];
  
  // ✅ Conditionally add select-all checkbox header
  if (enableRowSelection) {
    headers.push(
      <th key="select-all" style={{ padding: "12px" }}>
        <input
          type="checkbox"
          checked={
            selectedRows.length > 0 && 
            selectedRows.length === data.length && 
            data.length > 0
          }
          onChange={handleSelectAll}
        />
      </th>
    );
  }
  
  // Regular column headers
  headers.push(
    ...initialColumns.map((column, index) => (
      <th
        key={index}
        style={{
          backgroundColor: "#ebecedff",
          padding: "12px 16px",
          verticalAlign: "middle",
          textAlign: "left",
          fontSize: "14.5px",
          lineHeight: "1.3",
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 600,
          color: "#492077",
          border: "none",
        }}
      >
        {column.name}
      </th>
    ))
  );
  
  return headers;
}, [initialColumns, selectedRows, data, enableRowSelection]); // ✅ enableRowSelection dependency add करें

  // In the table rows section, update the checkbox:
  // <td style={{ padding: "6px 10px", textAlign: "center" }}>
  //   <input
  //     type="checkbox"
  //     checked={selectedRows.includes(row.id)}
  //     onChange={() => handleSelectRow(row.id)}
  //   />
  // </td>;

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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {enhancedCustomHeader}
              </Box>
              {/* <Box sx={{ marginLeft: "auto" }}>{customHeader}</Box> */}
              {/* <Box sx={{ marginLeft: "auto" }}>{enhancedCustomHeader}</Box> */}
            </Box>
            {/* Applied filters chips */}
            {/* <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {appliedFiltersChips}
            </Box> */}
          </Paper>

          {/* Mobile filter + header row */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap", // ✅ ensures no overflow on small screens
              gap: 1,
              mb: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterModalOpen(true)}
              size="small" // ✅ smaller button looks better on mobile
            >
              Filters
            </Button>

            {/* custom header aligned to the right */}
            <Box>{customHeader}</Box>
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
              rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
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
