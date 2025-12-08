import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useContext,
  useCallback,
} from "react";
import { Box, Tooltip } from "@mui/material";
import { DateRangePicker } from "rsuite";
import CommonTable from "../components/common/CommonTable";
import CommonLoader from "../components/common/CommonLoader";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import predefinedRanges from "../utils/predefinedRanges";
import { ddmmyyWithTime, yyyymmdd } from "../utils/DateUtils";
import { capitalize1 } from "../utils/TextUtil";
import { currencySetter } from "../utils/Currencyutil";
import AuthContext from "../contexts/AuthContext";
import { debounce } from "lodash";

const Unclaimed = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const formatLogDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    if (userSearch.length < 3) {
      setUserOptions([]);
      return;
    }

    const fetchUsersByEstablishment = async (searchTerm) => {
      try {
        const { error, response } = await apiCall(
          "POST",
          ApiEndpoints.GET_USER_DEBOUNCE,
          null,
          { establishment: searchTerm }
        );

        console.log("Response from debounce:", response?.data);

        if (!error && response?.data) {
          const options = response.data.map((u) => ({
            id: u.id,
            value: u.id,
            label: u.establishment,

            establishment: u.establishment,
          }));

          setUserOptions(options);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const debouncedFetch = debounce(fetchUsersByEstablishment, 500);
    debouncedFetch(userSearch);

    return () => debouncedFetch.cancel();
  }, [userSearch]);

  const filters = useMemo(() => {
    const baseFilters = [
      { id: "bank_name", label: "Bank Name", type: "textfield" },
      { id: "id", label: "ID", type: "textfield" },
      { id: "particulars", label: "Particulars", type: "textfield" },
      {
        id: "handle_by",
        label: "Handle By",
        type: "autocomplete",
        options: userOptions,
        onSearch: (val) => {
          console.log("Searching for:", val);
          setUserSearch(val);
        },
        getOptionLabel: (option) => {
          // Handle both string and object options
          if (typeof option === "string") return option;
          if (option && option.label) return option.label;
          if (option && option.establishment) return option.establishment;
          return "";
        },
        isOptionEqualToValue: (option, value) => {
          // Handle comparison for selection
          if (!option || !value) return false;
          if (option.id && value.id) return option.id === value.id;
          if (option.value && value.value) return option.value === value.value;
          return option === value;
        },
        // Add this to help with filtering
        filterOptions: (options, { inputValue }) => {
          return options.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
          );
        },
      },
      {
        id: "daterange",
        // label: "Date Range",
        type: "daterange",
      },
    ];

    return baseFilters;
  }, [userOptions]);
  const columns = [
    { name: "ID", selector: (row) => row.id, width: "80px" },
    { name: "Bank ID", selector: (row) => row.bank_id },
    {
      name: "Date",
      selector: (row) => (
        <Tooltip title={formatLogDate(row.updated_at)} arrow>
          <span>{formatLogDate(row.created_at)}</span>
        </Tooltip>
      ),
    },
    { name: "Particulars", selector: (row) => capitalize1(row.particulars) },
    { name: "Handled By", selector: (row) => row.handle_by },
    {
      name: "Credit",
      selector: (row) => (
        <span style={{ color: "green" }}>{currencySetter(row.credit)}</span>
      ),
    },
    {
      name: "Debit",
      selector: (row) => (
        <span style={{ color: "red" }}>{currencySetter(row.debit)}</span>
      ),
    },
    { name: "Balance", selector: (row) => currencySetter(row.balance) },
    { name: "Bank Name", selector: (row) => row.bank_name },
    { name: "Mode", selector: (row) => row.mop },
    { name: "Remark", selector: (row) => row.remark || "-" },
    {
      name: "Status",
      selector: (row) => {
        const statusConfig = {
          0: { label: "Unclaimed", color: "#f4e9e8ff", bg: "#b82419ff" },
          1: { label: "Claimed", color: "green", bg: "#b7e8e0ff" },
          2: { label: "Paid", color: "#0e2d6aff", bg: "#aab0f1ff" },
        };
        const cfg = statusConfig[row.status] || statusConfig[0];
        return (
          <button
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              border: "none",
              backgroundColor: cfg.bg,
              color: cfg.color,
              cursor: "default",
            }}
          >
            {cfg.label}
          </button>
        );
      },
      width: "140px",
    },
  ];

  return (
    <>
      <CommonLoader loading={loading} text="Loading Unclaimed Entries..." />

      {!loading && (
        <Box>
          <CommonTable
            endpoint={ApiEndpoints.GET_UNCLAIMED_ENTERIES}
            columns={columns}
            filters={filters}
            enableRowSelection={false}
            disableSelectionOnClick
            defaultPageSize={15}
          />
        </Box>
      )}
    </>
  );
};

export default Unclaimed;
