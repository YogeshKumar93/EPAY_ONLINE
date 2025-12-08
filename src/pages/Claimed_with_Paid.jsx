import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DateRangePicker } from "rsuite";
import CommonTable from "../components/common/CommonTable";
import CommonLoader from "../components/common/CommonLoader";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import predefinedRanges from "../utils/predefinedRanges";
import { yyyymmdd } from "../utils/DateUtils";
import { capitalize1 } from "../utils/TextUtil";
import { currencySetter } from "../utils/Currencyutil";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteClaimed from "./DeleteClaimed";
import AuthContext from "../contexts/AuthContext";
import debounce from "lodash.debounce";
import { useToast } from "../utils/ToastContext";
import { fi } from "date-fns/locale";

const Claimed_with_Paid = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ADDED: Missing state
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

  const fetchEntriesRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchEntriesRef.current = fetchFn;
  };

  const refreshEntries = () => {
    if (fetchEntriesRef.current) fetchEntriesRef.current();
  };

  const handlePrint = (row) => {
    localStorage.setItem("PRINT_DATA", JSON.stringify(row));
    window.open("/print-claimedreceipt", "_blank");
  };

  // Debounced search for handle_by

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

  // Filters - FIXED dependency array
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
          if (typeof option === "string") return option;
          return option?.label || option?.establishment || "";
        },
        isOptionEqualToValue: (option, value) => {
          if (!option || !value) return false;
          if (option.id && value.id) return option.id === value.id;
          if (option.value && value.value) return option.value === value.value;
          return option === value;
        },
      },
      {
        id: "daterange",
        type: "daterange",
        // label: "Date Range",
         autoToday: true,
      },
    ];

    return baseFilters;
  }, [userOptions]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await apiCall("POST", ApiEndpoints.GET_ENTRIES, {
        status: 2,
      });

      if (response?.data?.success) {
        setEntries(response.data.entries || []);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Optional: initial fetch if needed
  useEffect(() => {
    fetchEntries(); // Commented out since CommonTable handles it
  }, []);

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "80px" },
    { name: "Bank ID", selector: (row) => row.bank_id },
     { name: "Bank Name", selector: (row) => row.bank_name },
    {
      name: "Date", // CHANGED: Removed DateRangePicker from header
      selector: (row) => (
        <Tooltip title={formatLogDate(row.updated_at)} arrow>
          <span>{formatLogDate(row.created_at)}</span>
        </Tooltip>
      ),
    },
    { name: "Particulars", selector: (row) => capitalize1(row.particulars) },
    { name: "Handle By", selector: (row) => row.handle_by },
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
    { name: "Mode", selector: (row) => row.mop },
    { name: "Remark", selector: (row) => row.remark || "-" },
    {
      name: "Status",
      selector: (row) => {
        const statusConfig = {
          0: { label: "Unclaimed", color: "#a01309ff", bg: "#e2a5a1ff" },
          1: { label: "Claimed", color: "green", bg: "#b7e8e0ff" },
          2: { label: "Paid", color: "#e9ebf0ff", bg: "#2431baff" },
        };
        const cfg = statusConfig[row.status] || statusConfig[0];
        return (
          <button
            style={{
              padding: "8px 15px",
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
    {
      name: "Actions",
      selector: (row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <IconButton
            size="small"
            onClick={() => handlePrint(row)}
            sx={{ color: "#6C4BC7" }}
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        </div>
      ),
      width: "100px",
    },
  ];

  return (
    <>
      <CommonLoader loading={loading} text="Loading Paid Claims..." />

      {!loading && (
        <Box>
          <CommonTable
            onFetchRef={handleFetchRef}
            endpoint={ApiEndpoints.GET_ENTRIES}
            columns={columns}
            filters={filters}
            queryParam={{ status: 2 }}
            defaultPageSize={15}
            refreshInterval={0}
          />
        </Box>
      )}
    </>
  );
};

export default Claimed_with_Paid;
