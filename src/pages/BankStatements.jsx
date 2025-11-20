import { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DateRangePicker } from "rsuite";
import * as XLSX from "xlsx";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonTable from "../components/common/CommonTable";
import CreateBankStatement from "./CreateBankStatement";
import CommonLoader from "../components/common/CommonLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import predefinedRanges from "../utils/predefinedRanges";
import DownloadExcel from "./DownloadExcel";
import {
  yyyymmdd,
  datemonthYear1,
  ddmmyy,
  ddmmyyWithTime,
  dateToTime1,
} from "../utils/DateUtils";
import { capitalize1 } from "../utils/TextUtil";
import { currencySetter } from "../utils/Currencyutil";
import ApiEndpoints from "../api/ApiEndpoints";
import excel from "../assets/excel.png";
import sampleFileImg from "../assets/animate-icons/sampleFile.png";
import excelImg from "../assets/animate-icons/ExcelFile.png";
import uploadImg from "../assets/animate-icons/uploadFile.png";
import AuthContext from "../contexts/AuthContext";
import { primaryColor, secondaryColor } from "../utils/setThemeColor";
import CommonStatus from "../components/common/CommonStatus";
import { apiCall } from "../api/apiClient";
import { useToast } from "../utils/ToastContext";

const BankStatements = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const { showToast } = useToast();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);
  const [openDownloadExcel, SetOpenDownloadExcel] = useState(false);
  const { bank_id, bank_name, balance: oldBalance } = location.state || {};

  const [openUploadSuccess, setOpenUploadSuccess] = useState(false);

  const [filterValues, setFilterValues] = useState({ date: {}, dateVal: "" });
  const [query, setQuery] = useState(`bank_id=${bank_id}`);

  const fetchStatementsRef = useRef(null);
  const handleFetchRef = (fetchFn) => {
    fetchStatementsRef.current = fetchFn;
  };
  const refreshStatements = () => {
    if (fetchStatementsRef.current) fetchStatementsRef.current();
  };

  useEffect(() => {
    if (bank_id && oldBalance !== undefined) setLoading(false);
  }, [bank_id, oldBalance]);

  // const handleDownloadSample = () => {
  //   const link = document.createElement("a");
  //   link.href = `${process.env.PUBLIC_URL}/uplodeexcel2.xlsx`;
  //   link.download = "uplodeexcel2.xlsx";
  //   link.click();
  // };

  const handleConfirmDelete = async () => {
    try {
      const payload = { bank_id: bank_id };
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.DELETE_LAST_TXN,
        payload
      );

      if (response) {
        showToast(response.message || "Last transaction deleted", "success");
        refreshStatements();
      } else {
        showToast(error || "Failed to delete last transaction", "error");
      }
    } catch (err) {
      console.error("Error deleting last txn:", err);
      showToast("Error deleting last transaction", "error");
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleDownloadExcel = async () => {
    try {
      showToast("Preparing Excel download...", "info");

      // Fetch filtered data (same API as your table)
      const { response, error } = await apiCall(
        "POST",
        `${ApiEndpoints.GET_BANK_STATEMENTS}?${query}`
      );

      if (error || !response?.data) {
        showToast("No data found for selected filters", "warning");
        return;
      }

      const tableData = response.data.map((row, index) => ({
        "S.No": index + 1,
        Date: ddmmyy(row.created_at),
        Time: dateToTime1(row.created_at),
        "Handled By": row.handle_by,
        Particulars: row.particulars,
        Remarks: row.remarks,
        MOP: row.mop,
        Credit: row.credit,
        Debit: row.debit,
        Balance: row.balance,
        Status: row.status === 0 ? "UNCLAIMED" : "CLAIMED",
      }));

      // Convert to Excel worksheet
      const worksheet = XLSX.utils.json_to_sheet(tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bank Statements");

      // Trigger download
      XLSX.writeFile(workbook, `BankStatements_${bank_name || "Bank"}.xlsx`);

      showToast("Excel downloaded successfully!", "success");
    } catch (err) {
      console.error("Excel download error:", err);
      showToast("Failed to download Excel", "error");
    }
  };

  // 👇 Add this inside BankStatements component
const handleUploadExcel = async (file) => {
  try {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData.length) {
        showToast("No data found in Excel", "error");
        return;
      }

      showToast(`Uploading ${jsonData.length} records...`, "info");
      setLoading(true);

      let successCount = 0;

      // ✅ Loop through all rows but stop if an API call fails
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];

        const payload = {
          bank_id: bank_id,
          balance: oldBalance || 0,
          date: (() => {
            if (row.date) {
              const parsedDate = new Date(row.date);
              if (!isNaN(parsedDate)) {
                return parsedDate.toISOString().slice(0, 19).replace("T", " ");
              }
            }
            return new Date().toISOString().slice(0, 19).replace("T", " ");
          })(),
          credit: Number(row.credit || 0),
          debit: Number(row.debit || 0),
          mop: row.mop || "",
          handle_by: row.handle_by || "",
          particulars: row.particulars || "",
        };

        const { response, error } = await apiCall(
          "POST",
          ApiEndpoints.CREATE_BANK_STATEMENT,
          payload
        );

        if (response) {
          successCount++;
        } else {
            showToast(error?.errors, "error");
          setLoading(false);
          // ❌ Stop loop immediately if one API fails
          return;
        }
      }

      showToast(`✅ Uploaded ${successCount} records successfully`, "success");
      refreshStatements();
      setOpenUploadSuccess(true);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  } catch (err) {
    console.error("Error reading Excel file:", err);
    showToast("Failed to process Excel file", "error");
    setLoading(false);
  }
};


  const columns = [
    {
      name: "Date",
      selector: (row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
            <span>
              {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
            </span>
          </Tooltip>

          <Tooltip title={`Updated: ${ddmmyyWithTime(row.updated_at)}`} arrow>
            <span>
              {ddmmyy(row.updated_at)} {dateToTime1(row.updated_at)}
            </span>
          </Tooltip>
        </div>
      ),
      wrap: true,
      width: "190px",
    },
    { name: "ID", selector: (row) => row.bank_id, width: "80px" },
    {
      name: (
        <DateRangePicker
          showOneCalendar
          placeholder="Deposited Date"
          size="medium"
          cleanable
          ranges={predefinedRanges}
          value={filterValues.dateVal}
          onChange={(value) => {
            if (!value) {
              setFilterValues({ date: {}, dateVal: "" });
              setQuery(`bank_id=${bank_id}`);
              return;
            }
            const dates = { start: value[0], end: value[1] };
            setFilterValues({
              ...filterValues,
              date: { start: yyyymmdd(dates.start), end: yyyymmdd(dates.end) },
              dateVal: value,
            });
            setQuery(
              `bank_id=${bank_id}&start=${yyyymmdd(dates.start)}&end=${yyyymmdd(
                dates.end
              )}`
            );
          }}
          style={{ width: 200 }} // <-- set the width you want
        />
      ),
      selector: (row) => datemonthYear1(row.created_at),
    },

    { name: "By", selector: (row) => row.handle_by },
    {
      name: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span>Particulars</span>
          <FormControl sx={{ width: 200 }}>
            <TextField
              autoComplete="off"
              size="small"
              placeholder="Search"
              onChange={(e) =>
                setQuery(`bank_id=${bank_id}&search=${e.target.value}`)
              }
            />
          </FormControl>
        </Box>
      ),
      selector: (row) => (
        <div
          className="break-words"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            textAlign: "left",
            fontSize: "13px",
          }}
        >
          {row.particulars ? capitalize1(row.particulars) : "-"}
        </div>
      ),
      width: "300px",
      wrap: true,
    },
    {
      name: "Remarks",
      selector: (row) => (
        <div
          className="break-words"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            textAlign: "left",
            fontSize: "13px",
          }}
        >
          {row.remarks ? capitalize1(row.remarks) : "-"}
        </div>
      ),
      width: "200px",
      wrap: true,
    },
    { name: "MOP", selector: (row) => row.mop },
    { name: "Credit", selector: (row) => currencySetter(row.credit) },
    { name: "Debit", selector: (row) => currencySetter(row.debit) },
    { name: "Balance", selector: (row) => currencySetter(row.balance) },
    {
      name: "Status",
      selector: (row) => (
        <div style={{ textAlign: "right", fontSize: "11px", fontWeight: 600 }}>
          {row.status === 0 ? "UNCLAIMED" : "CLAIMED"}
        </div>
      ),
      center: true,
      width: "70px",
    },
  ];

  return (
    <>
      {/* Existing Loader */}
      <CommonLoader loading={loading} text="Loading Statements..." />

      <Dialog
        open={openUploadSuccess}
        onClose={() => setOpenUploadSuccess(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          Data Uploaded Successfully
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 2 }}>
          Your Excel data has been uploaded and processed successfully.
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => setOpenUploadSuccess(false)}
            sx={{
              backgroundColor: primaryColor(),
              color: "#fff",
              "&:hover": { backgroundColor: secondaryColor() },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {!loading && (
        <Box>
          <CreateBankStatement
            open={true}
            handleClose={() => {}}
            onFetchRef={refreshStatements}
            bankId={bank_id}
            balance={oldBalance}
          />

          <DownloadExcel
            open={openDownloadExcel}
            handleClose={() => SetOpenDownloadExcel(false)}
            onFetchRef={refreshStatements}
            bankId={bank_id}
            balance={oldBalance}
          />
          <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete the last bank statement?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteModal} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <CommonTable
            onFetchRef={handleFetchRef}
            endpoint={ApiEndpoints.GET_BANK_STATEMENTS}
            queryParam={query}
            columns={columns}
            customHeader={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  mb: 1,
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: "#14bf48ff",
                    color: "#fff",
                    "&:hover": { backgroundColor: primaryColor() },
                  }}
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowBackIcon />}
                >
                  Back
                </Button>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Download Sample Excel">
                    <IconButton
                      component="label"
                      size="small"
                      sx={{
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "rgba(80, 11, 185, 0.27)",
                        },
                      }}
                      onClick={() => SetOpenDownloadExcel(true)}
                    >
                      {/* Use the imported image */}
                      <img
                        src={uploadImg}
                        alt="Excel"
                        style={{ width: 23, height: 23 }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Upload Excel">
                    <IconButton
                      component="label"
                      size="small"
                      sx={{
                        color: "#fff",
                        "&:hover": { backgroundColor: "#098f60ff" },
                      }}
                    >
                      <img
                        src={sampleFileImg}
                        alt="Upload Excel"
                        style={{ width: 23, height: 23 }}
                      />
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleUploadExcel(file); // ✅ this now works
                            e.target.value = ""; // reset input
                          }
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Last Txn">
                    <IconButton
                      size="small"
                      sx={{ color: "red" }}
                      onClick={handleOpenDeleteModal} // open modal
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

                  {/* Upload Excel */}
                  <Tooltip title="Download Excel">
                    <IconButton
                      size="small"
                      sx={{
                        color: "#fff",
                        "&:hover": { backgroundColor: "#098f60ff" },
                      }}
                      onClick={handleDownloadExcel} // ✅ attach function here
                    >
                      <img
                        src={excelImg}
                        alt="Download Excel"
                        style={{ width: 23, height: 23 }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
          />
        </Box>
      )}
    </>
  );
};

export default BankStatements;
