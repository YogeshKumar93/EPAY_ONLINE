import React, { useState, useEffect, useRef, useContext } from "react";
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

const ConfirmClaimModal = ({ open, handleClose, onConfirm, row }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm" // options: xs, sm, md, lg, xl
    >
      <DialogTitle sx={{ fontSize: "1.4rem", fontWeight: 600 }}>
        Confirm Action
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <span style={{ fontSize: "1.2rem" }}>
          Are you sure you want to make <b>ID {row?.id}</b> as paid?
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
          onClick={() => onConfirm(row)}
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

      showToast(response?.message || "Entry marked as claimed!", "success");
      refreshEntries();
    } catch (err) {
      console.error(err);
      showToast(err?.message || "Something went wrong", "error");
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
    { name: "Credit", selector: (row) =>(
      <span style={{color:"green"}}>
      {currencySetter(row.credit) }
      </span>
    )},
    { name: "Debit", selector: (row) =>(
      <span style={{color:"red"}}>
      {currencySetter(row.debit)}
      </span>
    ) },
    { name: "Balance", selector: (row) => currencySetter(row.balance) },
    { name: "Mode", selector: (row) => row.mop },
    { name: "Remark", selector: (row) => row.remark || "-" },
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
        bg: "#FFE5E5"
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
          ></Box>

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

            <ConfirmClaimModal
              open={openConfirm}
              handleClose={() => setOpenConfirm(false)}
              row={rowToConfirm}
              onConfirm={(row) => {
                setOpenConfirm(false);
                handleUpdateClaimed(row);
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Claimed;
