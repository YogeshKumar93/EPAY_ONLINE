import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { useNavigate } from "react-router-dom";
import DeleteClaimed from "./DeleteClaimed";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

/* ---------------- CONFIRM MODAL ---------------- */
const ConfirmClaimModal = ({ open, handleClose, onConfirm, row }) => {
  const rowsArray = Array.isArray(row) ? row : row ? [row] : [];

  const extractId = (r) => r?.id || r?.original?.id || r?._id;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontSize: "1.4rem", fontWeight: 600 }}>
        Confirm Action
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <span style={{ fontSize: "1.2rem" }}>
          {rowsArray.length === 0 ? (
            <>No row selected!</>
          ) : rowsArray.length === 1 ? (
            <>
              Are you sure you want to mark <b>ID {extractId(rowsArray[0])}</b> as paid?
            </>
          ) : (
            <>
              Are you sure you want to mark <b>{rowsArray.length} entries</b>{" "}
              (IDs: {rowsArray.map((r) => extractId(r)).join(", ")}) as paid?
            </>
          )}
        </span>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>

        <Button
          onClick={() => onConfirm(rowsArray)}
          color="primary"
          variant="contained"
        >
          Yes, I'm sure
        </Button>
      </DialogActions>
    </Dialog>
  );
};


/* ---------------- MAIN PAGE ---------------- */
const Claimed = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  
  const [filter, setFilters] = useState({
    userId: "",
    status: "unclaimed",
    date: {},
    dateVal: "",
  });

  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const { showToast } = useToast();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [rowToConfirm, setRowToConfirm] = useState(null);
    const [appliedFilters, setAppliedFilters] = useState({});

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

  const fetchEntriesRef = useRef(null);
  const handleFetchRef = (fetchFn) => {
    fetchEntriesRef.current = fetchFn;
  };

  const refreshEntries = () =>
    fetchEntriesRef.current && fetchEntriesRef.current();

  const handlePrint = (rows) => {
    localStorage.setItem("PRINT_DATA", JSON.stringify(rows));
    window.open("/print-claimedreceipt", "_blank");
  };

  /* ---------------- UPDATE CLAIMED ---------------- */
