// import { useMemo, useContext, useState, useRef, useEffect } from "react";
// import { Box, Button, Tooltip, Chip, IconButton } from "@mui/material";
// import { Edit } from "@mui/icons-material";
// import {
//   afterToday,
//   datemonthYear,
//   datemonthYear1,
//   dateToTime,
//   ddmmyy,
//   predefinedRanges,
//   yyyymmdd,
// } from "../utils/DateUtils";
// import CommonTable from "../components/common/CommonTable";
// import ApiEndpoints from "../api/ApiEndpoints";
// import { FileDownload } from "@mui/icons-material";

// import ReButton from "../components/common/ReButton";
// import CommonStatus from "../components/common/CommonStatus";
// import AuthContext from "../contexts/AuthContext";
// import CreateAccountStatement from "./CreateAccountStatement";
// import UpdateAccountStatement from "./UpdateAccountStatement";
// import { useLocation, useParams } from "react-router-dom";
// import { excelIcon } from "../iconsImports";
// import { Banking } from "./Banking";
// import { Delete } from "@mui/icons-material";
// import DeleteConfirmationModal from "./DeleteConfirmationModal";
// import { apiCall } from "../api/apiClient";
// import { useToast } from "../utils/ToastContext";
// import { DateRangePicker } from "rsuite";

// const AccountStatement = ({ filters = [] }) => {
//   const [openCreate, setOpenCreate] = useState(false);
//   const [openUpdate, setOpenUpdate] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const authCtx = useContext(AuthContext);
//   const user = authCtx?.user;
//   const [openDelete, setOpenDelete] = useState(false);
//   const { showToast } = useToast();
//   const { id } = useParams;
//   const location = useLocation();
//   const account_id = location.state?.account_id || id;
//   const establishment = location.state?.establishment || null;
//    const mobile = location.state?.mobile || null;
//   const balance = location.state?.balance || 0;
//   const user_id = location.state?.user_id || 0;
//   const fetchUsersRef = useRef(null);
//   const [filterValues, setFilterValues] = useState({ date: {}, dateVal: "" });
//   const [query, setQuery] = useState(`account_id=${account_id}`);

//   const handleFetchRef = (fetchFn) => {
//     fetchUsersRef.current = fetchFn;
//   };
//   const refreshUsers = () => {
//     if (fetchUsersRef.current) {
//       fetchUsersRef.current();
//     }
//   };

//   const handleSaveCreate = () => {
//     setOpenCreate(false);
//     refreshUsers();
//   };

//   const handleSaveUpdate = () => {
//     setOpenUpdate(false);
//   };

//   useEffect(() => {
//     if ((account_id, balance)) {
//       setLoading(false);
//     }
//   }, [account_id, balance]);
//   console.log("bal;amce", balance);
//   console.log("establishment", establishment);
//   const handleConfirmDelete = async () => {
//     try {
//       setOpenDelete(false); // close modal immediately or after API
//       const { error, response } = await apiCall(
//         "post",
//         ApiEndpoints.DELETE_ACCOUNT_STATEMENT,
//         { user_id: user?.id }
//       );

//       if (response) {
//         showToast(response?.message || "Last statement deleted", "success");
//         refreshUsers(); // refresh the table after deletion
//       } else {
//         showToast(error?.message || "Failed to delete statement", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showToast("Something went wrong", "error");
//     }
//   };

//   const columns = useMemo(
//     () => [
//       {
//         name: "Id",
//         selector: (row) => (
//           <Tooltip title={row?.account_id}>
//             <div style={{ textAlign: "left" }}>{row?.account_id}</div>
//           </Tooltip>
//         ),
//         wrap: true,
//       },
//       {
//         name: (
//           <div>
//             <DateRangePicker
//               showOneCalendar
//               placeholder="Date"
//               size="xs"
//               cleanable
//               ranges={predefinedRanges}
//               value={filterValues.dateVal}
//               onChange={(value) => {
//                 if (!value || value.length === 0) {
//                   // Reset date filter
//                   setFilterValues({
//                     ...filterValues,
//                     date: { start: "", end: "" },
//                     dateVal: null,
//                   });

//                   // Update query without dates
//                   const newQuery = `account_id=${account_id}`;
//                   setQuery(newQuery);

//                   // Trigger table refresh with updated query
//                   fetchUsersRef.current?.(newQuery);
//                   return;
//                 }

//                 const dateVal = value;
//                 const dates = {
//                   start: dateVal[0],
//                   end: dateVal[1],
//                 };

//                 // Update local filter state
//                 setFilterValues({
//                   ...filterValues,
//                   date: {
//                     start: yyyymmdd(dates.start),
//                     end: yyyymmdd(dates.end),
//                   },
//                   dateVal,
//                 });

//                 // Build new query including date range
//                 const newQuery = `account_id=${account_id}&start=${yyyymmdd(
//                   dates.start
//                 )}&end=${yyyymmdd(dates.end)}`;
//                 setQuery(newQuery);

