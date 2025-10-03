import { useMemo, useContext, useState, useRef, useEffect } from "react";
import { Box, Button, Tooltip, Chip, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import {
  afterToday,
  datemonthYear,
  datemonthYear1,
  dateToTime,
  ddmmyy,
  predefinedRanges,
  yyyymmdd,
} from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import { FileDownload } from "@mui/icons-material";

import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";
import AuthContext from "../contexts/AuthContext";
import CreateAccountStatement from "./CreateAccountStatement";
import UpdateAccountStatement from "./UpdateAccountStatement";
import { useLocation, useParams } from "react-router-dom";
import { excelIcon } from "../iconsImports";
import { Banking } from "./Banking";
import { Delete } from "@mui/icons-material";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { apiCall } from "../api/apiClient";
import { useToast } from "../utils/ToastContext";
import { DateRangePicker } from "rsuite";

const AccountStatement = ({ filters = [] }) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openDelete, setOpenDelete] = useState(false);
  const { showToast } = useToast();
  const { id } = useParams;
  const location = useLocation();
  const account_id = location.state?.account_id || id;
  const balance = location.state?.balance || 0;
  const user_id = location.state?.user_id || 0;
  const fetchUsersRef = useRef(null);
  const [filterValues, setFilterValues] = useState({ date: {}, dateVal: "" });
  const [query, setQuery] = useState(`account_id=${account_id}`);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };

  const handleSaveCreate = () => {
    setOpenCreate(false);
    refreshUsers();
  };

  const handleSaveUpdate = () => {
    setOpenUpdate(false);
  };

  useEffect(() => {
    if ((account_id, balance)) {
      setLoading(false);
    }
  }, [account_id, balance]);
  console.log("bal;amce", balance);
  const handleConfirmDelete = async () => {
    try {
      setOpenDelete(false); // close modal immediately or after API
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.DELETE_ACCOUNT_STATEMENT,
        { user_id: user?.id }
      );

      if (response) {
        showToast(response?.message || "Last statement deleted", "success");
        refreshUsers(); // refresh the table after deletion
      } else {
        showToast(error?.message || "Failed to delete statement", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Id",
        selector: (row) => (
          <Tooltip title={row?.account_id}>
            <div style={{ textAlign: "left" }}>{row?.account_id}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: (
          <div>
            <DateRangePicker
              showOneCalendar
              placeholder="Date"
              size="xs"
              cleanable
              ranges={predefinedRanges}
              value={filterValues.dateVal}
              onChange={(value) => {
                if (!value || value.length === 0) {
                  // Reset date filter
                  setFilterValues({
                    ...filterValues,
                    date: { start: "", end: "" },
                    dateVal: null,
                  });

                  // Update query without dates
                  const newQuery = `account_id=${account_id}`;
                  setQuery(newQuery);

                  // Trigger table refresh with updated query
                  fetchUsersRef.current?.(newQuery);
                  return;
                }

                const dateVal = value;
                const dates = {
                  start: dateVal[0],
                  end: dateVal[1],
                };

                // Update local filter state
                setFilterValues({
                  ...filterValues,
                  date: {
                    start: yyyymmdd(dates.start),
                    end: yyyymmdd(dates.end),
                  },
                  dateVal,
                });

                // Build new query including date range
                const newQuery = `account_id=${account_id}&start=${yyyymmdd(
                  dates.start
                )}&end=${yyyymmdd(dates.end)}`;
                setQuery(newQuery);

                // Trigger table refresh with new query
                fetchUsersRef.current?.(newQuery);
              }}
              disabledDate={afterToday()}
              style={{ width: 200 }}
            />
          </div>
        ),
        selector: (row) => datemonthYear(row.created_at),
        // width: "200px",
      },
      {
        name: "By",
        selector: (row) => (
          <Tooltip title={row?.bank_id}>
            <div style={{ textAlign: "left" }}>{row?.created_by}</div>
          </Tooltip>
        ),
        width: "150px",
      },

      {
        name: "Particulars",
        selector: (row) => (
          <Tooltip title={row?.particulars}>
            <div style={{ textAlign: "left" }}>{row?.particulars || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Remarks",
        selector: (row) => (
          <Tooltip title={row?.remarks}>
            <div style={{ textAlign: "left" }}>{row?.remarks}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      // {
      //   name: "Bank Id",
      //   selector: (row) => (
      //     <Tooltip title={row?.bank_id}>
      //       <div style={{ textAlign: "left" }}>{row?.bank_id}</div>
      //     </Tooltip>
      //   ),
      //   width: "150px",
      // },
      {
        name: "Credit",
        selector: (row) => (
          <Tooltip title={row?.credit}>
            <div style={{ textAlign: "left" }}>{row?.credit || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Debit",
        selector: (row) => (
          <Tooltip title={row?.debit}>
            <div style={{ textAlign: "left" }}>{row?.debit || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Balance",
        selector: (row) => (
          <Tooltip title={row?.balance}>
            <div style={{ textAlign: "left" }}>{row?.balance || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },

      //       {
      //         name: "Status",
      //         selector: (row) =>
      //  <CommonStatus value={row.is_active} />
      //       },
      // {
      //   name: "Actions",
      //   selector: (row) => (
      //     <IconButton
      //       color="primary"
      //       onClick={() => {
      //         setSelectedService(row);
      //         setOpenEdit(true);
      //       }}
      //     >
      //       <Edit />
      //     </IconButton>
      //   ),
      //   width: "100px",
      // },
    ],
    []
  );

  return (
    <Box>
      <CreateAccountStatement
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        handleSave={handleSaveCreate}
        onFetchRef={refreshUsers}
        accountId={account_id}
        balance={balance}
      />

      <CommonTable
        onFetchRef={handleFetchRef}
        columns={columns}
        endpoint={ApiEndpoints.GET_ACCOUNT_STATEMENTS}
        filters={filters}
        Button={Button}
        queryParam={query} // <-- now reactive
        customHeader={
          <Box display="flex" alignItems="center" gap={1}>
            {/* Excel Export Button */}
            <Tooltip title="Export to Excel">
              <IconButton
                color="primary"
                onClick={() => {
                  console.log("Export to Excel clicked");
                }}
              >
                <img
                  src={excelIcon} // your Excel image
                  alt="Excel"
                  style={{ width: 24, height: 24 }}
                />
              </IconButton>
            </Tooltip>

            {/* Delete Button */}
            <Tooltip title="Delete Last Transaction">
              <IconButton color="error" onClick={() => setOpenDelete(true)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />

      <UpdateAccountStatement
        open={openUpdate}
        row={selectedAccount}
        handleClose={() => {
          setOpenUpdate(false);
        }}
        handleSave={handleSaveUpdate}
        onFetchRef={refreshUsers}
      />
      <DeleteConfirmationModal
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        onFetchRef={refreshUsers}
        userId={user?.id}
      />
    </Box>
  );
};

export default AccountStatement;
