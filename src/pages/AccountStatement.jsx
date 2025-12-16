

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
      { name: "Id", selector: (row) => row.account_id },

      {
        name: (
          <DateRangePicker
            showOneCalendar
            placeholder="Date"
            size="medium"
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
      { name: "By", selector: (row) => row.claimed_by },
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
        account_id={account_id}
      />
    </Box>
  );
};

export default AccountStatement;
