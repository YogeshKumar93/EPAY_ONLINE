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
import { secondaryColor } from "../utils/setThemeColor";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteClaimed from "./DeleteClaimed";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

const ConfirmClaimModal = ({ open, handleClose, onConfirm, row, selectedRows }) => {
  
  // Normalize rows so it always becomes an array
  const rowsArray = Array.isArray(row) ? row : row ? [row] : [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontSize: "1.4rem", fontWeight: 600 }}>
        Confirm Action
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <span style={{ fontSize: "1.2rem" }}>
          {rowsArray.length === 0 ? (
            <>No row selected!</>
          ) : rowsArray.length === 1 ? (
            <>
              Are you sure you want to make <b>ID {rowsArray[0]?.id}</b> as paid?
            </>
          ) : (
            <>
              Are you sure you want to make <b>{rowsArray.length} entries</b>{" "}
              (IDs: {rowsArray.map((r) => r.id).join(", ")}) as paid?
            </>
          )}
        </span>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          color="error"
          variant="outlined"
          sx={{ fontSize: "1rem" }}
        >
          Cancel
        </Button>

        <Button
          onClick={() => onConfirm(rowsArray)}
          color="primary"
          variant="contained"
          sx={{ fontSize: "1rem" }}
        >
          Yes, I'm sure
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const Claimed = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
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
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [rowToConfirm, setRowToConfirm] = useState(null);

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

  // ------------------ MARK SINGLE ROW AS CLAIMED ------------------
  const handleUpdateClaimed = async (rows) => {
    try {
      const payload = {
        api_token: user.api_token,
        entries: rows.map((r) => ({ id: r.id })),
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
      setSelectedRows([]);
    } catch (err) {
      showToast("error", "Something went wrong");
    }
  };

  // ------------------ FETCH ENTRIES ------------------
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
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // ------------------ FILTER CHANGE ------------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ userId: "", status: "unclaimed", date: {}, dateVal: "" });
    fetchEntries();
  };

  // ------------------ TABLE COLUMNS ------------------
  const columns = useMemo(() => {
    const baseColumns = [
      {
        name: "ID",
        selector: (row) => (
          <div style={{ fontSize: "12px", fontWeight: 600 }}>{row.id}</div>
        ),
        width: "80px",
        center: true,
      },

      {
        name: "Bank ID",
        selector: (row) => (
          <div style={{ fontSize: "12px", fontWeight: 600 }}>{row.bank_id}</div>
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
                date: {
                  start: yyyymmdd(value[0]),
                  end: yyyymmdd(value[1]),
                },
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
          <div style={{ fontSize: "12px", fontWeight: 600 }}>
            {capitalize1(row.particulars)}
          </div>
        ),
        wrap: true,
        minWidth: "120px",
      },

      {
        name: "Handled By",
        selector: (row) => (
          <div style={{ fontSize: "12px", fontWeight: 600 }}>
            {row.handle_by}
          </div>
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
          <div style={{ fontSize: "12px", fontWeight: 600 }}>{row.mop}</div>
        ),
        width: "80px",
        center: true,
      },

      {
        name: "Remark",
        selector: (row) => (
          <div style={{ fontSize: "12px" }}>{row.remark || "-"}</div>
        ),
        wrap: true,
        minWidth: "100px",
      },

      {
        name: "Status",
        selector: (row) => {
          const statusConfig = {
            0: {
              label: "Unclaimed",
              color: "#CC7000",
              bg: "#FFF4E5",
            },
            1: {
              label: "Claimed",
              color: "#C40000",
              bg: "#FFE5E5",
            },
          };

          const cfg = statusConfig[row.status] || statusConfig[0];

          return (
            <button
              style={{
                padding: "4px 10px",
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
          <IconButton
            color="primary"
            onClick={() => {
              setRowToConfirm(row);
              setOpenConfirm(true);
            }}
            size="small"
            title="Mark as Claimed"
          >
            <CheckCircleOutlineIcon />
          </IconButton>
        ),
        center: true,
        width: "90px",
      },
    ];

    return [...baseColumns];
  }, [filters, user]);

  // ------------------ ADD SELECTION COLUMN ------------------
  const columnsWithSelection = useMemo(() => {
    return [
      {
        name: "",
        width: "40px",
        selector: (row) => (
          <input
            type="checkbox"
            checked={selectedRows.some((r) => r.id === row.id)}
            onChange={() => {
              const exists = selectedRows.some((r) => r.id === row.id);
              setSelectedRows(
                exists
                  ? selectedRows.filter((r) => r.id !== row.id)
                  : [...selectedRows, row]
              );
            }}
          />
        ),
      },
      ...columns,
    ];
  }, [selectedRows, columns]);

  return (
    <>
      <CommonLoader loading={loading} text="Loading Unclaimed Entries..." />

      {!loading && (
        <Box>
          <CommonTable
            onFetchRef={handleFetchRef}
            endpoint={ApiEndpoints.GET_ENTRIES}
            queryParam={"status=1"}
            columns={columnsWithSelection}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            customHeader={
              <Box sx={{ display: "flex", gap: 1, padding: "8px" }}>
                {selectedRows.length > 0 && (
                  <Tooltip title="Mark selected as claimed">
                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"
                      onClick={() => {
                        if (selectedRows.length === 0) {
                          showToast("error", "Please select entries");
                          return;
                        }

                        setRowToConfirm(selectedRows); // store selected rows in state
                        setOpenConfirm(true); // open modal
                      }}
                    >
                      <SyncAltIcon sx={{ fontSize: 20, mr: 1 }} />
                      TRANSFER CWP
                    </Button>
                  </Tooltip>
                )}
              </Box>
            }
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

          <ConfirmClaimModal
            open={openConfirm}
            handleClose={() => setOpenConfirm(false)}
            row={rowToConfirm}
            onConfirm={(rows) => {
              setOpenConfirm(false);
              handleUpdateClaimed(rows);
            }}
          />
        </Box>
      )}
    </>
  );
};

export default Claimed;
