import React, { useState, useEffect, useRef,useContext } from "react";
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
import { secondaryColor } from "../utils/setThemeColor";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteClaimed from "./DeleteClaimed";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";


const Claimed = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filters, setFilters] = useState({
    userId: "",
    status: "unclaimed",
    date: {},
    dateVal: "",
  });
const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchEntriesRef = useRef(null);
  const handleFetchRef = (fetchFn) => {
    fetchEntriesRef.current = fetchFn;
  };
  const refreshEntries = () => {
    if (fetchEntriesRef.current) fetchEntriesRef.current();
  };

  const refreshClaims = () => {
    if (fetchEntriesRef.current) {
      fetchEntriesRef.current();
    }
  };
  const handleUpdateClaimed = async (row) => {
    try {
      const payload = {
        api_token: user.api_token,
        entries: [{ id: row.id }],
      };

      console.log("Sending payload:", payload);

      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_CLAIMED_ENTRIES,
        payload
      );

      if (error) {
        showToast("error", error?.message || "API failed");
        return;
      }

      showToast(response?.message || "Entry marked as claimed!","success");
      refreshEntries();
    } catch (err) {
      console.error(err);
      showToast(err?.message || "Something went wrong","error");
    }
  };

  const handlePrint = (row) => {
    localStorage.setItem("PRINT_DATA", JSON.stringify(row));
    window.open("/print-claimedreceipt", "_blank");
  };

  const handleDelete = (row) => {
    setEntries(row);
    setOpenDelete(true);
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
        `${ApiEndpoints.GET_UNCLAIMED_ENTERIES}?${queryParams}`
      );
      if (response?.data?.success) {
        setEntries(response.data.entries || []);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error("Error fetching unclaimed entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ userId: "", status: "unclaimed", date: {}, dateVal: "" });
    fetchEntries();
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "80px" },
    { name: "Bank ID", selector: (row) => row.bank_id },
    {
      name: (
        <DateRangePicker
          showOneCalendar
          placeholder="Date"
          size="medium"
          cleanable
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
    { name: "Credit", selector: (row) => currencySetter(row.credit) },
    { name: "Debit", selector: (row) => currencySetter(row.debit) },
    { name: "Balance", selector: (row) => currencySetter(row.balance) },
    { name: "Mode", selector: (row) => row.mop },
    { name: "Remark", selector: (row) => row.remark || "-" },
    {
      name: "Status",
      selector: (row) => (
        <span
          style={{
            color: row.status === 0 ? "orange" : "red",
            fontWeight: 600,
          }}
        >
          {row.status === 0 ? "Unclaimed" : "Claimed"}
        </span>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <IconButton
          color="primary"
          onClick={() => handleUpdateClaimed(row)}
          title="Mark as Claimed"
        >
          <CheckCircleOutlineIcon />
        </IconButton>
      ),
      width: "90px",
    },
  ];

  return (
    <>
      <CommonLoader loading={loading} text="Loading Unclaimed Entries..." />

      {!loading && (
        <Box>
          <Box
            mb={2}
            sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
          >
          </Box>

          <Box style={{ width: "100%" }}>
            <CommonTable
              onFetchRef={handleFetchRef}
              endpoint={`${ApiEndpoints.GET_ENTRIES}`}
              queryParam={"status=1"}
              columns={columns}
              // loading={loading}
              disableSelectionOnClick
            />

            <DeleteClaimed
              open={openDelete}
              handleClose={() => {
                setOpenDelete(false);
                setSelectedClaim(null);
              }}
              selectedBank={selectedClaim}
              onFetchRef={refreshClaims}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Claimed;