const handleUpdateClaimed = async (rows) => {
    try {
      const normalizedRows = rows.map((r) => ({
        id: r?.id ?? r?.original?.id ?? r?.entry_id ?? r?.bank_id,
      }));

      console.log("Final API rows:", normalizedRows); // Debug log

      const payload = {
        api_token: user.api_token,
        entries: normalizedRows,
      };

      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_CLAIMED_ENTRIES,
        payload
      );

      if (error) {
        showToast("error", error?.message || "API failed");
        return;
      }

      showToast("success", response?.message || "Updated successfully");
      refreshEntries();
      setSelectedRows([]); // Clear selection after successful update

      return true;
    } catch {
      showToast("error", "Something went wrong");
      return false;
    }
  };

  /* ---------------- FETCH ENTRIES ---------------- */
  const fetchEntries = async () => {
    setLoading(true);

    try {
      const queryParams = new URLSearchParams({
        user_id: filters?.userId,
        status: filters?.status,
        date_from: filters?.date?.start || "",
        date_to: filters?.date?.end || "",
      }).toString();

      const response = await apiCall(
        `${ApiEndpoints.GET_UNCLAIMED_ENTERIES}?${queryParams}`
      );

      setEntries(response?.data?.entries || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  /* ---------------- FILTER CHANGE ---------------- */
  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters((prev) => ({ ...prev, [name]: value }));
  // };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = useMemo(() => {
    const base = [
      {
        name: "ID",
        selector: (row) => (
          <div style={{ fontSize: 12, fontWeight: 600 }}>{row.id}</div>
        ),
        width: "80px",
        center: true,
      },

      {
        name: "Bank ID",
        selector: (row) => (
          <div style={{ fontSize: 12, fontWeight: 600 }}>{row.bank_id}</div>
        ),
        width: "100px",
        center: true,
      },

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
              setFilters({
                ...filters,
                date: { start: yyyymmdd(value[0]), end: yyyymmdd(value[1]) },
                dateVal: value,
              });
              fetchEntries();
            }}
            style={{ width: 200 }}
          />
        ),
        selector: (row) => row.date,
        width: "150px",
      },

      {
        name: "Particulars",
        selector: (row) => (
          <div style={{ fontSize: 12, fontWeight: 600 }}>
            {capitalize1(row.particulars)}
          </div>
        ),
        wrap: true,
        minWidth: "120px",
      },

      {
        name: "Handled By",
        selector: (row) => (
          <div style={{ fontSize: 12, fontWeight: 600 }}>{row.handle_by}</div>
        ),
        wrap: true,
        width: "120px",
      },

      {
        name: "Credit",
        selector: (row) => (
          <span style={{ color: "green", fontWeight: 600 }}>
            {currencySetter(row.credit)}
          </span>
        ),
        right: true,
        width: "100px",
      },

      {
        name: "Debit",
        selector: (row) => (
          <span style={{ color: "red", fontWeight: 600 }}>
            {currencySetter(row.debit)}
          </span>
        ),
        right: true,
        width: "100px",
      },

      {
        name: "Balance",
        selector: (row) => (
          <div style={{ fontWeight: 600 }}>{currencySetter(row.balance)}</div>
        ),
        right: true,
        width: "100px",
      },

      {
        name: "Mode",
        selector: (row) => (
          <div style={{ fontSize: 12, fontWeight: 600 }}>{row.mop}</div>
        ),
        width: "80px",
        center: true,
      },

      {
        name: "Remark",
        selector: (row) => (
          <div style={{ fontSize: 12 }}>{row.remark || "-"}</div>
        ),
        wrap: true,
        minWidth: "100px",
      },

      {
        name: "Status",
        selector: (row) => {
          const statusConfig = {
            0: { label: "Unclaimed", color: "#a01309ff", bg: "#e2a5a1ff" },
            1: { label: "Claimed", color: "#e1eae9ff", bg: "#168276ff" },
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

      {
        name: "Action",
        selector: (row) => (
          <>
            <IconButton
              color="secondary"
              onClick={() => {
                setRowToConfirm(row);
                setOpenConfirm(true);
              }}
              size="small"
              title="Mark as Paid"
            >
              <CheckCircleOutlineIcon />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => handlePrint([row])}
              sx={{ color: "#6C4BC7" }}
            >
              <PrintIcon fontSize="small" />
            </IconButton>
          </>
        ),
      },
    ];

    return base;
  }, [filters, user]);
  console.log("selectedRows", selectedRows);

  return (
    <>
      <CommonLoader loading={loading} text="Loading Unclaimed Entries..." />

      {!loading && (
        <Box>
          <CommonTable
            onFetchRef={handleFetchRef}
            endpoint={ApiEndpoints.GET_ENTRIES}
            queryParam={"status=1"}
            columns={columns}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows} // Set full row objects
                filters={filters}  
             transformData={filterRows}         
            customHeader={
              <Box sx={{ display: "flex", gap: 1, padding: "8px" }}>
                {selectedRows.length > 0 && (
                  <Tooltip title="Mark as claimed">
                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"
                      onClick={() => {
                        if (selectedRows.length === 0) {
                          showToast("error", "Please select entries");
                          return;
                        }
                        setRowToConfirm(selectedRows);
                        setOpenConfirm(true);
                      }}
                    >
                      <SyncAltIcon sx={{ fontSize: 20, mr: 1 }} />
                      Mark as Paid
                    </Button>
                  </Tooltip>
                )}
              </Box>
            }
          />

          {/* DELETE */}
          <DeleteClaimed
            open={openDelete}
            handleClose={() => {
              setOpenDelete(false);
              setSelectedClaim(null);
            }}
            selectedBank={selectedClaim}
            onFetchRef={refreshEntries}
          />

          {/* CONFIRM MODAL WITH AUTO PRINT */}
          <ConfirmClaimModal
            open={openConfirm}
            handleClose={() => setOpenConfirm(false)}
            row={rowToConfirm}
            onConfirm={async (rows) => {
              setOpenConfirm(false);

              const success = await handleUpdateClaimed(rows);

              if (success) {
                handlePrint(rows); // 🔥 PRINT MULTIPLE ROWS TOGETHER
              }
            }}
          />
        </Box>
      )}
    </>
  );
};

export default Claimed;
