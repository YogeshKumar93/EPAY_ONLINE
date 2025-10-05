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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonTable from "../components/common/CommonTable";
import CreateBankStatement from "./CreateBankStatement";
import CommonLoader from "../components/common/CommonLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import predefinedRanges from "../utils/predefinedRanges";
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

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const { bank_id, bank_name, balance: oldBalance } = location.state || {};

  const [loading, setLoading] = useState(true);
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

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = `${process.env.PUBLIC_URL}/uplodeexcel2.xlsx`;
    link.download = "uplodeexcel2.xlsx";
    link.click();
  };
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
      <CommonLoader loading={loading} text="Loading Statements..." />

      {!loading && (
        <Box>
          <CreateBankStatement
            open={true}
            handleClose={() => {}}
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
                    backgroundColor: "#2275b7",
                    color: "#fff",
                    "&:hover": { backgroundColor: primaryColor() },
                  }}
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowBackIcon />}
                >
                  Back
                </Button>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Upload Excel">
                    <IconButton
                      component="label"
                      size="small"
                      sx={{
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "rgba(80, 11, 185, 0.27)",
                        },
                      }}
                    >
                      {/* Use the imported image */}
                      <img
                        src={uploadImg}
                        alt="Excel"
                        style={{ width: 23, height: 23 }}
                      />

                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            ExcelToJsonUploader({
                              file,
                              bankId: bank_id,
                              refresh: refreshStatements,
                              setQuery,
                            });
                            e.target.value = "";
                          }
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download Sample Excel">
                    <IconButton
                      size="small"
                      sx={{
                        "&:hover": { backgroundColor: "#54a09fff" },
                        padding: "6px",
                      }}
                      onClick={handleDownloadSample}
                    >
                      <img
                        src={sampleFileImg}
                        alt="Excel"
                        style={{ width: 23, height: 23 }}
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
                      component="label"
                      size="small"
                      sx={{
                        color: "#fff",
                        "&:hover": { backgroundColor: "#098f60ff" },
                      }}
                    >
                      {/* Use the imported image */}
                      <img
                        src={excelImg}
                        alt="Excel"
                        style={{ width: 23, height: 23 }}
                      />
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            ExcelToJsonUploader({
                              file,
                              bankId: bank_id,
                              refresh: refreshStatements,
                              setQuery,
                            });
                            e.target.value = "";
                          }
                        }}
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
