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
  setSummary = () => {},
  refresh = true,
  customHeader = null,
  rowHoverHandlers,
  rowProps,
  enableActionsHover = true,
  onFilterChange,
  enableExcelExport = false,
  exportFileName = "TableData",
  exportEndpoint,
  exportPayload,
  onSelectionChange,
  selectedRows = [],
  onExportComplete,
  enableRowSelection = false,
}) => {
  const { afterToday } = DateRangePicker;
  const [hoveredRow, setHoveredRow] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const authCtx = useContext(AuthContext);
  const [exportFilters, setExportFilters] = useState({});
  const [resetKey, setResetKey] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const allRowIds = useMemo(() => data.map((row) => row.id), [data]);
  const user = authCtx?.user;

  // Use refs to track values without causing re-renders
  const appliedFiltersRef = useRef({});
  const pageRef = useRef(0);
  const rowsPerPageRef = useRef(defaultPageSize);
  const refreshIntervalRef = useRef(refreshInterval);
  const hasFetchedInitialData = useRef(false);
  const fetchDataRef = useRef(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Initialize filter values - मेमोइज्ड
  const initialFilterValues = useMemo(() => {
    const values = {};
    availableFilters?.forEach((filter) => {
      if (filter.type === "dropdown") {
        values[filter.id] = "All";
      } else if (filter.type === "date") {
        if (filter.autoToday === true) {
          const today = new Date();
          values[filter.id] = today.toISOString().split("T")[0];
        } else {
          values[filter.id] = "";
        }
      } else if (filter.type === "daterange") {
        if (filter.autoToday === true) {
          const today = new Date();
          const todayStr = today.toISOString().split("T")[0];
          values[filter.id] = {
            start: todayStr,
            end: todayStr,
            value: [today, today],
          };
        } else {
          values[filter.id] = { start: "", end: "", value: null };
        }
      } else {
        values[filter.id] = "";
      }
    });
    return values;
  }, [availableFilters]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      onSelectionChange?.(data);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (row) => {
    const isSelected = selectedRows.some(
      (selectedRow) => selectedRow.id === row.id
    );
    const newSelectedRows = isSelected
      ? selectedRows.filter((selectedRow) => selectedRow.id !== row.id)
      : [...selectedRows, row];
    onSelectionChange?.(newSelectedRows);
  };

  const { handleExportExcel } = useExcelExport();

  const enhancedCustomHeader = useMemo(
    () => (
      <>
        {customHeader}
        {enableExcelExport && (
          <ExportExcelButton
            endpoint={exportEndpoint || endpoint}
            appliedFilters={{ ...exportFilters, ...exportPayload }}
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
      if (!filter.roles) return true;
      return filter.roles.includes(user?.role);
    });
  }, [availableFilters, user?.role]);

  // 🔴 MAIN FETCH DATA FUNCTION - useRef के साथ
  const fetchData = useCallback(
    async (isManualRefresh = false) => {
  
      setLoading(true);
      setError(null);

      const currentAppliedFilters = appliedFiltersRef.current;
      const currentPage = pageRef.current;
      const currentRowsPerPage = rowsPerPageRef.current;

      console.log("📡 Fetching data with filters:", currentAppliedFilters);

      // Prepare params for API call
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

      // Handle queryParam
      let finalEndpoint = endpoint;
      let finalRequestBody = requestBody;

      if (typeof queryParam === "string" && queryParam.trim() !== "") {
        finalEndpoint = `${endpoint}?${queryParam}`;
      } else if (
        typeof queryParam === "object" &&
        queryParam !== null &&
        Object.keys(queryParam).length > 0
      ) {
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
          finalRequestBody
        );

        if (apiError) {
          setError(apiError.message || "Failed to fetch data");
        } else {
          if (response) {
            let normalizedData =
              response?.data?.data || response?.data || response || [];

            const dataWithSerial = Array.isArray(normalizedData)
              ? normalizedData.map((item, index) => ({
                  ...item,
                  serialNo: index + 1,
                }))
              : [{ ...normalizedData, serialNo: 1 }];

            let total =
              response?.data?.total ||
              response?.total ||
              normalizedData?.length ||
              0;
            setSummary(response?.data?.summary ?? []);
            setData(dataWithSerial);
            setTotalCount(total);
          } else if (Array.isArray(response)) {
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
    [endpoint, queryParam, initialized]
  );

  // Store fetchData in ref
  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  // Update refs when state changes
  useEffect(() => {
    appliedFiltersRef.current = appliedFilters;
    pageRef.current = page;
    rowsPerPageRef.current = rowsPerPage;
    refreshIntervalRef.current = refreshInterval;
  }, [appliedFilters, page, rowsPerPage, refreshInterval]);

  // 🔴 SINGLE INITIALIZATION useEffect
  useEffect(() => {
    // Skip if already initialized
    if (hasFetchedInitialData.current) return;

    console.log("🟡 Initializing filters...");

    // Set UI filter values
    setFilterValues(initialFilterValues);

    // Create API-ready filters
    const apiReadyFilters = {};

    // Convert initialFilterValues to API format
    Object.keys(initialFilterValues).forEach((key) => {
      const filterConfig = availableFilters.find((f) => f.id === key);
      const val = initialFilterValues[key];

      if (filterConfig?.type === "daterange" && val) {
        if (filterConfig.autoToday === true && val.start && val.end) {
          apiReadyFilters["from_date"] = val.start;
          apiReadyFilters["to_date"] = val.end;
        }
      } else if (filterConfig?.type === "date" && val) {
        if (filterConfig.autoToday === true) {
          apiReadyFilters[key] = val;
        }
      } else if (val && val !== "All" && val !== "") {
        apiReadyFilters[key] = val;
      }
    });

    console.log("🟢 Initial API filters:", apiReadyFilters);

    // Set all filter states
    setAppliedFilters(apiReadyFilters);
    setExportFilters(apiReadyFilters);
    appliedFiltersRef.current = apiReadyFilters;

    // Mark as initialized
    setInitialized(true);

    // Fetch initial data
    console.log("🚀 Fetching initial data...");
    const fetchInitial = async () => {
      await fetchData();
      hasFetchedInitialData.current = true;
    };

    fetchInitial();
  }, []); // 🔴 EMPTY DEPENDENCY ARRAY - RUNS ONLY ONCE

  // Setup refresh interval
  useEffect(() => {
    let intervalId;
    if (refreshInterval > 0 && initialized) {
      console.log("⏰ Setting up refresh interval");
      intervalId = setInterval(() => {
        if (fetchDataRef.current) {
          fetchDataRef.current();
        }
      }, refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshInterval, initialized]);

  const handleFilterChange = (id, value) => {
    console.log("🟢 [Table] Filter change:", id, value);
    setFilterValues((prev) => ({ ...prev, [id]: value }));
    setAppliedFilters((prev) => ({ ...prev, [id]: value }));
  };

  const applyFilters = useCallback(() => {
    if (!initialized) return;

    console.log("🔍 [Table] applyFilters called with:", filterValues);
    const formattedFilters = { ...filterValues };

    Object.keys(formattedFilters).forEach((key) => {
      const filterConfig = availableFilters.find((f) => f.id === key);
      const val = formattedFilters[key];

      if (val === "" || val === null || val === undefined || val === "All") {
        delete formattedFilters[key];
        return;
      }

      if (filterConfig?.type === "roleuser" && val) {
        formattedFilters[key] =
          typeof val === "object" ? val.id || val.id || val : val;
        return;
      }

      if (
        (filterConfig?.type === "dropdown" ||
          filterConfig?.type === "autocomplete") &&
        val
      ) {
        if (filterConfig?.type === "autocomplete" && typeof val === "object") {
          formattedFilters[key] = val.value || val.id || val;
        } else {
          formattedFilters[key] = val.id || val.value || val;
        }
      }

      if (filterConfig?.type === "date" && val) {
        formattedFilters[key] = new Date(val).toISOString().split("T")[0];
      }

      if (filterConfig?.type === "daterange" && val) {
        let startDate = val.start;
        let endDate = val.end;

        if (startDate && startDate.trim() !== "") {
          formattedFilters["from_date"] = new Date(startDate)
            .toISOString()
            .split("T")[0];
        }
        if (endDate && endDate.trim() !== "") {
          formattedFilters["to_date"] = new Date(endDate)
            .toISOString()
            .split("T")[0];
        }

        delete formattedFilters[key];
      }
    });

    console.log("✅ [Table] Final formatted filters:", formattedFilters);

    setAppliedFilters(formattedFilters);
    setExportFilters(formattedFilters);
    appliedFiltersRef.current = formattedFilters;

    if (onFilterChange) {
      onFilterChange(formattedFilters);
    }

    setPage(0);
    pageRef.current = 0;

    if (isSmallScreen) {
      setFilterModalOpen(false);
    }

    // Call fetchData
    if (fetchDataRef.current) {
      fetchDataRef.current();
    }
  }, [
    filterValues,
    availableFilters,
    isSmallScreen,
    onFilterChange,
    initialized,
  ]);

  const resetFilters = useCallback(() => {
    if (!initialized) return;

    console.log("🔄 [Table] Resetting filters...");

    // Reset to initial values
    setFilterValues(initialFilterValues);

    // Extract just the API-ready filters from initialFilterValues
    const apiReadyFilters = {};

    Object.keys(initialFilterValues).forEach((key) => {
      const filterConfig = availableFilters.find((f) => f.id === key);
      const val = initialFilterValues[key];

      if (filterConfig?.type === "daterange" && val) {
        if (filterConfig.autoToday === true && val.start && val.end) {
          apiReadyFilters["from_date"] = val.start;
          apiReadyFilters["to_date"] = val.end;
        }
      } else if (filterConfig?.type === "date" && val) {
        if (filterConfig.autoToday === true) {
          apiReadyFilters[key] = val;
        }
      } else if (val && val !== "All" && val !== "") {
        apiReadyFilters[key] = val;
      }
    });

    setAppliedFilters(apiReadyFilters);
    setExportFilters(apiReadyFilters);
    appliedFiltersRef.current = apiReadyFilters;

    setResetKey((prev) => prev + 1);

    if (onFilterChange) {
      onFilterChange(apiReadyFilters);
    }

    setPage(0);
    pageRef.current = 0;

    // Call fetchData
    if (fetchDataRef.current) {
      fetchDataRef.current();
    }
  }, [initialFilterValues, availableFilters, onFilterChange, initialized]);

  const removeFilter = useCallback(
    (filterId) => {
      if (!initialized) return;

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

      // Call fetchData
      if (fetchDataRef.current) {
        fetchDataRef.current();
      }
    },
    [availableFilters, onFilterChange, initialized]
  );

  const handleChangePage = useCallback(
    (event, newPage) => {
      if (!initialized) return;
      setPage(newPage);
      pageRef.current = newPage;
      if (fetchDataRef.current) {
        fetchDataRef.current();
      }
    },
    [initialized]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      if (!initialized) return;
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      rowsPerPageRef.current = newRowsPerPage;
      setPage(0);
      pageRef.current = 0;
      if (fetchDataRef.current) {
        fetchDataRef.current();
      }
    },
    [initialized]
  );

  const handleManualRefresh = useCallback(() => {
    if (fetchDataRef.current) {
      fetchDataRef.current(true);
    }
  }, []);

  // Provide fetchData to parent
  useEffect(() => {
    if (onFetchRef) onFetchRef(fetchDataRef.current);
  }, [onFetchRef]);

  // Fetch when queryParam changes
  useEffect(() => {
    if (initialized && hasFetchedInitialData.current) {
      console.log("🔄 Query param changed, refetching...");
      if (fetchDataRef.current) {
        fetchDataRef.current();
      }
    }
  }, [JSON.stringify(queryParam), initialized]);

  // Rest of your render functions remain the same...
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

  const appliedFiltersChips = useMemo(
    () =>
      Object.entries(appliedFilters)
        .filter(([key, value]) => {
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
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                return filter.getOptionLabel
                  ? filter.getOptionLabel(option)
                  : option.label || option.value || "";
              }}
              isOptionEqualToValue={(option, value) => {
                if (filter.isOptionEqualToValue) {
                  return filter.isOptionEqualToValue(option, value);
                }
                if (!option || !value) return false;
                if (typeof option === "object" && typeof value === "object") {
                  return option.id === value.id || option.value === value.value;
                }
                return option === value;
              }}
              onInputChange={(e, val) => filter.onSearch?.(val)}
              value={(() => {
                const currentValue = filterValues[filter.id];
                if (!currentValue) return null;

                if (
                  typeof currentValue === "string" ||
                  typeof currentValue === "number"
                ) {
                  const foundOption = filter.options?.find(
                    (opt) =>
                      opt.id === currentValue || opt.value === currentValue
                  );
                  return foundOption || currentValue;
                }

                return currentValue;
              })()}
              onChange={(e, newValue) => {
                console.log("🟠 Autocomplete selected:", newValue);
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
                  height: 32,
                },
                "& input": {
                  padding: "8px 8px",
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
                  padding: "6px 8px",
                  fontSize: "0.85rem",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 40,
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.8rem",
                },
              }}
            />
          )}
        </Box>
      )),
    [visibleFilters, filterValues, handleFilterChange, resetKey, appliedFilters]
  );

  // Memoized table rows
  const tableRows = useMemo(() => {
    if (loading) {
      return (
        <tr>
          <td
            colSpan={
              enableRowSelection
                ? initialColumns.length + 1
                : initialColumns.length
            }
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
            colSpan={
              enableRowSelection
                ? initialColumns.length + 1
                : initialColumns.length
            }
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

        <tr style={{ height: "12px", backgroundColor: "transparent" }}>
          <td
            colSpan={
              enableRowSelection
                ? initialColumns.length + 1
                : initialColumns.length
            }
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
    enableRowSelection,
  ]);

  const tableHeaders = useMemo(() => {
    const headers = [];

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
  }, [initialColumns, selectedRows, data, enableRowSelection]);

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
              }}
            >
              {renderDesktopFilters()}
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
            </Box>
          </Paper>

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterModalOpen(true)}
              size="small"
            >
              Filters
            </Button>

            <Box>{customHeader}</Box>
          </Box>

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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h5">{title}</Typography>
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
                  />
                </thead>

                <tbody>{tableRows}</tbody>
              </table>
            </Box>

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
