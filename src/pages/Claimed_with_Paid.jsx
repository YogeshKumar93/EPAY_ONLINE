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

const Claimed_with_Paid = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});
const authCtx = useContext(AuthContext);
const user = authCtx?.user;

  // const [filters, setFilters] = useState({
  //   userId: "",
  //   status: "claimed",
  //   date: {},
  //   dateVal: "",
  // });

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

  const handleDelete = (row) => {
    setSelectedClaim(row);
    setOpenDelete(true);
  };

   const filters = useMemo(
      () => [
        { id: "bank_name", label: "Bank Name", type: "textfield" },
        { id: "id", label: "Id", type: "textfield" },
        { id: "particulars", label: "Particulars", type: "textfield" },
        { id: "handle_by", label: "Handle By", type: "textfield" },
        { id: "daterange", type: "daterange" },
      ],
      [user?.role,appliedFilters]
    );
  
     const filterRows = (rows) => {
      if (!searchTerm) return rows;
      const lowerSearch = searchTerm.toLowerCase();
      return rows.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
    };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        user_id: filters.userId,
        status: filters.status,
        date_from: filters.date.start || "",
        date_to: filters.date.end || "",
      }).toString();

      const response = await apiCall(
        `${ApiEndpoints.GET_UNCLAIMED_ENTERIES}`
      );

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

  useEffect(() => {
    fetchEntries();
  }, []);

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "80px" },
    { name: "Bank ID", selector: (row) => row.bank_id },
    {
      name: (
        <DateRangePicker
          showOneCalendar
          placeholder="Date"
          ranges={predefinedRanges}
          value={filters.dateVal}
          onChange={(value) => {
            if (!value) {
              setFilters({ ...filters, date: {}, dateVal: "" });
              fetchEntries();
              return;
            }
            const dates = { start: value[0], end: value[1] };
            setFilters({
              ...filters,
              date: { start: yyyymmdd(dates.start), end: yyyymmdd(dates.end) },
              dateVal: value,
            });
            fetchEntries();
          }}
          style={{ width: 200 }}
        />
      ),
      selector: (row) => row.date,
    },
    { name: "Particulars", selector: (row) => capitalize1(row.particulars) },
    { name: "Handled By", selector: (row) => row.handle_by },
    { name: "Credit", selector: (row) => (
      <span style={{color:"green"}}>
    {  currencySetter(row.credit) }
    </span>
    )},
    { name: "Debit", selector: (row) => (
      <span style={{color:"red"}}>
      {currencySetter(row.debit)}
    </span>
    )},
    { name: "Balance", selector: (row) => currencySetter(row.balance) },
    { name: "Mode", selector: (row) => row.mop },
    { name: "Remark", selector: (row) => row.remark || "-" },

     {
        name: "Status",
        selector: (row) => {
          const statusConfig = {
            0: {
              label: "Unclaimed",
              color: "#a01309ff",
              bg: "#e2a5a1ff",
            },
            1: {
             label: "Claimed",
              color: "green",
              bg: "#b7e8e0ff",
            },
            2:{
               label: "Paid",
              color: "#e9ebf0ff",
              bg: "#2431baff",
            }
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
            queryParam={`status=2`}
              filters={filters}  
             transformData={filterRows} 
          />

         
        </Box>
      )}
    </>
  );
};

export default Claimed_with_Paid;