//                 // Trigger table refresh with new query
//                 fetchUsersRef.current?.(newQuery);
//               }}
//               disabledDate={afterToday()}
//               style={{ width: 200 }}
//             />
//           </div>
//         ),
//         selector: (row) => datemonthYear(row.created_at),
//         // width: "200px",
//       },
//       {
//         name: "By",
//         selector: (row) => (
//           <Tooltip title={row?.bank_id}>
//             <div style={{ textAlign: "left" }}>{row?.created_by}</div>
//           </Tooltip>
//         ),
//         width: "150px",
//       },

//       {
//         name: "Particulars",
//         selector: (row) => (
//           <Tooltip title={row?.particulars}>
//             <div style={{ textAlign: "left" }}>{row?.particulars || "-"}</div>
//           </Tooltip>
//         ),
//         width: "150px",
//       },
//       {
//         name: "Remarks",
//         selector: (row) => (
//           <Tooltip title={row?.remarks}>
//             <div style={{ textAlign: "left" }}>{row?.remarks}</div>
//           </Tooltip>
//         ),
//         wrap: true,
//       },
//       // {
//       //   name: "Bank Id",
//       //   selector: (row) => (
//       //     <Tooltip title={row?.bank_id}>
//       //       <div style={{ textAlign: "left" }}>{row?.bank_id}</div>
//       //     </Tooltip>
//       //   ),
//       //   width: "150px",
//       // },
//       {
//         name: "Credit",
//         selector: (row) => (
//           <Tooltip title={row?.credit}>
//             <div style={{ textAlign: "left" }}>{row?.credit || "-"}</div>
//           </Tooltip>
//         ),
//         width: "150px",
//       },
//       {
//         name: "Debit",
//         selector: (row) => (
//           <Tooltip title={row?.debit}>
//             <div style={{ textAlign: "left" }}>{row?.debit || "-"}</div>
//           </Tooltip>
//         ),
//         width: "150px",
//       },
//       {
//         name: "Balance",
//         selector: (row) => (
//           <Tooltip title={row?.balance}>
//             <div style={{ textAlign: "left" }}>{row?.balance || "-"}</div>
//           </Tooltip>
//         ),
//         width: "150px",
//       },

//       //       {
//       //         name: "Status",
//       //         selector: (row) =>
//       //  <CommonStatus value={row.is_active} />
//       //       },
//       // {
//       //   name: "Actions",
//       //   selector: (row) => (
//       //     <IconButton
//       //       color="primary"
//       //       onClick={() => {
//       //         setSelectedService(row);
//       //         setOpenEdit(true);
//       //       }}
//       //     >
//       //       <Edit />
//       //     </IconButton>
//       //   ),
//       //   width: "100px",
//       // },
//     ],
//     []
//   );

//   return (
//     <Box>
//       <CreateAccountStatement
//         open={openCreate}
//         handleClose={() => setOpenCreate(false)}
//         handleSave={handleSaveCreate}
//         onFetchRef={refreshUsers}
//         accountId={account_id}
//         balance={balance}
//       />

//       <CommonTable
//         onFetchRef={handleFetchRef}
//         columns={columns}
//         endpoint={ApiEndpoints.GET_ACCOUNT_STATEMENTS}
//         filters={filters}
//         Button={Button}
//         queryParam={query} // <-- now reactive
//         customHeader={
//           <Box display="flex" alignItems="center" gap={1}>
//             {/* Excel Export Button */}
//             <Tooltip title="Export to Excel">
//               <IconButton
//                 color="primary"
//                 onClick={() => {
//                   console.log("Export to Excel clicked");
//                 }}
//               >
//                 <img
//                   src={excelIcon} // your Excel image
//                   alt="Excel"
//                   style={{ width: 24, height: 24 }}
//                 />
//               </IconButton>
//             </Tooltip>

//             {/* Delete Button */}
//             <Tooltip title="Delete Last Transaction">
//               <IconButton color="error" onClick={() => setOpenDelete(true)}>
//                 <Delete />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         }
//       />

//       <UpdateAccountStatement
//         open={openUpdate}
//         row={selectedAccount}
//         handleClose={() => {
//           setOpenUpdate(false);
//         }}
//         handleSave={handleSaveUpdate}
//         onFetchRef={refreshUsers}
//       />
//       <DeleteConfirmationModal
//         open={openDelete}
//         handleClose={() => setOpenDelete(false)}
//         onFetchRef={refreshUsers}
//         userId={user?.id}
//       />
//     </Box>
//   );
// };

// export default AccountStatement;

import { useMemo, useContext, useState, useRef, useEffect } from "react";
import { Box, Button, Tooltip, IconButton } from "@mui/material";
import { DateRangePicker } from "rsuite";
import * as XLSX from "xlsx";
import {
  datemonthYear,
  yyyymmdd,
  ddmmyy,
  dateToTime1,
  predefinedRanges,
} from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import { Delete } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import CreateAccountStatement from "./CreateAccountStatement";
import UpdateAccountStatement from "./UpdateAccountStatement";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { apiCall } from "../api/apiClient";
import { useToast } from "../utils/ToastContext";
import { excelIcon } from "../iconsImports";
import { useLocation } from "react-router-dom";

const AccountStatement = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const authCtx = useContext(AuthContext);
  const { showToast } = useToast();
  const user = authCtx?.user;

  const location = useLocation();
  const account_id = location.state?.account_id;
  const balance = location.state?.balance || 0;

  const fetchUsersRef = useRef(null);
  const [filterValues, setFilterValues] = useState({ dateVal: "" });
  const [query, setQuery] = useState(`account_id=${account_id}`);
  const [excelLoading, setExcelLoading] = useState(false);

  const refreshAccounts = () =>
    fetchUsersRef.current && fetchUsersRef.current();

  const handleDownloadExcel = async () => {
    try {
      setExcelLoading(true); // ⬅️ Start loader
      showToast("Preparing Excel...", "info");

      const { response, error } = await apiCall(
        "POST",
        `${ApiEndpoints.GET_ACCOUNT_STATEMENTS}?${query}`
      );

      if (error || !response?.data?.data) {
        showToast("No records available to export.", "warning");
        return;
      }

      const tableData = response.data.data.map((row, index) => ({
        "S.No": index + 1,
        Date: ddmmyy(row.created_at),
        Time: dateToTime1(row.created_at),
        Particulars: row.particulars || "",
        Remarks: row.remarks || "",
        Credit: row.credit,
        Debit: row.debit,
        Balance: row.balance,
        Added_By: row.created_by,
      }));

      const worksheet = XLSX.utils.json_to_sheet(tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Account Statements");

      XLSX.writeFile(workbook, `AccountStatements_${account_id}.xlsx`);
      showToast("Excel Downloaded Successfully!", "success");
    } catch (err) {
      console.error("Excel download error:", err);
      showToast("Failed to download Excel", "error");
    } finally {
      setExcelLoading(false); // ⬅️ Stop loader
    }
  };

  const handleConfirmDelete = async () => {
    const { response, error } = await apiCall(
      "POST",
      ApiEndpoints.DELETE_ACCOUNT_STATEMENT,
      { user_id: user?.id }
    );

    if (response) {
      showToast("Last record deleted successfully", "success");
      refreshAccounts();
    } else {
      showToast(error?.message || "Failed to delete record", "error");
    }
    setOpenDelete(false);
  };

  const columns = useMemo(
    () => [
      {
        name: (
          <DateRangePicker
            showOneCalendar
            placeholder="Date"
            size="xs"
            cleanable
            ranges={predefinedRanges}
            value={filterValues.dateVal}
            onChange={(value) => {
              if (!value) {
                setFilterValues({ dateVal: "" });
                setQuery(`account_id=${account_id}`);
                return refreshAccounts();
              }

              const newQuery = `account_id=${account_id}&start=${yyyymmdd(
                value[0]
              )}&end=${yyyymmdd(value[1])}`;
              setFilterValues({ dateVal: value });
              setQuery(newQuery);
              refreshAccounts();
            }}
            style={{ width: 200 }}
          />
        ),
        selector: (row) => datemonthYear(row.created_at),
      },
      { name: "By", selector: (row) => row.created_by },
      { name: "Particulars", selector: (row) => row.particulars || "-" },
      { name: "Remarks", selector: (row) => row.remarks || "-" },
      { name: "Credit", selector: (row) => row.credit },
      { name: "Debit", selector: (row) => row.debit },
      { name: "Balance", selector: (row) => row.balance },
    ],
    [filterValues]
  );

  return (
    <Box>
      <CreateAccountStatement
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        onFetchRef={refreshAccounts}
        accountId={account_id}
        balance={balance}
      />

      <CommonTable
        onFetchRef={(fetchFn) => (fetchUsersRef.current = fetchFn)}
        columns={columns}
        endpoint={ApiEndpoints.GET_ACCOUNT_STATEMENTS}
        queryParam={query}
        customHeader={
          <Box display="flex" gap={1}>
            <Tooltip title="Download Excel">
              <IconButton
                color="primary"
                onClick={handleDownloadExcel}
                disabled={excelLoading}
              >
                {excelLoading ? (
                  <span
                    className="loader"
                    style={{
                      width: 20,
                      height: 20,
                      border: "2px solid",
                      borderRadius: "50%",
                      borderTop: "2px solid transparent",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                ) : (
                  <img src={excelIcon} alt="Excel" style={{ width: 24 }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Last Entry">
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
        handleClose={() => setOpenUpdate(false)}
        onFetchRef={refreshAccounts}
      />

      <DeleteConfirmationModal
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        handleConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default AccountStatement;
